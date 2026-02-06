'use client';

import { useState } from 'react';
import {
    UnitType,
    UNIT_STATS,
    BuildingType,
    getUnitCost,
    getUnitTrainingTime,
    formatBuildTime,
    BUILDING_INFO
} from '@lootsystem/game-engine';
import { useAuth } from '@/hooks/useAuth';
import styles from './BarracksPanel.module.css';

export function BarracksPanel() {
    const { player, trainUnits, cancelTraining, loading } = useAuth();
    const [amounts, setAmounts] = useState<Record<string, number>>({});

    if (!player) return null;

    const units = Object.values(UnitType);
    const queue = (player.city as any).trainingQueue || [];

    const handleAmountChange = (type: string, value: string) => {
        const val = parseInt(value) || 0;
        setAmounts(prev => ({ ...prev, [type]: Math.max(0, val) }));
    };

    const handleTrain = async (type: string) => {
        const amount = amounts[type] || 0;
        if (amount <= 0) return;

        const success = await trainUnits(type, amount);
        if (success) {
            setAmounts(prev => ({ ...prev, [type]: 0 }));
        }
    };

    const handleCancel = async (id: string) => {
        await cancelTraining(id);
    };

    // Helper to check requirements
    const checkRequirements = (type: UnitType) => {
        const stats = UNIT_STATS[type];
        if (!stats) return false;

        // Check building levels
        for (const req of stats.requirements) {
            const building = player.city.buildings.find(b => b.type === req.building);
            if (!building || building.level < req.level) {
                return false;
            }
        }
        return true;
    };

    return (
        <div className={styles.panel}>
            <h2>⚔️ Cuartel - Entrenamiento</h2>

            <div className={styles.unitGrid}>
                {units.map((type) => {
                    const info = UNIT_STATS[type];
                    const isUnlocked = checkRequirements(type);
                    const amount = amounts[type] || '';
                    const cost = getUnitCost(type);

                    if (!isUnlocked) {
                        // Find missing requirement
                        const req = info.requirements.find(r => {
                            const building = player.city.buildings.find(b => b.type === r.building);
                            return !building || building.level < r.level;
                        });
                        const reqName = req ? BUILDING_INFO[req.building].name : 'Cuartel';
                        const reqLevel = req ? req.level : 1;

                        return (
                            <div key={type} className={`${styles.unitCard} ${styles.locked}`}>
                                <div className={styles.unitHeader}>
                                    <span className={styles.unitName}>{info.name}</span>
                                </div>

                                <div className={styles.unitStats}>
                                    <div className={styles.stat} title="Ataque">
                                        <span className={styles.sword}>⚔️</span> {info.stats.attack}
                                    </div>
                                    <div className={styles.stat} title="Defensa">
                                        <span className={styles.shield}>🛡️</span> {info.stats.defense}
                                    </div>
                                    <div className={styles.stat} title="Salud">
                                        <span className={styles.heart}>❤️</span> {info.stats.health}
                                    </div>
                                    <div className={styles.stat} title="Velocidad">
                                        <span className={styles.boot}>👟</span> {info.stats.speed}
                                    </div>
                                </div>

                                <div className={styles.lockedOverlay}>
                                    🔒 Requiere {reqName} Nivel {reqLevel}
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={type} className={styles.unitCard}>
                            <div className={styles.unitHeader}>
                                <span className={styles.unitName}>{info.name}</span>
                                <span className={styles.unitLevel}>{formatBuildTime(info.trainingTime)}</span>
                            </div>

                            <p className={styles.unitDescription}>{info.description}</p>

                            <div className={styles.unitStats}>
                                <div className={styles.stat} title="Ataque">
                                    <span className={styles.sword}>⚔️</span> {info.stats.attack}
                                </div>
                                <div className={styles.stat} title="Defensa">
                                    <span className={styles.shield}>🛡️</span> {info.stats.defense}
                                </div>
                                <div className={styles.stat} title="Salud">
                                    <span className={styles.heart}>❤️</span> {info.stats.health}
                                </div>
                                <div className={styles.stat} title="Velocidad">
                                    <span className={styles.boot}>👟</span> {info.stats.speed}
                                </div>
                            </div>

                            <div className={styles.costRow}>
                                <div className={styles.resourceCost}>
                                    <img src="/assets/resources/Wood Resource.webp" alt="Wood" /> {cost.wood}
                                </div>
                                <div className={styles.resourceCost}>
                                    <img src="/assets/resources/Iron_Resource.webp" alt="Iron" /> {cost.iron}
                                </div>
                                <div className={styles.resourceCost}>
                                    <img src="/assets/resources/Gold_Resource.webp" alt="Gold" /> {cost.gold}
                                </div>
                                <div className={styles.resourceCost}>
                                    <img src="/assets/resources/Population.webp" alt="Pop" /> {cost.population}
                                </div>
                            </div>

                            <div className={styles.trainSection}>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={amount}
                                    onChange={(e) => handleAmountChange(type, e.target.value)}
                                    className={styles.amountInput}
                                    disabled={loading}
                                />
                                <button
                                    className={styles.trainBtn}
                                    onClick={() => handleTrain(type)}
                                    disabled={loading || !amount}
                                >
                                    Entrenar
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {queue.length > 0 && (
                <div className={styles.queueSection}>
                    <div className={styles.queueTitle}>Cola de Entrenamiento ({queue.length})</div>
                    <div className={styles.queueList}>
                        {queue.map((item: any) => {
                            const unitName = UNIT_STATS[item.unitType as UnitType]?.name || item.unitType;
                            const timeLeft = Math.max(0, Math.ceil((item.endTime - Date.now()) / 1000));

                            return (
                                <div key={item.id} className={styles.queueItem}>
                                    <div className={styles.queueInfo}>
                                        <span className={styles.queueName}>
                                            {item.count}x {unitName}
                                        </span>
                                        <span className={styles.queueTime}>
                                            {formatBuildTime(timeLeft)} restantes
                                        </span>
                                    </div>
                                    <button
                                        className={styles.cancelBtn}
                                        onClick={() => handleCancel(item.id)}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
