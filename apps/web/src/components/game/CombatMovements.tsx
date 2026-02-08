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

interface RaidMovement {
    id: string;
    type: 'RAID' | 'RAID_RETURN';
    endTime: string | number | Date;
    campName: string;
    units: any;
    status: string;
}

interface CombatMovementsProps {
    originMovements: Movement[];
    targetMovements: Movement[];
    onArrival?: () => void;
}

export function CombatMovements({ originMovements, targetMovements, onArrival }: CombatMovementsProps) {
    const [now, setNow] = useState(Date.now());
    const [raidMovements, setRaidMovements] = useState<RaidMovement[]>([]);

    // Fetch raid movements
    useEffect(() => {
        const fetchRaids = async () => {
            try {
                const res = await fetch('/api/v1/raids/movements');
                const data = await res.json();
                if (data.success) {
                    setRaidMovements(data.raids);
                }
            } catch (error) {
                console.error('Error fetching raid movements:', error);
            }
        };

        fetchRaids();
        // Refetch cada 5 segundos
        const fetchInterval = setInterval(fetchRaids, 5000);
        return () => clearInterval(fetchInterval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = Date.now();

            // Check if any movement just arrived
            const allMovementsList = [...originMovements, ...targetMovements];
            const arrived = allMovementsList.find(m => {
                const end = new Date(m.endTime).getTime();
                return end <= currentTime && end > now;
            });

            // Check if any raid just arrived
            const raidArrived = raidMovements.find(m => {
                const end = new Date(m.endTime).getTime();
                return end <= currentTime && end > now;
            });

            if ((arrived || raidArrived) && onArrival) {
                onArrival();
            }

            setNow(currentTime);
        }, 1000);
        return () => clearInterval(interval);
    }, [originMovements, targetMovements, raidMovements, onArrival, now]);

    const formatTime = (endTime: any) => {
        const end = new Date(endTime).getTime();
        const diff = Math.max(0, Math.floor((end - now) / 1000));
        const m = Math.floor(diff / 60);
        const s = diff % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // Combinar movimientos de combate PvP
    const pvpMovements = [
        ...originMovements.map(m => ({ ...m, category: 'outgoing' as const })),
        ...targetMovements.map(m => ({ ...m, category: 'incoming' as const }))
    ].filter(m => {
        if (new Date(m.endTime).getTime() <= now) return false;
        if (m.type === 'RETURN') {
            return m.category === 'incoming';
        }
        return true;
    });

    // Combinar con raids NPC (filtrar pasadas)
    const activeRaids = raidMovements.filter(m =>
        new Date(m.endTime).getTime() > now
    );

    // Unificar todos los movimientos
    const allMovements = [
        ...pvpMovements.map(m => ({
            ...m,
            isRaid: false,
            campName: null as string | null,
        })),
        ...activeRaids.map(m => ({
            id: m.id,
            type: m.type,
            endTime: m.endTime,
            category: m.type === 'RAID_RETURN' ? 'incoming' as const : 'outgoing' as const,
            units: m.units,
            originCity: undefined,
            targetCity: undefined,
            isRaid: true,
            campName: m.campName,
        }))
    ].sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime());

    if (allMovements.length === 0) return null;

    return (
        <div className={styles.container}>
            {allMovements.map(mov => {
                const isIncoming = mov.category === 'incoming';
                const isReturn = mov.type === 'RETURN' || mov.type === 'RAID_RETURN';
                const isRaid = mov.isRaid;

                let label = '';
                let icon = '';
                if (isRaid) {
                    if (isReturn) {
                        label = 'Regresando de';
                        icon = '🏕️';
                    } else {
                        label = 'Asaltando';
                        icon = '⚔️';
                    }
                } else {
                    if (isReturn) {
                        label = 'Regresando de';
                        icon = '🔄';
                    } else if (isIncoming) {
                        label = 'Ataque de';
                        icon = '⚠️';
                    } else {
                        label = 'Atacando a';
                        icon = '⚔️';
                    }
                }

                const targetName = isRaid
                    ? mov.campName
                    : (isIncoming ? mov.originCity?.name : mov.targetCity?.name);

                // Estilo especial para raids
                const raidClass = isRaid
                    ? (isReturn ? styles.raidReturning : styles.raidOutgoing)
                    : '';

                return (
                    <div
                        key={mov.id}
                        className={`${styles.movementItem} ${isReturn ? styles.returning : isIncoming ? styles.incoming : styles.outgoing} ${raidClass}`}
                    >
                        <div className={styles.movementHeader}>
                            <span className={styles.type}>
                                {icon} {isRaid
                                    ? (isReturn ? 'RETORNO RAID' : 'RAID NPC')
                                    : (isReturn ? 'RETORNO' : isIncoming ? 'ENTRANTE' : 'ATAQUE')}
                            </span>
                            <span className={styles.timer}>{formatTime(mov.endTime)}</span>
                        </div>
                        <div className={styles.details}>
                            {label} <span className={styles.target}>{targetName || 'Desconocido'}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
