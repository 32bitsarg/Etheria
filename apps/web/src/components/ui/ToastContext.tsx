'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

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

    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { id, message, type };

        setToasts(prev => [...prev, newToast]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="toast-container">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`toast toast-${toast.type} animate-slide-in`}
                        onClick={() => removeToast(toast.id)}
                    >
                        {getIcon(toast.type)}
                        <span>{toast.message}</span>
                    </div>
                ))}
                <style jsx>{`
                    .toast-container {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        z-index: 9999;
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                        pointer-events: none;
                    }
                    .toast {
                        pointer-events: auto;
                        min-width: 300px;
                        padding: 16px;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                        font-family: system-ui, -apple-system, sans-serif;
                        font-size: 0.9375rem;
                        font-weight: 500;
                        cursor: pointer;
                        animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        transition: all 0.2s;
                    }
                    .toast:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    }
                    .toast-success {
                        background: #ecfdf5;
                        border: 1px solid #a7f3d0;
                        color: #065f46;
                    }
                    .toast-error {
                        background: #fef2f2;
                        border: 1px solid #fecaca;
                        color: #991b1b;
                    }
                    .toast-warning {
                        background: #fffbeb;
                        border: 1px solid #fde68a;
                        color: #92400e;
                    }
                    .toast-info {
                        background: #eff6ff;
                        border: 1px solid #bfdbfe;
                        color: #1e40af;
                    }
                    @keyframes slideIn {
                        from { opacity: 0; transform: translateX(100%); }
                        to { opacity: 1; transform: translateX(0); }
                    }
                `}</style>
            </div>
        </ToastContext.Provider>
    );
}

function getIcon(type: ToastType) {
    switch (type) {
        case 'success': return '✅';
        case 'error': return '❌';
        case 'warning': return '⚠️';
        default: return 'ℹ️';
    }
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
