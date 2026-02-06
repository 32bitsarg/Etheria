'use client';

import { useEffect, useState } from 'react';
import { messaging as appwriteMessaging } from '@/lib/appwrite';
import { requestForToken, onMessageListener } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from './ToastContext';
import styles from './PushNotificationManager.module.css';

export function PushNotificationManager() {
    const { userId, isLoggedIn } = useAuth();
    const { addToast } = useToast();
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handleTrigger = () => {
            requestPermission();
        };

        window.addEventListener('trigger-push-permission', handleTrigger);
        return () => window.removeEventListener('trigger-push-permission', handleTrigger);
    }, [userId]);

    useEffect(() => {
        if (typeof window === 'undefined' || !('Notification' in window)) return;
        setPermission(Notification.permission);

        // Listener para mensajes cuando la app ESTÁ abierta
        if (Notification.permission === 'granted') {
            onMessageListener().then((payload: any) => {
                console.log('FCM Message received in foreground:', payload);
                addToast(payload.notification.title + ': ' + payload.notification.body, 'info');
            });
        }

        // Lógica de prompt automático al loguear en móvil
        if (isLoggedIn && userId && Notification.permission === 'default') {
            const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
            const hasAsked = localStorage.getItem(`pwa_push_asked_${userId}`);

            if (isMobile && !hasAsked) {
                setShowPrompt(true);
            }
        }
    }, [isLoggedIn, userId]);

    const requestPermission = async () => {
        if (!('Notification' in window)) return;

        try {
            const result = await Notification.requestPermission();
            setPermission(result);
            localStorage.setItem(`pwa_push_asked_${userId}`, 'true');
            setShowPrompt(false);

            if (result === 'granted' && isLoggedIn) {
                await registerPush();
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
        }
    };

    const handleDecline = () => {
        localStorage.setItem(`pwa_push_asked_${userId}`, 'true');
        setShowPrompt(false);
    };

    const registerPush = async () => {
        try {
            const fcmToken = await requestForToken();

            if (fcmToken && userId) {
                const PROVIDER_ID = process.env.NEXT_PUBLIC_APPWRITE_FCM_PROVIDER_ID || 'fcm-etheria';

                try {
                    // @ts-ignore
                    await appwriteMessaging.createPushTarget(
                        'unique()',
                        fcmToken,
                        PROVIDER_ID,
                        userId
                    );

                    addToast('¡Notificaciones activadas!', 'success');
                } catch (appwriteErr) {
                    console.error('Error registering target in Appwrite:', appwriteErr);
                }
            }
        } catch (error) {
            console.error('Failed to register push:', error);
        }
    };

    if (!showPrompt) return null;

    return (
        <div className={styles.promptOverlay}>
            <div className={styles.parchment}>
                <div className={styles.icon}>🔔</div>
                <h2 className={styles.title}>Mensajeros del Reino</h2>
                <p className={styles.message}>
                    ¿Deseas que tus generales te avisen cuando tus construcciones finalicen o tus ejércitos sean atacados?
                </p>
                <div className={styles.actions}>
                    <button className={styles.declineBtn} onClick={handleDecline}>Ahora no</button>
                    <button className={styles.acceptBtn} onClick={requestPermission}>Activar</button>
                </div>
            </div>
        </div>
    );
}

// Exportar una función global para que los Ajustes puedan invocarla
export const triggerPushPermission = () => {
    const event = new CustomEvent('trigger-push-permission');
    window.dispatchEvent(event);
};
