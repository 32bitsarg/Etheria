'use client';

import { useAuth } from '@/hooks/useAuth';
import { useMusicVolume } from '@/components/game/MusicPlayer';
import styles from './MobileSettings.module.css';

interface MobileSettingsProps {
    onClose: () => void;
    volume: number;
    onVolumeChange: (v: number) => void;
}

export function MobileSettings({ onClose, volume, onVolumeChange }: MobileSettingsProps) {
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
                                    {volume === 0 ? '🔇' : volume < 0.5 ? '🔈' : '🔊'}
                                </span>
                                <span className={styles.volumePercent}>{Math.round(volume * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={volume * 100}
                                onChange={(e) => onVolumeChange(parseInt(e.target.value) / 100)}
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
