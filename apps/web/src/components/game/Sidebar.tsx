'use client';

import { useState } from 'react';
import styles from './Sidebar.module.css';

interface SidebarProps {
    onLogout: () => void;
    musicVolume: number;
    onVolumeChange: (volume: number) => void;
    city: string;
    race: string;
    currentView: 'city' | 'world';
    onViewChange: (view: 'city' | 'world') => void;
    onReportsClick: () => void;
}

const RACE_IMAGES: Record<string, string> = {
    elfo: '/assets/races/Elf.png',
    humano: '/assets/races/Human.png',
    orco: '/assets/races/Orc.png',
    enano: '/assets/races/Dwarf.png',
};

export function Sidebar({ onLogout, musicVolume, onVolumeChange, city, race, currentView, onViewChange, onReportsClick }: SidebarProps) {
    const [showSettings, setShowSettings] = useState(false);

    // Fallback if race key doesn't match exactly or image is missing
    const raceImage = RACE_IMAGES[race.toLowerCase()] || RACE_IMAGES['humano'];

    const menuItems = [
        { id: 'city', label: 'Ciudad', icon: '🏰', view: 'city' as const },
        { id: 'world', label: 'Mapa', icon: '🌍', view: 'world' as const },
        { id: 'messages', label: 'Mensajes', icon: '📜' },
        { id: 'reports', label: 'Informes', icon: '📨', action: onReportsClick },
        { id: 'ranking', label: 'Clasificación', icon: '🏆' },
        { id: 'profile', label: 'Perfil', icon: '👤' },
    ];

    return (
        <div className={styles.sidebar}>
            {/* Top Ornamental Header with Profile Orb */}
            <div className={styles.sidebarHeader}>
                <div className={styles.orbContainer}>
                    <div className={styles.orbBorder}>
                        <img src={raceImage} alt={race} className={styles.raceImage} />
                    </div>
                    <div className={styles.levelBadge}>1</div>
                </div>
                <div className={styles.headerInfo}>
                    <div className={styles.cityName}>{city}</div>
                    <div className={styles.raceName}>{race}</div>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className={styles.menuList}>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={`${styles.menuItem} ${item.view && currentView === item.view ? styles.active : ''}`}
                        onClick={() => {
                            if (item.view) onViewChange(item.view);
                            if ((item as any).action) (item as any).action();
                        }}
                    >
                        <div className={styles.menuIconFrame}>
                            <span className={styles.menuIcon}>{item.icon}</span>
                        </div>
                        <span className={styles.menuLabel}>{item.label}</span>
                    </button>
                ))}

                <div className={styles.divider} />

                {/* Settings & System */}
                <button
                    className={styles.menuItem}
                    onClick={() => setShowSettings(!showSettings)}
                >
                    <div className={styles.menuIconFrame}>
                        <SettingsIcon />
                    </div>
                    <span className={styles.menuLabel}>Ajustes</span>
                </button>

                <button
                    className={styles.menuItem}
                    onClick={onLogout}
                >
                    <div className={styles.menuIconFrame}>
                        <LogoutIcon />
                    </div>
                    <span className={styles.menuLabel}>Salir</span>
                </button>
            </div>

            {/* Settings Modal (kept logic) */}
            {showSettings && (
                <div className={styles.settingsPanel}>
                    <div className={styles.settingsHeader}>
                        <span>⚙️ Ajustes</span>
                        <button
                            className={styles.closeBtn}
                            onClick={() => setShowSettings(false)}
                        >
                            ✕
                        </button>
                    </div>
                    <div className={styles.settingsContent}>
                        <div className={styles.settingRow}>
                            <div className={styles.settingLabel}>
                                <span className={styles.settingIcon}>🎵</span>
                                <span>Música</span>
                            </div>
                            <div className={styles.volumeControl}>
                                <button
                                    className={styles.volumeBtn}
                                    onClick={() => onVolumeChange(musicVolume === 0 ? 0.3 : 0)}
                                >
                                    {musicVolume === 0 ? '🔇' : musicVolume < 0.5 ? '🔈' : '🔊'}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={musicVolume * 100}
                                    onChange={(e) => onVolumeChange(parseInt(e.target.value) / 100)}
                                    className={styles.volumeSlider}
                                />
                                <span className={styles.volumeValue}>
                                    {Math.round(musicVolume * 100)}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function SettingsIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
    );
}

function LogoutIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
    );
}
