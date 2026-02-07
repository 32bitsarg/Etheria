'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';
import { CityMap } from '@/components/game/CityMap';
import { WorldMap } from '@/components/game/WorldMap';
import { BuildingType } from '@lootsystem/game-engine';
import dynamic from 'next/dynamic';

const BuildingPanel = dynamic(() => import('@/components/game/BuildingPanel').then(mod => mod.BuildingPanel), { ssr: false });
const ReportsPanel = dynamic(() => import('@/components/game/ReportsPanel').then(mod => mod.ReportsPanel), { ssr: false });
const MessagesPanel = dynamic(() => import('@/components/game/MessagesPanel').then(mod => mod.MessagesPanel), { ssr: false });
const ProfilePanel = dynamic(() => import('@/components/game/ProfilePanel').then(mod => mod.ProfilePanel), { ssr: false });
const RankingPanel = dynamic(() => import('@/components/game/RankingPanel').then(mod => mod.RankingPanel), { ssr: false });
const GlobalChat = dynamic(() => import('@/components/game/GlobalChat').then(mod => mod.GlobalChat), { ssr: false });
const MarketDashboard = dynamic(() => import('@/components/game/market/MarketDashboard').then(mod => mod.MarketDashboard), { ssr: false });
const MusicPlayer = dynamic(() => import('@/components/game/MusicPlayer').then(mod => mod.MusicPlayer), { ssr: false });

import { ConstructionQueue } from '@/components/game/ConstructionQueue';
import { TrainingQueue } from '@/components/game/TrainingQueue';
import { useVolume } from '@/hooks/useVolume';
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
    const [showMarketPanel, setShowMarketPanel] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [profilePlayerId, setProfilePlayerId] = useState<string | null>(null);
    const { musicVolume, sfxVolume, setMusicVolume, setSfxVolume } = useVolume();

    useEvents(player?.id, syncWithServer);

    const handleBuildingClick = useCallback((type: BuildingType) => {
        setSelectedBuilding(type);
        setShowBuildingPanel(true);
    }, []);

    const handleOpenProfile = useCallback((id?: string) => {
        if (!player) return;
        setProfilePlayerId(id || player.id);
        setShowProfilePanel(true);
    }, [player]);

    const handlePanelChange = useCallback((panelId: string | null) => {
        if (!player) return;
        // Reset all panels
        setShowReportsPanel(panelId === 'reports');
        setShowMessagesPanel(panelId === 'messages');
        setShowRankingPanel(panelId === 'ranking');
        setShowMarketPanel(panelId === 'market');
        setShowSettings(panelId === 'settings');
        if (panelId === 'profile') handleOpenProfile();
    }, [player, handleOpenProfile]);

    if (!player) return null;

    return (
        <div className={`${styles.mobileContainer} ${view === 'world' ? styles.worldView : ''}`}>
            {/* Minimal Top HUD */}
            <div className={styles.topHUD}>
                <div className={styles.resourcesBar}>
                    <div className={styles.resItem}>
                        <img src="/assets/resources/Wood Resource.webp" className={styles.resIcon} alt="Wood" />
                        {Math.floor(player.resources.wood)}
                    </div>
                    <div className={styles.resItem}>
                        <img src="/assets/resources/Iron_Resource.webp" className={styles.resIcon} alt="Iron" />
                        {Math.floor(player.resources.iron)}
                    </div>
                    <div className={styles.resItem}>
                        <img src="/assets/resources/Gold_Resource.webp" className={styles.resIcon} alt="Oro" />
                        {Math.floor(player.resources.gold)}
                    </div>
                    <div className={styles.resItem}>
                        <span style={{ fontSize: '1rem' }}>💰</span>
                        {Math.floor(player.resources.doblones || 0)}
                    </div>
                    <div className={styles.resItem}>
                        <span style={{ fontSize: '1rem' }}>✨</span>
                        {Math.floor(player.resources.etherFragments || 0)}
                    </div>
                    <div className={styles.resItem}>
                        <img src="/assets/resources/Population.webp" className={styles.resIcon} alt="Pop" />
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

            {showMarketPanel && (
                <div className={styles.overlayPanel}>
                    <div className={styles.panelHeader}>
                        <h3>Mercado Imperial</h3>
                        <button className={styles.closeBtn} onClick={() => setShowMarketPanel(false)}>✕</button>
                    </div>
                    <MarketDashboard />
                </div>
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
                    musicVolume={musicVolume}
                    sfxVolume={sfxVolume}
                    onMusicVolumeChange={setMusicVolume}
                    onSfxVolumeChange={setSfxVolume}
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
            />
        </div>
    );
}
