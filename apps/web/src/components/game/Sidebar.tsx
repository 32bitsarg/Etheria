'use client';

import { useState, memo, useMemo } from 'react';
import styles from './Sidebar.module.css';

interface SidebarProps {
    onLogout: () => void;
    musicVolume: number;
    sfxVolume: number;
    onMusicVolumeChange: (volume: number) => void;
    onSfxVolumeChange: (volume: number) => void;
    city: string;
    race: string;
    currentView: 'city' | 'world';
    onViewChange: (view: 'city' | 'world') => void;
    onReportsClick: () => void;
    onMessagesClick: () => void;
    onRankingClick: () => void;
    onProfileClick: () => void;
    level: number;
}

const RACE_IMAGES: Record<string, string> = {
    elfo: '/assets/races/Elf.webp',
    humano: '/assets/races/Human.webp',
    orco: '/assets/races/Orc.webp',
    enano: '/assets/races/Dwarf.webp',
};

export const Sidebar = memo(function Sidebar({ onLogout, musicVolume, sfxVolume, onMusicVolumeChange, onSfxVolumeChange, city, race, currentView, onViewChange, onReportsClick, onMessagesClick, onRankingClick, onProfileClick, level }: SidebarProps) {
    const [showSettings, setShowSettings] = useState(false);

    // Fallback if race key doesn't match exactly or image is missing
    const raceImage = useMemo(() => RACE_IMAGES[race.toLowerCase()] || RACE_IMAGES['humano'], [race]);

    const menuItems = useMemo(() => [
        { id: 'city', label: 'Ciudad', icon: '/assets/hud/cityicon.webp', view: 'city' as const },
        { id: 'world', label: 'Mapa', icon: '/assets/hud/worldicon.webp', view: 'world' as const },
        { id: 'messages', label: 'Mensajes', icon: '/assets/hud/messageicon.webp', action: onMessagesClick },
        { id: 'reports', label: 'Informes', icon: '/assets/hud/informesicon.webp', action: onReportsClick },
        { id: 'ranking', label: 'Clasificación', icon: '/assets/hud/rankicon.webp', action: onRankingClick },
        { id: 'profile', label: 'Perfil', icon: '/assets/hud/profileicon.webp', action: onProfileClick },
    ], [onMessagesClick, onReportsClick, onRankingClick, onProfileClick]);

    return (
        <div className={styles.sidebar}>
            {/* Top Ornamental Header with Profile Orb */}
            <div className={styles.sidebarHeader}>
                <div className={styles.orbContainer}>
                    <div className={styles.orbBorder}>
                        <img src={raceImage} alt={race} className={styles.raceImage} />
                    </div>
                    <div className={styles.levelBadge}>{level}</div>
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
                            <img src={item.icon} alt="" className={styles.iconImage} />
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
                        <img src="/assets/hud/settingsicon.webp" alt="" className={styles.iconImage} />
                    </div>
                    <span className={styles.menuLabel}>Ajustes</span>
                </button>

                <button
                    className={styles.menuItem}
                    onClick={onLogout}
                >
                    <div className={styles.menuIconFrame}>
                        <img src="/assets/hud/logouticon.webp" alt="" className={styles.iconImage} />
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
                        {/* Música */}
                        <div className={styles.settingRow}>
                            <div className={styles.settingLabel}>
                                <span className={styles.settingIcon}>🎵</span>
                                <span>Música</span>
                            </div>
                            <div className={styles.volumeControl}>
                                <button
                                    className={styles.volumeBtn}
                                    onClick={() => onMusicVolumeChange(musicVolume === 0 ? 0.3 : 0)}
                                >
                                    {musicVolume === 0 ? '🔇' : musicVolume < 0.5 ? '🔈' : '🔊'}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={musicVolume * 100}
                                    onChange={(e) => onMusicVolumeChange(parseInt(e.target.value) / 100)}
                                    className={styles.volumeSlider}
                                />
                                <span className={styles.volumeValue}>
                                    {Math.round(musicVolume * 100)}%
                                </span>
                            </div>
                        </div>

                        {/* SFX */}
                        <div className={styles.settingRow} style={{ marginTop: '1rem' }}>
                            <div className={styles.settingLabel}>
                                <span className={styles.settingIcon}>⚔️</span>
                                <span>Efectos</span>
                            </div>
                            <div className={styles.volumeControl}>
                                <button
                                    className={styles.volumeBtn}
                                    onClick={() => onSfxVolumeChange(sfxVolume === 0 ? 0.5 : 0)}
                                >
                                    {sfxVolume === 0 ? '🔇' : sfxVolume < 0.5 ? '🔈' : '🔊'}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={sfxVolume * 100}
                                    onChange={(e) => onSfxVolumeChange(parseInt(e.target.value) / 100)}
                                    className={styles.volumeSlider}
                                />
                                <span className={styles.volumeValue}>
                                    {Math.round(sfxVolume * 100)}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});



