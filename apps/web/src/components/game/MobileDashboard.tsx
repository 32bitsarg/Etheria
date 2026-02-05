'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';
import { CityMap } from '@/components/game/CityMap';
import { WorldMap } from '@/components/game/WorldMap';
import { BuildingType } from '@lootsystem/game-engine';
import { BuildingPanel } from '@/components/game/BuildingPanel';
import { ReportsPanel } from '@/components/game/ReportsPanel';
import { MessagesPanel } from '@/components/game/MessagesPanel';
import { ProfilePanel } from '@/components/game/ProfilePanel';
import { RankingPanel } from '@/components/game/RankingPanel';
import { ConstructionQueue } from '@/components/game/ConstructionQueue';
import { TrainingQueue } from '@/components/game/TrainingQueue';
import { GlobalChat } from '@/components/game/GlobalChat';
import { MusicPlayer, useMusicVolume } from '@/components/game/MusicPlayer';
import { MobileSettings } from './MobileSettings';
import { MobileBottomNav } from './MobileBottomNav';
import styles from './MobileDashboard.module.css';

export function MobileDashboard() {
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

    const [view, setView] = useState<'city' | 'world'>('city');
    const [selectedBuilding, setSelectedBuilding] = useState<BuildingType | null>(null);
    const [showBuildingPanel, setShowBuildingPanel] = useState(false);
    const [showReportsPanel, setShowReportsPanel] = useState(false);
    const [showMessagesPanel, setShowMessagesPanel] = useState(false);
    const [showProfilePanel, setShowProfilePanel] = useState(false);
    const [showRankingPanel, setShowRankingPanel] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [profilePlayerId, setProfilePlayerId] = useState<string | null>(null);
    const { volume, setVolume } = useMusicVolume();

    useEvents(player?.id, syncWithServer);

    if (!player) return null;

    const handleBuildingClick = (type: BuildingType) => {
        setSelectedBuilding(type);
        setShowBuildingPanel(true);
    };

    const handleOpenProfile = (id: string = player.id) => {
        setProfilePlayerId(id);
        setShowProfilePanel(true);
    };

    const handlePanelChange = (panelId: string | null) => {
        // Reset all panels
        setShowReportsPanel(panelId === 'reports');
        setShowMessagesPanel(panelId === 'messages');
        setShowRankingPanel(panelId === 'ranking');
        setShowSettings(panelId === 'settings');
        if (panelId === 'profile') handleOpenProfile();
    };

    return (
        <div className={`${styles.mobileContainer} ${view === 'world' ? styles.worldView : ''}`}>
            {/* Minimal Top HUD */}
            <div className={styles.topHUD}>
                <div className={styles.resourcesBar}>
                    <div className={styles.resItem}>
                        <img src="/assets/resources/Wood Resource.png" className={styles.resIcon} alt="Wood" />
                        {Math.floor(player.resources.wood)}
                    </div>
                    <div className={styles.resItem}>
                        <img src="/assets/resources/Iron_Resource.png" className={styles.resIcon} alt="Iron" />
                        {Math.floor(player.resources.iron)}
                    </div>
                    <div className={styles.resItem}>
                        <img src="/assets/resources/Gold_Resource.png" className={styles.resIcon} alt="Gold" />
                        {Math.floor(player.resources.gold)}
                    </div>
                    <div className={styles.resItem}>
                        <img src="/assets/resources/Population.png" className={styles.resIcon} alt="Pop" />
                        {player.resources.populationUsed}/{player.resources.populationMax}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.mapContainer}>
                {view === 'city' ? (
                    <CityMap
                        buildings={player.city.buildings}
                        onBuildingClick={handleBuildingClick}
                        queue={player.city.constructionQueue}
                        isMobile={true}
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

            {/* Modals */}
            {showBuildingPanel && selectedBuilding && (
                <BuildingPanel
                    buildingType={selectedBuilding}
                    player={player}
                    onClose={() => setShowBuildingPanel(false)}
                    onUpgrade={upgradeBuilding}
                />
            )}

            {showReportsPanel && (
                <ReportsPanel
                    playerId={player.id}
                    onClose={() => setShowReportsPanel(false)}
                />
            )}

            {showMessagesPanel && (
                <MessagesPanel
                    playerId={player.id}
                    onClose={() => setShowMessagesPanel(false)}
                />
            )}

            {showRankingPanel && (
                <RankingPanel
                    onClose={() => setShowRankingPanel(false)}
                    onPlayerClick={handleOpenProfile}
                />
            )}

            {showProfilePanel && profilePlayerId && (
                <ProfilePanel
                    playerId={profilePlayerId}
                    isOwnProfile={profilePlayerId === player.id}
                    onClose={() => setShowProfilePanel(false)}
                />
            )}

            {showSettings && (
                <MobileSettings
                    onClose={() => setShowSettings(false)}
                    volume={volume}
                    onVolumeChange={setVolume}
                />
            )}

            {/* Queues Overlay (Minimal) */}
            <div className={styles.queuesOverlay}>
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

            {/* Persistent Global Chat (Above Bottom Nav) */}
            {userId && (
                <div className={styles.mobileChatView}>
                    <GlobalChat userId={userId} username={player.username} showHeader={false} />
                </div>
            )}


            <MobileBottomNav
                currentView={view}
                onViewChange={setView}
                onPanelChange={handlePanelChange}
            />

            {/* Background Music */}
            <MusicPlayer
                src="/assets/sounds/music/villge.mp3"
                volume={volume}
            />
        </div>
    );
}
