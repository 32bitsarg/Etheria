'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents'; // Added this line
import { CityMap } from '@/components/game/CityMap';
import { WorldMap } from '@/components/game/WorldMap';
import { TileMapCanvas } from '@/components/game/TileMapCanvas';
import dynamic from 'next/dynamic';

import { ConstructionQueue } from '@/components/game/ConstructionQueue';
import { AnimatedResource } from '@/components/game/AnimatedResource';
import { MusicPlayer } from '@/components/game/MusicPlayer';
import { useVolume } from '@/hooks/useVolume';
import { Sidebar } from '@/components/game/Sidebar';
import { TrainingQueue } from '@/components/game/TrainingQueue';
import { UnitsDisplay } from '@/components/game/UnitsDisplay';
import { CombatMovements } from '@/components/game/CombatMovements';

const BuildingPanel = dynamic(() => import('@/components/game/BuildingPanel').then(mod => mod.BuildingPanel), { ssr: false });
const GlobalChat = dynamic(() => import('@/components/game/GlobalChat').then(mod => mod.GlobalChat), { ssr: false });
const ReportsPanel = dynamic(() => import('@/components/game/ReportsPanel').then(mod => mod.ReportsPanel), { ssr: false });
const MessagesPanel = dynamic(() => import('@/components/game/MessagesPanel').then(mod => mod.MessagesPanel), { ssr: false });
const ProfilePanel = dynamic(() => import('@/components/game/ProfilePanel').then(mod => mod.ProfilePanel), { ssr: false });
const RankingPanel = dynamic(() => import('@/components/game/RankingPanel').then(mod => mod.RankingPanel), { ssr: false });
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
    const { musicVolume, sfxVolume, setMusicVolume, setSfxVolume } = useVolume();
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

    const handleBuildingClick = useCallback((type: BuildingType) => {
        setSelectedBuilding(type);
        setShowBuildingPanel(true);
    }, []);

    const handleOpenProfile = useCallback((id?: string) => {
        if (!player) return;
        setProfilePlayerId(id || player.id);
        setShowProfilePanel(true);
    }, [player]);

    const handleCancelConstruction = useCallback(async (queueItemId: string) => {
        await cancelBuildingUpgrade(queueItemId);
    }, [cancelBuildingUpgrade]);

    const handleInstantComplete = useCallback(async (queueItemId: string) => {
        await instantCompleteBuilding(queueItemId);
    }, [instantCompleteBuilding]);

    if (!player) return null;

    const rates = calculateProductionRates(player);
    const limits = getStorageLimits(player);
    const maxPop = getMaxPopulation(player);
    const race = RAZAS[player.race];

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
                            <img src="/assets/resources/Wood Resource.webp" className={styles.resourceIcon} alt="Wood" />
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
                            <img src="/assets/resources/Iron_Resource.webp" className={styles.resourceIcon} alt="Iron" />
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
                            <img src="/assets/resources/Gold_Resource.webp" className={styles.resourceIcon} alt="Gold" />
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
                            <img src="/assets/resources/Population.webp" className={styles.resourceIcon} alt="Pop" />
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
                    {/* Logout button moved to Sidebar */}
                </div>
            </div>

            {/* Right Sidebar Queues - Construction & Training */}
            <div className={styles.rightSidebar}>
                <UnitsDisplay />

                <div className={styles.queuesContainer}>
                    <CombatMovements
                        originMovements={player.city.originMovements || []}
                        targetMovements={player.city.targetMovements || []}
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
                        playerCityCoords={{ x: player.city.x || 0, y: player.city.y || 0 }}
                        currentPlayerId={userId || undefined}
                        availableUnits={player.city.units || []}
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
                musicVolume={musicVolume}
                sfxVolume={sfxVolume}
                onMusicVolumeChange={setMusicVolume}
                onSfxVolumeChange={setSfxVolume}
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
