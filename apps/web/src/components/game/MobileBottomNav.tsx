'use client';

import styles from './MobileBottomNav.module.css';

interface MobileBottomNavProps {
    currentView: 'city' | 'world';
    onViewChange: (view: 'city' | 'world') => void;
    onPanelChange: (panel: string | null) => void;
    unreadReports?: number;
    unreadMessages?: number;
}

export function MobileBottomNav({ currentView, onViewChange, onPanelChange, unreadReports = 0, unreadMessages = 0 }: MobileBottomNavProps) {
    const items = [
        { id: 'city', label: 'Ciudad', icon: '/assets/hud/cityicon.webp', view: 'city' as const },
        { id: 'world', label: 'Mapa', icon: '/assets/hud/worldicon.webp', view: 'world' as const },
        { id: 'messages', label: 'SMS', icon: '/assets/hud/messageicon.webp', panel: 'messages', badge: unreadMessages },
        { id: 'market', label: 'Mercado', icon: '/assets/hud/market.webp', panel: 'market' },
        { id: 'reports', label: 'Informes', icon: '/assets/hud/informesicon.webp', panel: 'reports', badge: unreadReports },
        { id: 'ranking', label: 'Top', icon: '/assets/hud/rankicon.webp', panel: 'ranking' },
        { id: 'profile', label: 'Yo', icon: '/assets/hud/profileicon.webp', panel: 'profile' },
        { id: 'settings', label: 'Ajustes', icon: '/assets/hud/settingsicon.webp', panel: 'settings' },
    ];

    return (
        <div className={styles.navContainer}>
            {items.map(item => (
                <button
                    key={item.id}
                    className={`${styles.navItem} ${item.view === currentView ? styles.active : ''}`}
                    onClick={() => {
                        if (item.view) {
                            onViewChange(item.view);
                            onPanelChange(null);
                        } else if (item.panel) {
                            onPanelChange(item.panel);
                        }
                    }}
                >
                    <div className={styles.iconWrapper}>
                        <img src={item.icon} className={styles.navIcon} alt={item.label} />
                        {(item as any).badge > 0 && (
                            <div className={styles.badge}>
                                {(item as any).badge > 9 ? '9+' : (item as any).badge}
                            </div>
                        )}
                    </div>
                    <span className={styles.label}>{item.label}</span>
                </button>
            ))}
        </div>
    );
}
