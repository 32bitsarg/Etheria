'use client';

import { useState, useEffect } from 'react';
import styles from './PWAUpdateHandler.module.css';

export function PWAUpdateHandler() {
    const [worker, setWorker] = useState<ServiceWorker | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

        const handleUpdate = (reg: ServiceWorkerRegistration) => {
            if (!reg.waiting) return;
            setWorker(reg.waiting);
            setShowPrompt(true);
        };

        navigator.serviceWorker.getRegistration().then((reg) => {
            if (reg) {
                // Check if there's already a worker waiting
                if (reg.waiting) handleUpdate(reg);

                // Listen for new workers
                reg.addEventListener('updatefound', () => {
                    const newWorker = reg.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                handleUpdate(reg);
                            }
                        });
                    }
                });
            }
        });

        // Handle reload when the new worker takes over
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            refreshing = true;
            window.location.reload();
        });
    }, []);

    const updateApp = () => {
        if (worker) {
            worker.postMessage({ type: 'SKIP_WAITING' });
            setShowPrompt(false);
        }
    };

    if (!showPrompt) return null;

    return (
        <div className={styles.updateBanner}>
            <div className={styles.content}>
                <span className={styles.icon}>✨</span>
                <div className={styles.text}>
                    <p className={styles.title}>¡Nueva versión del reino!</p>
                    <p className={styles.desc}>Los escribas han actualizado los mapas y leyes.</p>
                </div>
                <div className={styles.actions}>
                    <button className={styles.laterBtn} onClick={() => setShowPrompt(false)}>Luego</button>
                    <button className={styles.updateBtn} onClick={updateApp}>Actualizar</button>
                </div>
            </div>
        </div>
    );
}
