'use client';

import { ThemeProvider } from '@/hooks/useTheme';
import { AuthProvider } from '@/hooks/useAuth';
import { ToastProvider } from '@/components/ui/ToastContext';
import { VolumeProvider } from '@/hooks/useVolume';
import { ConnectivityGuard } from '@/components/ui/ConnectivityGuard';
import { PWAUpdateHandler } from '@/components/ui/PWAUpdateHandler';
import { PushNotificationManager } from '@/components/ui/PushNotificationManager';
import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then((registration) => {
                    // Service Worker registrado con éxito
                }).catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });
            });
        }
    }, []);

    return (
        <VolumeProvider>
            <ThemeProvider>
                <ToastProvider>
                    <AuthProvider>
                        <ConnectivityGuard>
                            {children}
                            <PWAUpdateHandler />
                            <PushNotificationManager />
                        </ConnectivityGuard>
                    </AuthProvider>
                </ToastProvider>
            </ThemeProvider>
        </VolumeProvider>
    );
}
