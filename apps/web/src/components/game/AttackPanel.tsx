'use client';

import React, { useState } from 'react';
import styles from './AttackPanel.module.css';
import { UnitType, UNIT_STATS } from '@lootsystem/game-engine';

interface AttackPanelProps {
    targetCity: { id: string; name: string };
    availableUnits: { type: string; count: number }[];
    onClose: () => void;
    onAttackStarted: (data: any) => void;
    attackerPlayerId: string;
}

export function AttackPanel({ targetCity, availableUnits, onClose, onAttackStarted, attackerPlayerId }: AttackPanelProps) {
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

    const handleSendAttack = async () => {
        if (totalSelected === 0) {
            setError('Debes seleccionar al menos una unidad');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Filtrar solo unidades con count > 0
            const unitsToSend = Object.fromEntries(
                Object.entries(selectedUnits).filter(([_, count]) => count > 0)
            );

            const res = await fetch('/api/combat/attack', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    attackerPlayerId,
                    targetCityId: targetCity.id,
                    units: unitsToSend
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al enviar el ataque');

            onAttackStarted(data);
            onClose();
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
                    <h2>Enviar Ataque a {targetCity.name}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>

                <div className={styles.content}>
                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.unitList}>
                        {availableUnits.length === 0 && (
                            <p className={styles.empty}>No tienes tropas disponibles en la ciudad.</p>
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
                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
                    <button
                        className={styles.attackBtn}
                        onClick={handleSendAttack}
                        disabled={loading || totalSelected === 0}
                    >
                        {loading ? 'Enviando...' : `Atacar (${totalSelected} unidades)`}
                    </button>
                </div>
            </div>
        </div>
    );
}
