'use client';

import { useAuth } from '@/hooks/useAuth';
import { useVolume } from '@/hooks/useVolume';
import styles from './MobileSettings.module.css';

interface MobileSettingsProps {
    onClose: () => void;
    musicVolume: number;
    sfxVolume: number;
    onMusicVolumeChange: (v: number) => void;
    onSfxVolumeChange: (v: number) => void;
}

export function MobileSettings({ onClose, musicVolume, sfxVolume, onMusicVolumeChange, onSfxVolumeChange }: MobileSettingsProps) {
    const { logout } = useAuth();

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <img src="/assets/hud/settingsicon.png" className={styles.headerIcon} alt="" />
                    <h2 className={styles.title}>Ajustes del Reino</h2>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>

                <div className={styles.content}>
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Banda Sonora</h3>
                        <div className={styles.settingRow}>
                            <div className={styles.volumeHeader}>
                                <span className={styles.volumeIcon}>
                                    {musicVolume === 0 ? '🔇' : musicVolume < 0.5 ? '🔈' : '🔊'}
                                </span>
                                <span className={styles.volumePercent}>{Math.round(musicVolume * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={musicVolume * 100}
                                onChange={(e) => onMusicVolumeChange(parseInt(e.target.value) / 100)}
                                className={styles.volumeSlider}
                            />
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Efectos de Sonido</h3>
                        <div className={styles.settingRow}>
                            <div className={styles.volumeHeader}>
                                <span className={styles.volumeIcon}>
                                    {sfxVolume === 0 ? '🔇' : sfxVolume < 0.5 ? '🔈' : '🔊'}
                                </span>
                                <span className={styles.volumePercent}>{Math.round(sfxVolume * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={sfxVolume * 100}
                                onChange={(e) => onSfxVolumeChange(parseInt(e.target.value) / 100)}
                                className={styles.volumeSlider}
                            />
                        </div>
                    </div>

                    <div className={styles.divider} />

                    <div className={styles.systemSection}>
                        <button className={styles.logoutBtn} onClick={logout}>
                            <img src="/assets/hud/logouticon.png" className={styles.logoutIcon} alt="" />
                            <div className={styles.logoutContent}>
                                <span className={styles.logoutTitle}>Cerrar Sesión</span>
                                <span className={styles.logoutDesc}>Abandonar el reino de Etheria</span>
                            </div>
                        </button>
                    </div>
                </div>

                <div className={styles.footer}>
                    <span className={styles.version}>Etheria v0.1.0 Alpha</span>
                </div>
            </div>
        </div>
    );
}
