'use client';

import { useState, useEffect } from 'react';
import {
    ConstructionQueueItem,
    BUILDING_INFO,
    BuildingType,
    formatBuildTime,
    INSTANT_COMPLETE_MAX_LEVEL,
    MAX_CONSTRUCTION_QUEUE
} from '@lootsystem/game-engine';
import styles from './ConstructionQueue.module.css';

interface ConstructionQueueProps {
    queue: ConstructionQueueItem[];
    onCancel: (id: string) => void;
    onInstantComplete?: (id: string) => void;
    onComplete?: () => void;
}

const BUILDING_ICONS: Record<BuildingType, string> = {
    [BuildingType.TOWN_HALL]: '/assets/buildings/townhall.png',
    [BuildingType.FARM]: '/assets/buildings/farm.png',
    [BuildingType.LUMBER_MILL]: '/assets/buildings/sawmill.png',
    [BuildingType.IRON_MINE]: '/assets/buildings/ironmine.png',
    [BuildingType.GOLD_MINE]: '/assets/buildings/goldmine.png',
    [BuildingType.WAREHOUSE]: '/assets/buildings/warehouse.png',
    [BuildingType.BARRACKS]: '/assets/buildings/barracks.png',
    [BuildingType.ALLIANCE_CENTER]: '/assets/buildings/alliance.png',
};

export function ConstructionQueue({ queue, onCancel, onInstantComplete, onComplete }: ConstructionQueueProps) {
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            setCurrentTime(now);

            // Check if any build just finished
            const finishedItem = queue.find(item => item.endTime <= now && item.endTime > currentTime);
            if (finishedItem && onComplete) {
                onComplete();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [queue, onComplete, currentTime]);

    // If empty, show minimal indicator
    if (queue.length === 0) {
        return (
            <div className={styles.containerMinimal}>
                <div className={styles.emptyBadge}>
                    <img src="/assets/buildings/townhall.png" className={styles.headerIconImg} alt="Build" />
                    <span className={`${styles.emptyText} queue-text-stable`}>0/{MAX_CONSTRUCTION_QUEUE}</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.container} ${isExpanded ? styles.expanded : styles.collapsed}`}>
            {/* Header - Always visible */}
            <div className={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
                <img src="/assets/buildings/townhall.png" className={styles.headerIconImg} alt="Build" />
                <span className={`${styles.queueCount} queue-text-stable`}>{queue.length}/{MAX_CONSTRUCTION_QUEUE}</span>
                <span className={styles.expandIcon}>{isExpanded ? '▼' : '◀'}</span>
            </div>

            {/* Queue Items - Only when expanded */}
            {isExpanded && (
                <div className={styles.list}>
                    {queue.filter(item => item.endTime > currentTime).map((item, index) => {
                        const info = BUILDING_INFO[item.buildingType];
                        const remainingMs = item.endTime - currentTime;
                        const remaining = Math.max(0, Math.floor(remainingMs / 1000));
                        const totalDuration = item.endTime - item.startTime;
                        const progress = Math.max(0, Math.min(100, 100 - (remainingMs / totalDuration) * 100));
                        const isComplete = remaining <= 0;
                        const isActive = index === 0;
                        const canInstantComplete = item.targetLevel <= INSTANT_COMPLETE_MAX_LEVEL && !isComplete;

                        return (
                            <div key={item.id} className={`${styles.item} ${isActive ? styles.active : ''}`}>
                                <div className={styles.itemRow}>
                                    <img src={BUILDING_ICONS[item.buildingType]} className={styles.itemIconImg} alt="Icon" />
                                    <div className={styles.itemInfo}>
                                        <span className={styles.itemName}>{info.name}</span>
                                        <span className={styles.itemLevel}>Nv.{item.targetLevel}</span>
                                    </div>
                                    <span className={styles.itemTime}>
                                        {isComplete ? '✓' : formatBuildTime(remaining)}
                                    </span>
                                </div>

                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                                </div>

                                <div className={styles.itemActions}>
                                    {canInstantComplete && onInstantComplete && (
                                        <button
                                            className={styles.instantBtn}
                                            onClick={(e) => { e.stopPropagation(); onInstantComplete(item.id); }}
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
