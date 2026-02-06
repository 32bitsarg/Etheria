import { useState } from 'react';
import {
    BuildingType,
    PlayerState,
    BUILDING_INFO,
    getUpgradeCost,
    getBuildTime,
    formatBuildTime,
    getProductionPerHour,
    MAX_CONSTRUCTION_QUEUE,
    getBuildingLevel
} from '@lootsystem/game-engine';
import styles from './BuildingPanel.module.css';
import { BarracksPanel } from './BarracksPanel';
import { AlliancePanel } from './AlliancePanel';

interface BuildingPanelProps {
    buildingType: BuildingType;
    player: PlayerState;
    onClose: () => void;
    onUpgrade: (buildingType: BuildingType) => Promise<boolean>;
}

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

export function BuildingPanel({ buildingType, player, onClose, onUpgrade }: BuildingPanelProps) {
    const [activeTab, setActiveTab] = useState<'upgrade' | 'train' | 'manage'>('upgrade');

    const info = BUILDING_INFO[buildingType];
    const building = player.city.buildings.find(b => b.type === buildingType);
    const currentLevel = building?.level ?? 0;
    const nextLevel = currentLevel + 1;

    const cost = getUpgradeCost(buildingType, nextLevel);
    const buildTime = getBuildTime(buildingType, nextLevel);

    // Verificar si puede construir
    const canAffordWood = player.resources.wood >= (cost.wood ?? 0);
    const canAffordIron = player.resources.iron >= (cost.iron ?? 0);
    const canAffordGold = player.resources.gold >= (cost.gold ?? 0);
    const hasPopulation = (player.resources.populationMax - player.resources.populationUsed) >= (cost.population ?? 0);
    const isInQueue = player.city.constructionQueue.some(item => item.buildingType === buildingType);
    const isMaxLevel = currentLevel >= info.maxLevel;
    const queueFull = player.city.constructionQueue.length >= MAX_CONSTRUCTION_QUEUE;

    // Prerequisitos
    let requirementsMet = true;
    let prerequisiteMessage = '';

    if (info.requires) {
        const reqLevel = getBuildingLevel(player.city.buildings, info.requires.building);
        requirementsMet = reqLevel >= info.requires.level;

        if (!requirementsMet) {
            const reqInfo = BUILDING_INFO[info.requires.building];
            prerequisiteMessage = `Requiere ${reqInfo.name} nivel ${info.requires.level}`;
        }
    }

    const canUpgrade = canAffordWood && canAffordIron && canAffordGold &&
        hasPopulation && !isInQueue && !queueFull &&
        !isMaxLevel && requirementsMet;

    let upgradeError = '';
    if (isMaxLevel) upgradeError = 'Nivel máximo alcanzado';
    else if (isInQueue) upgradeError = 'Ya en construcción';
    else if (queueFull) upgradeError = `Cola llena (${MAX_CONSTRUCTION_QUEUE}/${MAX_CONSTRUCTION_QUEUE})`;
    else if (!requirementsMet) upgradeError = prerequisiteMessage;
    else if (!canAffordWood || !canAffordIron || !canAffordGold) upgradeError = 'Recursos insuficientes';
    else if (!hasPopulation) upgradeError = 'Población insuficiente';

    // Calcular preview de producción
    const productionPreview = getProductionPreview(buildingType, currentLevel, nextLevel);

    const handleUpgrade = async () => {
        if (!canUpgrade) return;

        const success = await onUpgrade(buildingType);
        if (success) {
            onClose();
        }
    };

    const isBarracks = buildingType === BuildingType.BARRACKS;
    const isAllianceCenter = buildingType === BuildingType.ALLIANCE_CENTER;

    // Render logic
    const renderTabs = () => (
        <div className={styles.tabs}>
            <button
                className={`${styles.tabBtn} ${activeTab === 'upgrade' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('upgrade')}
            >
                Mejorar
            </button>
            {isBarracks && (
                <button
                    className={`${styles.tabBtn} ${activeTab === 'train' ? styles.tabBtnActive : ''}`}
                    onClick={() => setActiveTab('train')}
                >
                    Entrenar
                </button>
            )}
            {isAllianceCenter && currentLevel > 0 && (
                <button
                    className={`${styles.tabBtn} ${activeTab === 'manage' ? styles.tabBtnActive : ''}`}
                    onClick={() => setActiveTab('manage')}
                >
                    Alianza
                </button>
            )}
        </div>
    );

    // If showing train tab for Barracks
    if (isBarracks && activeTab === 'train') {
        return (
            <div className={styles.overlay} onClick={onClose}>
                <div className={styles.panel} onClick={e => e.stopPropagation()}>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>

                    <div className={styles.header}>
                        <div className={styles.icon}>{BUILDING_ICONS[buildingType]}</div>
                        <div className={styles.titleInfo}>
                            <h2 className={styles.title}>{info.name}</h2>
                            <span className={styles.level}>Nivel {currentLevel}</span>
                        </div>
                    </div>

                    {renderTabs()}

                    <div className={styles.content} style={{ overflowY: 'auto' }}>
                        <BarracksPanel />
                    </div>
                </div>
            </div>
        );
    }

    // If showing manage tab for Alliance Center
    if (isAllianceCenter && activeTab === 'manage') {
        return (
            <div className={styles.overlay} onClick={onClose}>
                <div className={styles.panel} onClick={e => e.stopPropagation()}>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>

                    <div className={styles.header}>
                        <div className={styles.icon}>{BUILDING_ICONS[buildingType]}</div>
                        <div className={styles.titleInfo}>
                            <h2 className={styles.title}>{info.name}</h2>
                            <span className={styles.level}>Nivel {currentLevel}</span>
                        </div>
                    </div>

                    {renderTabs()}

                    <div className={styles.content} style={{ overflowY: 'auto' }}>
                        <AlliancePanel />
                    </div>
                </div>
            </div>
        );
    }

    // Default Upgrade View
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.panel} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>✕</button>

                <div className={styles.header}>
                    <div className={styles.icon}>{BUILDING_ICONS[buildingType]}</div>
                    <div className={styles.titleInfo}>
                        <h2 className={styles.title}>{info.name}</h2>
                        <span className={styles.level}>Nivel {currentLevel}</span>
                    </div>
                </div>

                {(isBarracks || isAllianceCenter) && renderTabs()}

                <div className={styles.content}>
                    <p className={styles.description}>{info.description}</p>

                    {/* Preview de Mejora */}
                    {productionPreview && (
                        <div className={styles.previewSection}>
                            <h3 className={styles.previewTitle}>📈 Con esta mejora</h3>
                            <div className={styles.previewContent}>
                                <div className={styles.previewItem}>
                                    <span className={styles.previewLabel}>Actual:</span>
                                    <span className={styles.previewCurrent}>{productionPreview.current}</span>
                                </div>
                                <div className={styles.previewArrow}>→</div>
                                <div className={styles.previewItem}>
                                    <span className={styles.previewLabel}>Nuevo:</span>
                                    <span className={styles.previewNew}>{productionPreview.next}</span>
                                </div>
                            </div>
                            <div className={styles.previewBonus}>
                                +{productionPreview.bonus} {productionPreview.unit}
                            </div>
                        </div>
                    )}

                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Costo de Mejora</h3>
                        <div className={styles.costs}>
                            <div className={`${styles.costItem} ${canAffordWood ? '' : styles.insufficient}`}>
                                <img src="/assets/resources/Wood Resource.webp" className={styles.costIcon} alt="Madera" />
                                <span className={styles.costValue}>{(cost.wood ?? 0).toLocaleString()}</span>
                                <span className={styles.costLabel}>Madera</span>
                            </div>
                            <div className={`${styles.costItem} ${canAffordIron ? '' : styles.insufficient}`}>
                                <img src="/assets/resources/Iron_Resource.webp" className={styles.costIcon} alt="Hierro" />
                                <span className={styles.costValue}>{(cost.iron ?? 0).toLocaleString()}</span>
                                <span className={styles.costLabel}>Hierro</span>
                            </div>
                            <div className={`${styles.costItem} ${canAffordGold ? '' : styles.insufficient}`}>
                                <img src="/assets/resources/Gold_Resource.webp" className={styles.costIcon} alt="Oro" />
                                <span className={styles.costValue}>{(cost.gold ?? 0).toLocaleString()}</span>
                                <span className={styles.costLabel}>Oro</span>
                            </div>
                            {(cost.population ?? 0) > 0 && (
                                <div className={`${styles.costItem} ${hasPopulation ? '' : styles.insufficient}`}>
                                    <img src="/assets/resources/Population.webp" className={styles.costIcon} alt="Población" />
                                    <span className={styles.costValue}>{cost.population}</span>
                                    <span className={styles.costLabel}>Población</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Tiempo de Construcción</h3>
                        <div className={styles.buildTime}>
                            <span className={styles.timeIcon}>⏱️</span>
                            <span className={styles.timeValue}>{formatBuildTime(buildTime)}</span>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        {upgradeError && (
                            <div className={styles.warning}>
                                ⚠️ {upgradeError}
                            </div>
                        )}
                        <button
                            className={`${styles.upgradeBtn} ${!canUpgrade ? styles.disabled : ''}`}
                            onClick={handleUpgrade}
                            disabled={!canUpgrade}
                        >
                            🔨 Mejorar a Nivel {nextLevel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface ProductionPreview {
    current: string;
    next: string;
    bonus: string;
    unit: string;
}

function getProductionPreview(type: BuildingType, currentLevel: number, nextLevel: number): ProductionPreview | null {
    switch (type) {
        case BuildingType.LUMBER_MILL: {
            const current = currentLevel > 0 ? getProductionPerHour(type, currentLevel) : 0;
            const next = getProductionPerHour(type, nextLevel);
            return {
                current: `${current}/h`,
                next: `${next}/h`,
                bonus: `${next - current}`,
                unit: 'madera/h'
            };
        }
        case BuildingType.IRON_MINE: {
            const current = currentLevel > 0 ? getProductionPerHour(type, currentLevel) : 0;
            const next = getProductionPerHour(type, nextLevel);
            return {
                current: `${current}/h`,
                next: `${next}/h`,
                bonus: `${next - current}`,
                unit: 'hierro/h'
            };
        }
        case BuildingType.GOLD_MINE: {
            const current = currentLevel > 0 ? getProductionPerHour(type, currentLevel) : 0;
            const next = getProductionPerHour(type, nextLevel);
            return {
                current: `${current}/h`,
                next: `${next}/h`,
                bonus: `${next - current}`,
                unit: 'oro/h'
            };
        }
        case BuildingType.FARM: {
            // Usando una fórmula aproximada para población
            const currentPop = currentLevel > 0 ? 100 + (currentLevel * 30) : 100;
            const nextPop = 100 + (nextLevel * 30);
            return {
                current: `${currentPop}`,
                next: `${nextPop}`,
                bonus: `${nextPop - currentPop}`,
                unit: 'población máx'
            };
        }
        case BuildingType.WAREHOUSE: {
            const currentCap = currentLevel > 0 ? 1000 + (currentLevel * 500) : 1000;
            const nextCap = 1000 + (nextLevel * 500);
            return {
                current: currentCap.toLocaleString(),
                next: nextCap.toLocaleString(),
                bonus: (nextCap - currentCap).toLocaleString(),
                unit: 'capacidad'
            };
        }
        default:
            return null;
    }
}
