'use client';

import styles from './MobileBottomNav.module.css';

interface MobileBottomNavProps {
    currentView: 'city' | 'world';
    onViewChange: (view: 'city' | 'world') => void;
    onPanelChange: (panel: string | null) => void;
}

export function MobileBottomNav({ currentView, onViewChange, onPanelChange }: MobileBottomNavProps) {
    const items = [
        { id: 'city', label: 'Ciudad', icon: '/assets/hud/cityicon.png', view: 'city' as const },
        { id: 'world', label: 'Mapa', icon: '/assets/hud/worldicon.png', view: 'world' as const },
        { id: 'messages', label: 'SMS', icon: '/assets/hud/messageicon.png', panel: 'messages' },
        { id: 'reports', label: 'Informes', icon: '/assets/hud/informesicon.png', panel: 'reports' },
        { id: 'ranking', label: 'Top', icon: '/assets/hud/rankicon.png', panel: 'ranking' },
        { id: 'profile', label: 'Yo', icon: '/assets/hud/profileicon.png', panel: 'profile' },
        { id: 'settings', label: 'Ajustes', icon: '/assets/hud/settingsicon.png', panel: 'settings' },
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
                    <img src={item.icon} className={styles.navIcon} alt={item.label} />
                    <span className={styles.label}>{item.label}</span>
                </button>
            ))}
        </div>
    );
}
