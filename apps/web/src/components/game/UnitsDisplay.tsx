'use client';

import { useAuth } from '@/hooks/useAuth';
import { UNIT_STATS, UnitType } from '@lootsystem/game-engine';
import styles from './UnitsDisplay.module.css';

export function UnitsDisplay() {
    const { player } = useAuth();

    if (!player) return null;
    const city = player.city as any;

    const units = (city?.units || []).filter((u: any) => u.count > 0);

    return (
        <div className={styles.container}>
            <h3 className={styles.header}>
                Unidades Estacionadas
            </h3>
            <div className={styles.unitList}>
                {units.length === 0 && (
                    <div className={styles.emptyState}>
                        Sin unidades
                    </div>
                )}
                {units.map((unit: any) => {
                    const unitInfo = UNIT_STATS[unit.type as UnitType];
                    const name = unitInfo ? unitInfo.name : unit.type;

                    return (
                        <div key={unit.id} className={styles.unitRow}>
                            <span className={styles.unitName}>
                                {name}
                            </span>
                            <span className={styles.unitCount}>
                                {unit.count}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
