'use client';

import React, { useState } from 'react';
import styles from './AttackPanel.module.css'; // Reutilizamos estilos
import { UnitType, UNIT_STATS } from '@lootsystem/game-engine';

interface NPCCamp {
    id: string;
    type: string;
    tier: number;
    name: string;
    image: string;
}

interface RaidPanelProps {
    camp: NPCCamp;
    availableUnits: { type: string; count: number }[];
    onClose: () => void;
    onRaidComplete: (result: RaidResult) => void;
}

interface RaidResult {
    success: boolean;
    victory: boolean;
    loot: Record<string, number>;
    playerLosses: Record<string, number>;
    experience: number;
    message: string;
}

export function RaidPanel({ camp, availableUnits, onClose, onRaidComplete }: RaidPanelProps) {
    const [selectedUnits, setSelectedUnits] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUnitChange = (type: string, value: string) => {
        const count = Math.max(0, parseInt(value) || 0);
        const available = availableUnits.find(u => u.type === type)?.count || 0;
        const finalCount = Math.min(count, available);

        setSelectedUnits(prev => ({
            ...prev,
            [type]: finalCount
        }));
    };

    const handleMax = (type: string) => {
        const available = availableUnits.find(u => u.type === type)?.count || 0;
        setSelectedUnits(prev => ({
            ...prev,
            [type]: available
        }));
    };

    const totalSelected = Object.values(selectedUnits).reduce((a, b) => a + b, 0);

    // Calcular poder de ataque estimado
    const estimatedPower = Object.entries(selectedUnits).reduce((total, [type, count]) => {
        const unitInfo = UNIT_STATS[type as UnitType];
        return total + (unitInfo?.stats?.attack || 5) * count;
    }, 0);

    // Sugerencia de dificultad basada en tier
    const recommendedPower = camp.tier === 1 ? 100 : camp.tier === 2 ? 350 : 600;
    const difficultyRatio = estimatedPower / recommendedPower;
    const difficultyLabel = difficultyRatio < 0.5 ? 'Muy Difícil' :
        difficultyRatio < 0.8 ? 'Difícil' :
            difficultyRatio < 1.2 ? 'Equilibrado' : 'Fácil';
    const difficultyColor = difficultyRatio < 0.5 ? '#ff4444' :
        difficultyRatio < 0.8 ? '#ffaa00' :
            difficultyRatio < 1.2 ? '#88ff88' : '#44ff44';

    const handleRaid = async () => {
        if (totalSelected === 0) {
            setError('Debes seleccionar al menos una unidad');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const unitsToSend = Object.fromEntries(
                Object.entries(selectedUnits).filter(([_, count]) => count > 0)
            );

            const res = await fetch('/api/v1/raids/attack', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    campId: camp.id,
                    units: unitsToSend
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al atacar el campamento');

            // Nueva respuesta: tropas enviadas, esperando llegada
            const minutes = Math.floor(data.travelTimeSeconds / 60);
            const seconds = data.travelTimeSeconds % 60;
            const timeStr = minutes > 0
                ? `${minutes} min ${seconds} seg`
                : `${seconds} seg`;

            onRaidComplete({
                success: true,
                victory: false,
                loot: {},
                playerLosses: {},
                experience: 0,
                message: `¡Tropas enviadas! Llegarán en ${timeStr}`,
                travelTimeSeconds: data.travelTimeSeconds,
                arrivalTime: data.arrivalTime
            } as any);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay} onMouseDown={(e) => e.stopPropagation()}>
            <div className={styles.panel}>
                <div className={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                            src={camp.image}
                            alt={camp.name}
                            style={{ width: '48px', height: '48px', borderRadius: '8px' }}
                        />
                        <div>
                            <h2 style={{ margin: 0 }}>Asaltar {camp.name}</h2>
                            <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                                Tier {camp.tier} • {camp.type.replace('_', ' ')}
                            </span>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>

                <div className={styles.content}>
                    {error && <div className={styles.error}>{error}</div>}

                    {/* Indicador de dificultad */}
                    <div style={{
                        background: 'rgba(0,0,0,0.3)',
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span>Poder de Ataque: <strong>{estimatedPower}</strong></span>
                        <span style={{ color: difficultyColor, fontWeight: 'bold' }}>
                            {difficultyLabel}
                        </span>
                    </div>

                    <div className={styles.unitList}>
                        {availableUnits.length === 0 && (
                            <p className={styles.empty}>No tienes tropas disponibles.</p>
                        )}
                        {availableUnits.map(unit => (
                            <div key={unit.type} className={styles.unitItem}>
                                <div className={styles.unitInfo}>
                                    <span className={styles.unitName}>
                                        {UNIT_STATS[unit.type as UnitType]?.name || unit.type}
                                    </span>
                                    <span className={styles.unitAvailable}>Disp: {unit.count}</span>
                                </div>
                                <div className={styles.unitActions}>
                                    <input
                                        type="number"
                                        min="0"
                                        max={unit.count}
                                        value={selectedUnits[unit.type] || ''}
                                        onChange={(e) => handleUnitChange(unit.type, e.target.value)}
                                        placeholder="0"
                                        className={styles.unitInput}
                                    />
                                    <button
                                        className={styles.maxBtn}
                                        onClick={() => handleMax(unit.type)}
                                    >
                                        MAX
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Posibles recompensas */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,165,0,0.1))',
                        borderRadius: '8px',
                        padding: '12px',
                        marginTop: '16px',
                        border: '1px solid rgba(255,215,0,0.3)'
                    }}>
                        <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '8px' }}>
                            Posibles Recompensas:
                        </div>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                            {camp.tier === 1 && (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <img src="/assets/resources/Wood Resource.webp" alt="Madera" style={{ width: '16px' }} /> <span>30-80</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <img src="/assets/resources/Iron_Resource.webp" alt="Hierro" style={{ width: '16px' }} /> <span>15-50</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <img src="/assets/hud/doblones.webp" alt="Doblones" style={{ width: '16px' }} /> <span>2-8</span>
                                    </div>
                                </>
                            )}
                            {camp.tier === 2 && (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <img src="/assets/resources/Wood Resource.webp" alt="Madera" style={{ width: '16px' }} /> <span>80-200</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <img src="/assets/resources/Iron_Resource.webp" alt="Hierro" style={{ width: '16px' }} /> <span>50-150</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <img src="/assets/resources/Gold_Resource.webp" alt="Oro" style={{ width: '16px' }} /> <span>15-50</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <img src="/assets/hud/doblones.webp" alt="Doblones" style={{ width: '16px' }} /> <span>8-25</span>
                                    </div>
                                </>
                            )}
                            {camp.tier >= 3 && (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <img src="/assets/resources/Iron_Resource.webp" alt="Hierro" style={{ width: '16px' }} /> <span>100-250</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <img src="/assets/resources/Gold_Resource.webp" alt="Oro" style={{ width: '16px' }} /> <span>40-100</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <img src="/assets/hud/doblones.webp" alt="Doblones" style={{ width: '16px' }} /> <span>20-60</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <img src="/assets/hud/ether.webp" alt="Éter" style={{ width: '16px' }} /> <span>1-5</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
                    <button
                        className={styles.attackBtn}
                        onClick={handleRaid}
                        disabled={loading || totalSelected === 0}
                        style={{ background: 'linear-gradient(135deg, #8b4513, #a0522d)' }}
                    >
                        {loading ? 'Atacando...' : `⚔️ Asaltar (${totalSelected})`}
                    </button>
                </div>
            </div>
        </div>
    );
}
