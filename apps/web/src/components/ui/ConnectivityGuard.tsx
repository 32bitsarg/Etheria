'use client';

import { useState, useEffect } from 'react';
import styles from './ConnectivityGuard.module.css';

export function ConnectivityGuard({ children }: { children: React.ReactNode }) {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        // Initial check
        if (!navigator.onLine) {
            setIsOffline(true);
        }

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (isOffline) {
        return (
            <div className={styles.offlineOverlay}>
                <div className={styles.parchment}>
                    <div className={styles.icon}>🌩️</div>
                    <h2 className={styles.title}>Mensajeros Perdidos</h2>
                    <p className={styles.message}>
                        Tus exploradores han perdido el rastro del reino.
                        Parece que la conexión con el Gran Servidor se ha interrumpido.
                    </p>
                    <div className={styles.divider} />
                    <p className={styles.submessage}>
                        Verifica tu señal para retomar el mando de tus ejércitos.
                    </p>
                    <button
                        className={styles.retryBtn}
                        onClick={() => window.location.reload()}
                    >
                        Intentar Reconectar
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
