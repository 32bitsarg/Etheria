'use client';

import { useState, useEffect } from 'react';
import { BuildingType, BuildingState, ConstructionQueueItem, BUILDING_INFO } from '@lootsystem/game-engine';
import styles from './CityMap.module.css';

interface CityMapProps {
    buildings: BuildingState[];
    queue: ConstructionQueueItem[];
    onBuildingClick: (type: BuildingType) => void;
}

// Layout con posiciones absolutas (%) para coincidir con el fondo
const BUILDING_LAYOUT: { type: BuildingType; x: string; y: string; size: 'large' | 'medium' | 'small' }[] = [
    { type: BuildingType.TOWN_HALL, x: '45%', y: '29%', size: 'large' },
    { type: BuildingType.FARM, x: '45%', y: '60%', size: 'medium' },
    { type: BuildingType.LUMBER_MILL, x: '15%', y: '60%', size: 'medium' },
    { type: BuildingType.IRON_MINE, x: '22%', y: '28%', size: 'medium' },
    { type: BuildingType.GOLD_MINE, x: '32%', y: '18%', size: 'medium' },
    { type: BuildingType.WAREHOUSE, x: '55%', y: '29%', size: 'small' },
    { type: BuildingType.BARRACKS, x: '55%', y: '50%', size: 'medium' },
    { type: BuildingType.ALLIANCE_CENTER, x: '40%', y: '45%', size: 'small' },
];

const BUILDING_ICONS: Record<BuildingType, string> = {
    [BuildingType.TOWN_HALL]: '🏛️',
    [BuildingType.FARM]: '🌾',
    [BuildingType.LUMBER_MILL]: '🪓',
    [BuildingType.IRON_MINE]: '⛏️',
    [BuildingType.GOLD_MINE]: '🪙',
    [BuildingType.WAREHOUSE]: '📦',
    [BuildingType.BARRACKS]: '⚔️',
    [BuildingType.ALLIANCE_CENTER]: '🏰',
};

const BUILDING_SPRITES: Partial<Record<BuildingType, string>> = {
    [BuildingType.TOWN_HALL]: '/assets/buildings/townhall.png',
    [BuildingType.FARM]: '/assets/buildings/farm.png',
    [BuildingType.BARRACKS]: '/assets/buildings/barracks.png',
    [BuildingType.LUMBER_MILL]: '/assets/buildings/sawmill.png',
    [BuildingType.WAREHOUSE]: '/assets/buildings/warehouse.png',
    [BuildingType.ALLIANCE_CENTER]: '/assets/buildings/alliance.png',
    [BuildingType.IRON_MINE]: '/assets/buildings/ironmine.png',
    [BuildingType.GOLD_MINE]: '/assets/buildings/goldmine.png',
};


export function CityMap({ buildings, queue, onBuildingClick }: CityMapProps) {
    const [currentTime, setCurrentTime] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const getQueueItem = (type: BuildingType) =>
        queue.find(item => item.buildingType === type);

    const getBuilding = (type: BuildingType) =>
        buildings.find(b => b.type === type);

    return (
        <div className={styles.mapWrapper}>
            {/* Background Image */}
            <div className={styles.ambientBg} />

            {/* Buildings Container */}
            <div className={styles.buildingsContainer}>
                {BUILDING_LAYOUT.map((item) => (
                    <div
                        key={item.type}
                        style={{
                            position: 'absolute',
                            left: item.x,
                            top: item.y,
                            transform: 'translate(-50%, -50%)',
                            pointerEvents: 'auto'
                        }}
                    >
                        <BuildingNode
                            type={item.type}
                            building={getBuilding(item.type)}
                            queueItem={getQueueItem(item.type)}
                            currentTime={currentTime}
                            onClick={() => onBuildingClick(item.type)}
                            size={item.size}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}


interface BuildingNodeProps {
    type: BuildingType;
    building?: BuildingState;
    queueItem?: ConstructionQueueItem;
    currentTime: number;
    onClick: () => void;
    size: 'large' | 'medium' | 'small';
}

function BuildingNode({ type, building, queueItem, currentTime, onClick, size }: BuildingNodeProps) {
    const info = BUILDING_INFO[type];
    const level = building?.level ?? 0;
    const isLocked = level === 0;
    const isConstructing = !!queueItem;

    // Calculate progress
    let progress = 0;
    if (queueItem) {
        const totalDuration = queueItem.endTime - queueItem.startTime;
        const elapsed = currentTime - queueItem.startTime;
        progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    }

    const sprite = BUILDING_SPRITES[type];

    return (
        <button
            className={`${styles.buildingNode} ${styles[size]} ${isLocked ? styles.locked : ''} ${isConstructing ? styles.constructing : ''} ${sprite ? styles.hasSprite : ''}`}
            onClick={onClick}
            title={`${info.name} - Nivel ${level}`}
        >
            <div className={styles.nodeInner}>
                {sprite ? (
                    <img src={sprite} className={styles.nodeSprite} alt={info.name} />
                ) : (
                    <span className={styles.nodeIcon}>{BUILDING_ICONS[type]}</span>
                )}
                {isConstructing && (
                    <div className={styles.constructingIndicator}>
                        <span className={styles.hammer}>🔨</span>
                    </div>
                )}
            </div>

            {/* Progress Bar for construction */}
            {isConstructing && (
                <div className={styles.progressBarContainer}>
                    <div
                        className={styles.progressBarFill}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            <div className={styles.nodeLabel}>
                <span className={styles.nodeName}>{info.name}</span>
                <span className={styles.nodeLevel}>
                    {isLocked ? '🔒' : isConstructing ? `→ Nv.${level + 1}` : `Nv.${level}`}
                </span>
            </div>
        </button>
    );
}
