'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useVolume } from '@/hooks/useVolume';
import styles from '../game/GameNotifications.module.css';

// Types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type?: ToastType) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const { sfxVolume } = useVolume();

    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { id, message, type };

        // Play notification sound
        try {
            const audio = new Audio('/assets/sounds/sfx/notification.mp3');
            audio.volume = sfxVolume;
            audio.playbackRate = 1.6; // Suena más rápido y corto
            audio.play().catch(e => console.log('Audio play prevented by browser', e));
        } catch (error) {
            console.error('Error playing notification sound:', error);
        }

        setToasts(prev => {
            const updated = [...prev, newToast];
            // Keep only latest 5
            if (updated.length > 5) {
                return updated.slice(updated.length - 5);
            }
            return updated;
        });

        // Auto remove after 15 seconds (prolongado)
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 15000);
    }, [sfxVolume]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className={styles.notificationContainer}>
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`${styles.notification} ${styles[toast.type]}`}
                    >
                        <span className={styles.icon}>{getIcon(toast.type)}</span>
                        <div className={styles.content}>
                            <p className={styles.message}>{toast.message}</p>
                        </div>
                        <button
                            className={styles.closeBtn}
                            onClick={() => removeToast(toast.id)}
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

function getIcon(type: ToastType) {
    switch (type) {
        case 'success': return '📜'; // Medieval Icons
        case 'error': return '⚔️';
        case 'warning': return '⚠️';
        default: return '✉️';
    }
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
