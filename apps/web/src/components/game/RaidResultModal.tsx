'use client';

import React from 'react';
import styles from './AttackPanel.module.css';

interface RaidResult {
    victory: boolean;
    loot: Record<string, number>;
    playerLosses: Record<string, number>;
    npcLosses: Record<string, number>;
    experience: number;
    message: string;
}

interface RaidResultModalProps {
    result: RaidResult;
    campName: string;
    onClose: () => void;
}

const RESOURCE_ICONS: Record<string, string> = {
    wood: '🪵',
    iron: '⚙️',
    gold: '🪙',
    doblones: '💰',
    etherFragments: '✨',
};

const RESOURCE_NAMES: Record<string, string> = {
    wood: 'Madera',
    iron: 'Hierro',
    gold: 'Oro',
    doblones: 'Doblones',
    etherFragments: 'Éter',
};

export function RaidResultModal({ result, campName, onClose }: RaidResultModalProps) {
    const hasLoot = Object.keys(result.loot).length > 0;
    const hasLosses = Object.values(result.playerLosses).some(v => v > 0);

    return (
        <div className={styles.overlay} onMouseDown={(e) => e.stopPropagation()}>
            <div className={styles.panel} style={{ maxWidth: '450px' }}>
                <div className={styles.header} style={{
                    background: result.victory
                        ? 'linear-gradient(135deg, #2d5016, #3d6b1e)'
                        : 'linear-gradient(135deg, #501616, #6b1e1e)'
                }}>
                    <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {result.victory ? '🏆' : '💀'}
                        {result.victory ? '¡Victoria!' : 'Derrota'}
                    </h2>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>

                <div className={styles.content}>
                    <p style={{
                        textAlign: 'center',
                        fontSize: '1.1rem',
                        marginBottom: '20px',
                        opacity: 0.9
                    }}>
                        {result.message}
                    </p>

                    {/* Loot obtenido */}
                    {result.victory && hasLoot && (
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,165,0,0.1))',
                            borderRadius: '12px',
                            padding: '16px',
                            marginBottom: '16px',
                            border: '1px solid rgba(255,215,0,0.3)'
                        }}>
                            <h3 style={{
                                margin: '0 0 12px 0',
                                fontSize: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                💰 Botín Saqueado
                            </h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                gap: '12px'
                            }}>
                                {Object.entries(result.loot).map(([resource, amount]) => (
                                    <div key={resource} style={{
                                        background: 'rgba(0,0,0,0.3)',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: '1.5rem' }}>
                                            {RESOURCE_ICONS[resource] || '📦'}
                                        </div>
                                        <div style={{
                                            fontWeight: 'bold',
                                            color: '#ffd700',
                                            fontSize: '1.1rem'
                                        }}>
                                            +{amount}
                                        </div>
                                        <div style={{
                                            fontSize: '0.8rem',
                                            opacity: 0.7
                                        }}>
                                            {RESOURCE_NAMES[resource] || resource}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Experiencia ganada */}
                    {result.victory && result.experience > 0 && (
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(138,43,226,0.15), rgba(75,0,130,0.1))',
                            borderRadius: '12px',
                            padding: '12px 16px',
                            marginBottom: '16px',
                            border: '1px solid rgba(138,43,226,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                ⭐ Experiencia Ganada
                            </span>
                            <span style={{
                                fontWeight: 'bold',
                                color: '#da70d6',
                                fontSize: '1.1rem'
                            }}>
                                +{result.experience} XP
                            </span>
                        </div>
                    )}

                    {/* Pérdidas */}
                    {hasLosses && (
                        <div style={{
                            background: 'rgba(255,0,0,0.1)',
                            borderRadius: '12px',
                            padding: '16px',
                            border: '1px solid rgba(255,0,0,0.3)'
                        }}>
                            <h3 style={{
                                margin: '0 0 12px 0',
                                fontSize: '1rem',
                                color: '#ff6b6b'
                            }}>
                                ⚰️ Bajas en Combate
                            </h3>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '8px'
                            }}>
                                {Object.entries(result.playerLosses)
                                    .filter(([_, count]) => count > 0)
                                    .map(([unitType, count]) => (
                                        <span key={unitType} style={{
                                            background: 'rgba(0,0,0,0.3)',
                                            borderRadius: '6px',
                                            padding: '6px 10px',
                                            fontSize: '0.9rem'
                                        }}>
                                            -{count} {unitType}
                                        </span>
                                    ))
                                }
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <button
                        className={styles.attackBtn}
                        onClick={onClose}
                        style={{
                            width: '100%',
                            background: result.victory
                                ? 'linear-gradient(135deg, #2d5016, #3d6b1e)'
                                : 'linear-gradient(135deg, #444, #555)'
                        }}
                    >
                        {result.victory ? '¡Continuar Saqueando!' : 'Volver al Mapa'}
                    </button>
                </div>
            </div>
        </div>
    );
}
