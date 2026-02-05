'use client';

import { useState, useEffect } from 'react';
import { BuildingType, BuildingState, ConstructionQueueItem, BUILDING_INFO } from '@lootsystem/game-engine';
import styles from './CityMap.module.css';

interface CityMapProps {
    buildings: BuildingState[];
    queue: ConstructionQueueItem[];
    onBuildingClick: (type: BuildingType) => void;
    isMobile?: boolean;
}

type LayoutItem = {
    type: BuildingType;
    x: string;
    y: string;
    size: 'large' | 'medium' | 'small';
    offsetX?: string;
    offsetY?: string;
};

// Layout Original para Versión Web (Escritorio)
const DESKTOP_LAYOUT: LayoutItem[] = [
    { type: BuildingType.TOWN_HALL, x: '45%', y: '29%', size: 'large' },
    { type: BuildingType.FARM, x: '45%', y: '60%', size: 'medium' },
    { type: BuildingType.LUMBER_MILL, x: '15%', y: '60%', size: 'medium' },
    { type: BuildingType.IRON_MINE, x: '22%', y: '28%', size: 'medium' },
    { type: BuildingType.GOLD_MINE, x: '32%', y: '18%', size: 'medium' },
    { type: BuildingType.WAREHOUSE, x: '55%', y: '29%', size: 'small' },
    { type: BuildingType.BARRACKS, x: '55%', y: '50%', size: 'medium' },
    { type: BuildingType.ALLIANCE_CENTER, x: '40%', y: '45%', size: 'small' },
];

// Layout Personalizado para Versión Móvil
const MOBILE_LAYOUT: LayoutItem[] = [
    { type: BuildingType.TOWN_HALL, x: '50%', y: '50%', size: 'large', offsetX: '27px', offsetY: '-39px' },
    { type: BuildingType.FARM, x: '50%', y: '50%', size: 'medium', offsetX: '155px', offsetY: '89px' },
    { type: BuildingType.LUMBER_MILL, x: '50%', y: '50%', size: 'medium', offsetX: '21px', offsetY: '122px' },
    { type: BuildingType.IRON_MINE, x: '50%', y: '50%', size: 'medium', offsetX: '-99px', offsetY: '-240px' },
    { type: BuildingType.GOLD_MINE, x: '50%', y: '50%', size: 'medium', offsetX: '101px', offsetY: '-230px' },
    { type: BuildingType.WAREHOUSE, x: '55%', y: '29%', size: 'small' },
    { type: BuildingType.BARRACKS, x: '50%', y: '50%', size: 'medium', offsetX: '-152px', offsetY: '-108px' },
    { type: BuildingType.ALLIANCE_CENTER, x: '50%', y: '50%', size: 'small', offsetX: '-103px', offsetY: '41px' },
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


export function CityMap({ buildings, queue, onBuildingClick, isMobile = false }: CityMapProps) {
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

    const layout = isMobile ? MOBILE_LAYOUT : DESKTOP_LAYOUT;

    return (
        <div className={styles.mapWrapper}>
            <div className={styles.ambientBg} />

            <div className={styles.buildingsContainer}>
                {layout.map((item) => (
                    <div
                        key={`${item.type}-${isMobile ? 'mobile' : 'desktop'}`}
                        style={{
                            position: 'absolute',
                            left: item.x,
                            top: item.y,
                            transform: `translate(calc(-50% + ${item.offsetX || '0px'}), calc(-50% + ${item.offsetY || '0px'}))`,
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
