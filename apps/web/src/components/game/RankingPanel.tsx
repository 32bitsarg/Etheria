'use client';

import { useState, useEffect } from 'react';
import styles from './RankingPanel.module.css';

interface RankingEntry {
    rank: number;
    id: string;
    username: string;
    race: string;
    level: number;
    militaryPower: number;
    cityName: string;
    alliance: { name: string; tag: string } | null;
}

interface RankingPanelProps {
    onClose: () => void;
    onPlayerClick: (playerId: string) => void;
}

const RACE_IMAGES: Record<string, string> = {
    elfo: '/assets/races/Elf.png',
    humano: '/assets/races/Human.png',
    orco: '/assets/races/Orc.png',
    enano: '/assets/races/Dwarf.png',
};

export function RankingPanel({ onClose, onPlayerClick }: RankingPanelProps) {
    const [ranking, setRanking] = useState<RankingEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRanking();
    }, []);

    const fetchRanking = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/v1/ranking');
            const data = await res.json();
            if (data.success) {
                setRanking(data.ranking);
            }
        } catch (error) {
            console.error('Error fetching ranking:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRankClass = (rank: number) => {
        if (rank === 1) return styles.rank1;
        if (rank === 2) return styles.rank2;
        if (rank === 3) return styles.rank3;
        return '';
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        <img src="/assets/hud/rankicon.png" alt="" style={{ width: '32px' }} />
                        Clasificación de Etheria
                    </h2>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>

                <div className={styles.content}>
                    {loading ? (
                        <div className={styles.emptyState}>Consultando a los oráculos...</div>
                    ) : ranking.length > 0 ? (
                        <table className={styles.rankingTable}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center' }}>Pos</th>
                                    <th>Guerrero</th>
                                    <th>Alianza</th>
                                    <th style={{ textAlign: 'center' }}>Nivel</th>
                                    <th style={{ textAlign: 'right' }}>Poder Militar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ranking.map((entry) => (
                                    <tr key={entry.id} className={entry.rank <= 3 ? styles.topThree : ''}>
                                        <td className={`${styles.rankCell} ${getRankClass(entry.rank)}`}>
                                            {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                                        </td>
                                        <td className={styles.playerCell} onClick={() => onPlayerClick(entry.id)}>
                                            <img
                                                src={RACE_IMAGES[entry.race.toLowerCase()] || RACE_IMAGES['humano']}
                                                alt={entry.race}
                                                className={styles.raceIcon}
                                            />
                                            <span className={styles.username}>{entry.username}</span>
                                        </td>
                                        <td>
                                            {entry.alliance ? (
                                                <span className={styles.allianceTag}>[{entry.alliance.tag}]</span>
                                            ) : (
                                                <span style={{ color: '#57534e' }}>-</span>
                                            )}
                                        </td>
                                        <td className={styles.levelCell}>{entry.level}</td>
                                        <td className={styles.powerCell}>{entry.militaryPower.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className={styles.emptyState}>No hay registros en la clasificación todavía.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
