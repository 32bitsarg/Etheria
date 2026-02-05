'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents'; // Added this line
import { CityMap } from '@/components/game/CityMap';
import { WorldMap } from '@/components/game/WorldMap';
import { TileMapCanvas } from '@/components/game/TileMapCanvas';
import { BuildingPanel } from '@/components/game/BuildingPanel';
import { ConstructionQueue } from '@/components/game/ConstructionQueue';
import { GlobalChat } from '@/components/game/GlobalChat';
import { AnimatedResource } from '@/components/game/AnimatedResource';
import { MusicPlayer, useMusicVolume } from '@/components/game/MusicPlayer';
import { Sidebar } from '@/components/game/Sidebar';
import { TrainingQueue } from '@/components/game/TrainingQueue';
import { UnitsDisplay } from '@/components/game/UnitsDisplay';
import { ReportsPanel } from '@/components/game/ReportsPanel';
import { CombatMovements } from '@/components/game/CombatMovements';
import { MessagesPanel } from '@/components/game/MessagesPanel';
import { ProfilePanel } from '@/components/game/ProfilePanel';
import { RankingPanel } from '@/components/game/RankingPanel';
import {
    processTick,
    calculateProductionRates,
    getStorageLimits,
    getMaxPopulation,
    RAZAS,
    BuildingType
} from '@lootsystem/game-engine';
import styles from './GameDashboard.module.css';

export function GameDashboard() {
    const {
        player,
        userId,
        updatePlayer,
        logout,
        upgradeBuilding,
        instantCompleteBuilding,
        cancelBuildingUpgrade,
        cancelTraining,
        finishTraining,
        syncWithServer
    } = useAuth();
    const [selectedBuilding, setSelectedBuilding] = useState<BuildingType | null>(null);
    const [showBuildingPanel, setShowBuildingPanel] = useState(false);
    const [showReportsPanel, setShowReportsPanel] = useState(false);
    const [showMessagesPanel, setShowMessagesPanel] = useState(false);
    const [showProfilePanel, setShowProfilePanel] = useState(false);
    const [showRankingPanel, setShowRankingPanel] = useState(false);
    const [profilePlayerId, setProfilePlayerId] = useState<string | null>(null);
    const [view, setView] = useState<'city' | 'world'>('city');

    // Música y eventos
    const { volume, setVolume } = useMusicVolume();
    useEvents(player?.id, syncWithServer);

    // Actualizar recursos cada segundo
    useEffect(() => {
        if (!player) return;

        const interval = setInterval(() => {
            const updated = processTick(player);
            updatePlayer(updated);
        }, 1000);

        return () => clearInterval(interval);
    }, [player, updatePlayer]);

    if (!player) return null;

    const rates = calculateProductionRates(player);
    const limits = getStorageLimits(player);
    const maxPop = getMaxPopulation(player);
    const race = RAZAS[player.race];

    const handleBuildingClick = (type: BuildingType) => {
        setSelectedBuilding(type);
        setShowBuildingPanel(true);
    };

    const handleOpenProfile = (id: string = player.id) => {
        setProfilePlayerId(id);
        setShowProfilePanel(true);
    };

    const handleCancelConstruction = async (queueItemId: string) => {
        await cancelBuildingUpgrade(queueItemId);
    };

    const handleInstantComplete = async (queueItemId: string) => {
        await instantCompleteBuilding(queueItemId);
    };

    // Calcular porcentajes para las barras de recursos
    const woodPercent = Math.min(100, (player.resources.wood / limits.maxWood) * 100);
    const ironPercent = Math.min(100, (player.resources.iron / limits.maxIron) * 100);
    const goldPercent = Math.min(100, (player.resources.gold / limits.maxGold) * 100);

    // Población: disponible = máximo - usada
    const availablePopulation = maxPop - player.resources.populationUsed;
    const popPercent = Math.min(100, (player.resources.populationUsed / maxPop) * 100);

    return (
        <div className={styles.gameContainer}>
            {/* Top HUD - Centered Resource Bar */}
            <div className={styles.topHUD}>
                {/* Replaced empty left slot with spacer or simplified indicator if needed, 
                    for now keeping empty to balance layout or just removing the cityBadge element */}
                <div className={styles.topLeft}></div>

                <div className={styles.resourcesBar}>
                    <div className={styles.resourceItem}>
                        <div className={styles.resourceHeader}>
                            <img src="/assets/resources/Wood Resource.png" className={styles.resourceIcon} alt="Wood" />
                            <span className={styles.resourceValue}>
                                <AnimatedResource
                                    value={player.resources.wood}
                                    ratePerHour={rates.woodPerHour}
                                    formatFn={formatNumber}
                                />
                            </span>
                        </div>
                        <div className={styles.resourceBar}>
                            <div
                                className={styles.resourceFill}
                                style={{ width: `${woodPercent}%`, backgroundColor: '#8b5a2b' }}
                            />
                        </div>
                        <span className={styles.resourceRate}>+{rates.woodPerHour}/h</span>
                    </div>

                    <div className={styles.resourceItem}>
                        <div className={styles.resourceHeader}>
                            <img src="/assets/resources/Iron_Resource.png" className={styles.resourceIcon} alt="Iron" />
                            <span className={styles.resourceValue}>
                                <AnimatedResource
                                    value={player.resources.iron}
                                    ratePerHour={rates.ironPerHour}
                                    formatFn={formatNumber}
                                />
                            </span>
                        </div>
                        <div className={styles.resourceBar}>
                            <div
                                className={styles.resourceFill}
                                style={{ width: `${ironPercent}%`, backgroundColor: '#64748b' }}
                            />
                        </div>
                        <span className={styles.resourceRate}>+{rates.ironPerHour}/h</span>
                    </div>

                    <div className={styles.resourceItem}>
                        <div className={styles.resourceHeader}>
                            <img src="/assets/resources/Gold_Resource.png" className={styles.resourceIcon} alt="Gold" />
                            <span className={styles.resourceValue}>
                                <AnimatedResource
                                    value={player.resources.gold}
                                    ratePerHour={rates.goldPerHour}
                                    formatFn={formatNumber}
                                />
                            </span>
                        </div>
                        <div className={styles.resourceBar}>
                            <div
                                className={styles.resourceFill}
                                style={{ width: `${goldPercent}%`, backgroundColor: '#eab308' }}
                            />
                        </div>
                        <span className={styles.resourceRate}>+{rates.goldPerHour}/h</span>
                    </div>

                    <div className={styles.resourceDivider} />

                    <div className={styles.resourceItem}>
                        <div className={styles.resourceHeader}>
                            <img src="/assets/resources/Population.png" className={styles.resourceIcon} alt="Pop" />
                            <span className={styles.resourceValue}>
                                {availablePopulation}/{maxPop}
                            </span>
                        </div>
                        <div className={styles.resourceBar}>
                            <div
                                className={styles.resourceFill}
                                style={{ width: `${popPercent}%`, backgroundColor: '#22c55e' }}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.topRight}>
                    {/* Admin/Debug button - remove in production */}
                    <button
                        className={styles.menuBtn}
                        onClick={async () => {
                            const res = await fetch('/api/v1/admin/grant-resources', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    playerId: player.id,
                                    wood: 2000,
                                    iron: 2000,
                                    gold: 1000
                                })
                            });
                            if (res.ok) {
                                const data = await res.json();
                                updatePlayer({
                                    ...player,
                                    resources: {
                                        ...player.resources,
                                        wood: player.resources.wood + 2000,
                                        iron: player.resources.iron + 2000,
                                        gold: player.resources.gold + 1000
                                    }
                                });
                                alert('¡Recursos añadidos! +2000🪵 +2000⛏️ +1000💰');
                            }
                        }}
                        title="[DEV] Añadir recursos"
                    >
                        💎
                    </button>
                    {/* Logout button moved to Sidebar */}
                </div>
            </div>

            {/* Right Sidebar Queues - Construction & Training */}
            <div className={styles.rightSidebar}>
                <UnitsDisplay />

                <div className={styles.queuesContainer}>
                    <CombatMovements
                        originMovements={(player.city as any).originMovements || []}
                        targetMovements={(player.city as any).targetMovements || []}
                        onArrival={syncWithServer}
                    />

                    <ConstructionQueue
                        queue={player.city.constructionQueue}
                        onCancel={cancelBuildingUpgrade}
                        onInstantComplete={instantCompleteBuilding}
                        onComplete={syncWithServer}
                    />

                    <TrainingQueue
                        queue={player.city.trainingQueue}
                        onCancel={cancelTraining}
                        onFinishNow={finishTraining}
                        onComplete={syncWithServer}
                    />
                </div>
            </div>
            {/* Background Layer: TileMap - Removed/Disabled for static image background */}
            {/* <TileMapCanvas width={30} height={20} /> */}

            {/* Main Map Area */}
            <div className={styles.mapContainer}>
                {view === 'city' ? (
                    <CityMap
                        buildings={player.city.buildings}
                        onBuildingClick={handleBuildingClick}
                        queue={player.city.constructionQueue}
                    />
                ) : (
                    <WorldMap
                        playerCityCoords={{ x: (player.city as any).x || 0, y: (player.city as any).y || 0 }}
                        currentPlayerId={userId || undefined}
                        availableUnits={(player.city as any).units || []}
                        onViewProfile={handleOpenProfile}
                    />
                )}
            </div>

            {/* Building Panel (Modal) */}
            {showBuildingPanel && selectedBuilding && (
                <BuildingPanel
                    buildingType={selectedBuilding}
                    player={player}
                    onClose={() => {
                        setShowBuildingPanel(false);
                        setSelectedBuilding(null);
                    }}
                    onUpgrade={upgradeBuilding}
                />
            )}

            {/* Global Chat */}
            <GlobalChat userId={player.id} username={player.city.name} />

            {/* Reports Panel */}
            {showReportsPanel && (
                <ReportsPanel
                    playerId={player.id}
                    onClose={() => setShowReportsPanel(false)}
                />
            )}

            {/* Messages Panel */}
            {showMessagesPanel && (
                <MessagesPanel
                    playerId={player.id}
                    onClose={() => setShowMessagesPanel(false)}
                />
            )}

            {showProfilePanel && profilePlayerId && (
                <ProfilePanel
                    playerId={profilePlayerId}
                    isOwnProfile={profilePlayerId === player.id}
                    onClose={() => setShowProfilePanel(false)}
                />
            )}

            {/* Sidebar with Settings and Logout */}
            <Sidebar
                onLogout={logout}
                musicVolume={volume}
                onVolumeChange={setVolume}
                city={player.city.name}
                race={race?.nombre || player.race}
                currentView={view}
                onViewChange={setView}
                onReportsClick={() => setShowReportsPanel(true)}
                onMessagesClick={() => setShowMessagesPanel(true)}
                onRankingClick={() => setShowRankingPanel(true)}
                onProfileClick={() => handleOpenProfile()}
                level={player.level || 1}
            />

            {showRankingPanel && (
                <RankingPanel
                    onClose={() => setShowRankingPanel(false)}
                    onPlayerClick={(targetId) => {
                        setProfilePlayerId(targetId);
                        setShowProfilePanel(true);
                    }}
                />
            )}

            {/* Background Music */}
            <MusicPlayer
                src="/assets/sounds/music/villge.mp3"
                volume={volume}
            />
        </div>
    );
}

function getRaceIcon(race: string): string {
    const icons: Record<string, string> = {
        elfo: '🧝',
        humano: '👤',
        orco: '👹',
        enano: '🧔',
    };
    return icons[race] || '👤';
}

function formatNumber(n: number): string {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return Math.floor(n).toString();
}
