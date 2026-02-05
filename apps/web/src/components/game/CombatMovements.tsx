'use client';

import { useState, useEffect } from 'react';
import styles from './CombatMovements.module.css';

interface Movement {
    id: string;
    type: string;
    endTime: string | number | Date;
    originCity?: { name: string };
    targetCity?: { name: string };
    units: any;
}

interface CombatMovementsProps {
    originMovements: Movement[];
    targetMovements: Movement[];
    onArrival?: () => void;
}

export function CombatMovements({ originMovements, targetMovements, onArrival }: CombatMovementsProps) {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = Date.now();

            // Check if any movement just arrived
            const allMovementsList = [...originMovements, ...targetMovements];
            const arrived = allMovementsList.find(m => {
                const end = new Date(m.endTime).getTime();
                // Check if it finished in this second
                return end <= currentTime && end > now;
            });

            if (arrived && onArrival) {
                onArrival();
            }

            setNow(currentTime);
        }, 1000);
        return () => clearInterval(interval);
    }, [originMovements, targetMovements, onArrival, now]);

    const formatTime = (endTime: any) => {
        const end = new Date(endTime).getTime();
        const diff = Math.max(0, Math.floor((end - now) / 1000));
        const m = Math.floor(diff / 60);
        const s = diff % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const allMovements = [
        ...originMovements.map(m => ({ ...m, category: 'outgoing' })),
        ...targetMovements.map(m => ({ ...m, category: 'incoming' }))
    ].filter(m => {
        // Ocultar si ya terminó (optimismo visual)
        if (new Date(m.endTime).getTime() <= now) return false;

        // Only show RETURN to the destination city (targetCityId)
        if (m.type === 'RETURN') {
            return m.category === 'incoming';
        }
        return true;
    }).sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime());

    if (allMovements.length === 0) return null;

    return (
        <div className={styles.container}>
            {allMovements.map(mov => {
                const isIncoming = mov.category === 'incoming';
                const isReturn = mov.type === 'RETURN';

                let label = '';
                if (isReturn) label = 'Regresando de';
                else if (isIncoming) label = 'Ataque de';
                else label = 'Atacando a';

                const cityName = isIncoming ? mov.originCity?.name : mov.targetCity?.name;

                return (
                    <div
                        key={mov.id}
                        className={`${styles.movementItem} ${isReturn ? styles.returning : isIncoming ? styles.incoming : styles.outgoing}`}
                    >
                        <div className={styles.movementHeader}>
                            <span className={styles.type}>
                                {isReturn ? 'RETORNO' : isIncoming ? 'ENTRANTE' : 'ATAQUE'}
                            </span>
                            <span className={styles.timer}>{formatTime(mov.endTime)}</span>
                        </div>
                        <div className={styles.details}>
                            {label} <span className={styles.target}>{cityName || 'Desconocido'}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
