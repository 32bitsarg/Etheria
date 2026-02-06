'use client';

import { useState, useEffect } from 'react';
import {
    UnitType,
    UNIT_STATS,
    formatBuildTime
} from '@lootsystem/game-engine';
import styles from './TrainingQueue.module.css';

interface TrainingQueueItem {
    id: string;
    unitType: string;
    count: number;
    endTime: string | number | Date;
    startTime: string | number | Date;
}

interface TrainingQueueProps {
    queue: TrainingQueueItem[];
    onCancel: (id: string) => void;
    onFinishNow?: (id: string) => void;
    onComplete?: () => void;
}

const UNIT_ICONS: Record<string, string> = {
    [UnitType.INFANTRY]: '⚔️',
    [UnitType.ARCHER]: '🏹',
    [UnitType.SPEARMAN]: '🍢',
    [UnitType.CAVALRY]: '🐎',
};

export function TrainingQueue({ queue, onCancel, onFinishNow, onComplete }: TrainingQueueProps) {
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            setCurrentTime(now);

            // Check if any training just finished
            const finishedItem = queue.find(item => {
                const end = new Date(item.endTime).getTime();
                return end <= now && end > currentTime;
            });

            if (finishedItem && onComplete) {
                onComplete();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [queue, onComplete, currentTime]);

    const getTime = (t: string | number | Date) => new Date(t).getTime();

    if (!queue || queue.length === 0) {
        return (
            <div className={styles.containerMinimal}>
                <div className={styles.emptyBadge}>
                    <img src="/assets/buildings/barracks.webp" className={styles.headerIconImg} alt="Train" />
                    <span className={`${styles.emptyText} queue-text-stable`}>0</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.container} ${isExpanded ? styles.expanded : styles.collapsed}`}>
            <div className={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
                <img src="/assets/buildings/barracks.webp" className={styles.headerIconImg} alt="Train" />
                <span className={`${styles.queueCount} queue-text-stable`}>{queue.length} Encargos</span>
                <span className={styles.expandIcon}>{isExpanded ? '▼' : '◀'}</span>
            </div>

            {isExpanded && (
                <div className={styles.list}>
                    {queue.filter(item => getTime(item.endTime) > currentTime).map((item, index) => {
                        const info = UNIT_STATS[item.unitType as UnitType];
                        const name = info ? info.name : item.unitType;

                        const start = getTime(item.startTime);
                        const end = getTime(item.endTime);
                        const remainingMs = end - currentTime;
                        const remaining = Math.max(0, Math.floor(remainingMs / 1000));
                        const totalDuration = end - start;
                        const progress = totalDuration > 0
                            ? Math.max(0, Math.min(100, 100 - (remainingMs / totalDuration) * 100))
                            : 0;

                        const isComplete = remaining <= 0;
                        const canInstantComplete = remainingMs < 300000 && !isComplete; // < 5 min

                        return (
                            <div key={item.id} className={`${styles.item} ${index === 0 ? styles.active : ''}`}>
                                <div className={styles.itemRow}>
                                    <span className={styles.itemIcon}>{UNIT_ICONS[item.unitType] || '⚔️'}</span>
                                    <div className={styles.itemInfo}>
                                        <span className={styles.itemName}>{name}</span>
                                        <span className={styles.itemLevel}>x{item.count}</span>
                                    </div>
                                    <span className={styles.itemTime}>
                                        {isComplete ? '✓' : formatBuildTime(remaining)}
                                    </span>
                                </div>

                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                                </div>

                                <div className={styles.itemActions}>
                                    {canInstantComplete && onFinishNow && (
                                        <button
                                            className={styles.instantBtn}
                                            onClick={(e) => { e.stopPropagation(); onFinishNow(item.id); }}
                                            title="Terminar ahora (Gratis < 5m)"
                                        >
                                            ⚡
                                        </button>
                                    )}
                                    <button
                                        className={styles.cancelBtn}
                                        onClick={(e) => { e.stopPropagation(); onCancel(item.id); }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
