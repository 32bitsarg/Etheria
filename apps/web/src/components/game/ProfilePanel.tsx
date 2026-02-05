'use client';

import { useState, useEffect } from 'react';
import styles from './ProfilePanel.module.css';

interface ProfileData {
    id: string;
    username: string;
    race: string;
    level: number;
    experience: number;
    bio: string;
    createdAt: string;
    city: string;
    alliance?: { name: string; tag: string };
    militaryPower: number;
    winRate: number;
    totalBattles: number;
    wins: number;
    losses: number;
    history: {
        id: string;
        timestamp: string;
        won: boolean;
        type: string;
        opponent: string;
    }[];
}

interface ProfilePanelProps {
    playerId: string;
    onClose: () => void;
    isOwnProfile?: boolean;
}

const RACE_IMAGES: Record<string, string> = {
    elfo: '/assets/races/Elf.png',
    humano: '/assets/races/Human.png',
    orco: '/assets/races/Orc.png',
    enano: '/assets/races/Dwarf.png',
};

export function ProfilePanel({ playerId, onClose, isOwnProfile = true }: ProfilePanelProps) {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [tempBio, setTempBio] = useState('');

    useEffect(() => {
        fetchProfile();
    }, [playerId]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/player/profile?playerId=${playerId}`);
            const data = await res.json();
            if (data.success) {
                setProfile(data.profile);
                setTempBio(data.profile.bio);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveBio = async () => {
        try {
            const res = await fetch('/api/player/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId, bio: tempBio }),
            });
            if (res.ok) {
                setProfile(prev => prev ? { ...prev, bio: tempBio } : null);
                setIsEditingBio(false);
            }
        } catch (error) {
            console.error('Error saving bio:', error);
        }
    };

    if (loading) {
        return (
            <div className={styles.overlay}>
                <div className={styles.modal}>
                    <div style={{ padding: '40px', textAlign: 'center', color: '#a8a29e' }}>
                        Cargando pergaminos...
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) return null;

    const raceImage = RACE_IMAGES[profile.race.toLowerCase()] || RACE_IMAGES['humano'];
    const nextLevelXP = Math.floor(100 * Math.pow(1.8, profile.level));
    const xpPercentage = Math.min(100, (profile.experience / nextLevelXP) * 100);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>&times;</button>

                <div className={styles.header}>
                    <div className={styles.avatarSection}>
                        <div className={styles.avatarOrb}>
                            <img src={raceImage} alt={profile.race} className={styles.avatarImage} />
                        </div>
                        <div className={styles.levelBadge}>{profile.level}</div>
                    </div>

                    <div className={styles.playerInfo}>
                        <span className={styles.raceTitle}>{profile.race}</span>
                        <h2 className={styles.username}>{profile.username}</h2>
                        {profile.alliance && (
                            <div className={styles.allianceTag} style={{ color: '#d4af37', marginBottom: '8px' }}>
                                [{profile.alliance.tag}] {profile.alliance.name}
                            </div>
                        )}

                        <div className={styles.xpSection}>
                            <div className={styles.xpHeader}>
                                <span>Progreso de Nivel</span>
                                <span>{Math.floor(profile.experience)} / {nextLevelXP} XP</span>
                            </div>
                            <div className={styles.xpBarContainer}>
                                <div
                                    className={styles.xpBarFill}
                                    style={{ width: `${xpPercentage}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.statsSection}>
                        <h3 className={styles.sectionTitle}>🏆 Estadísticas</h3>
                        <div className={styles.statsGrid}>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Poder Militar</span>
                                <span className={`${styles.statValue} ${styles.powerValue}`}>{profile.militaryPower}</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Win Rate</span>
                                <span className={styles.statValue}>{profile.winRate}%</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Batallas</span>
                                <span className={styles.statValue}>{profile.totalBattles}</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Victorias</span>
                                <span className={styles.statValue} style={{ color: '#22c55e' }}>{profile.wins}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.bioSection}>
                        <h3 className={styles.sectionTitle}>📜 Biografía</h3>
                        <div className={styles.scroll}>
                            {isEditingBio ? (
                                <textarea
                                    className={styles.bioEdit}
                                    value={tempBio}
                                    onChange={e => setTempBio(e.target.value)}
                                    placeholder="Escribe tu historia aquí..."
                                    autoFocus
                                />
                            ) : (
                                <p className={styles.bioText}>
                                    {profile.bio || "Este jugador aún no ha escrito su biografía."}
                                </p>
                            )}
                        </div>
                        {isOwnProfile && (
                            <div className={styles.editActions}>
                                {isEditingBio ? (
                                    <>
                                        <button className={styles.editBtn} onClick={() => setIsEditingBio(false)}>Cancelar</button>
                                        <button className={styles.saveBtn} onClick={handleSaveBio}>Guardar</button>
                                    </>
                                ) : (
                                    <button className={styles.editBtn} onClick={() => setIsEditingBio(true)}>Editar Biografía</button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={styles.historyList}>
                        <h3 className={styles.sectionTitle}>⚔️ Historial</h3>
                        {profile.history.length > 0 ? (
                            <table className={styles.historyTable}>
                                <thead>
                                    <tr>
                                        <th>Resultado</th>
                                        <th>Oponente</th>
                                        <th>Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {profile.history.slice(0, 5).map(item => (
                                        <tr key={item.id}>
                                            <td className={item.won ? styles.win : styles.loss}>
                                                {item.won ? 'VICTORIA' : 'DERROTA'}
                                            </td>
                                            <td className={styles.opponent}>{item.opponent}</td>
                                            <td className={styles.time}>{new Date(item.timestamp).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p style={{ color: '#78716c', textAlign: 'center', padding: '10px' }}>
                                Aún no se han librado batallas.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
