
'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import styles from './WorldMap.module.css';

interface WorldCity {
    id: string;
    name: string;
    x: number;
    y: number;
    player: {
        race: string;
        userId: string;
        allianceMember?: {
            alliance: {
                name: string;
                tag: string;
            }
        }
    }
}

interface NPCCamp {
    id: string;
    type: string;
    tier: number;
    x: number;
    y: number;
    name: string;
    image: string;
    isDestroyed: boolean;
    respawnAt: string | null;
}

interface WorldMapProps {
    playerCityCoords?: { x: number; y: number };
    currentPlayerId?: string;
    availableUnits?: { type: string; count: number }[];
    onViewProfile?: (playerId: string) => void;
}

const MAP_SIZE = 10000;
const GRID_COUNT = 20;

// Definición de SLOTS por tipo de isla (Coordenadas relativas en px desde el centro 350x350)
const ISLAND_SLOTS = {
    mini: [
        { x: -50, y: -30 }, { x: 55, y: -10 }, { x: -10, y: 60 }
    ],
    medium: [
        { x: -70, y: -40 }, { x: 60, y: -60 }, { x: 10, y: 15 },
        { x: -60, y: 70 }, { x: 70, y: 55 }
    ],
    large: [
        { x: -100, y: -70 }, { x: 30, y: -90 }, { x: 110, y: -30 },
        { x: -40, y: 5 }, { x: 80, y: 40 }, { x: -80, y: 90 },
        { x: 30, y: 110 }, { x: 120, y: 80 }
    ]
};

function seededRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

import { UnitType } from '@lootsystem/game-engine';
import { RadialMenu } from './RadialMenu';
import { AttackPanel } from './AttackPanel';
import { RaidPanel } from './RaidPanel';
import { RaidResultModal } from './RaidResultModal';
import { useToast } from '../ui/ToastContext';

function RespawnTimer({ targetDate }: { targetDate: string }) {
    const [timeLeft, setTimeLeft] = useState<string>('');

    useEffect(() => {
        const update = () => {
            const now = Date.now();
            const target = new Date(targetDate).getTime();
            const diff = target - now;

            if (diff <= 0) {
                setTimeLeft('Reapareciendo...');
                return;
            }

            const mins = Math.floor(diff / 60000);
            const secs = Math.floor((diff % 60000) / 1000);
            setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`);
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    return <span style={{ color: '#aaa', fontSize: '0.7rem' }}>{timeLeft}</span>;
}

const toRoman = (num: number) => {
    const romanMap: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III' };
    return romanMap[num] || num.toString();
};

export function WorldMap({ playerCityCoords, currentPlayerId, availableUnits = [], onViewProfile }: WorldMapProps) {
    const { addToast } = useToast();
    const [cities, setCities] = useState<WorldCity[]>([]);
    const [npcCamps, setNpcCamps] = useState<NPCCamp[]>([]);
    const [loading, setLoading] = useState(true);

    const offsetRef = useRef({ x: -4500, y: -4500 });
    const [visibleOffset, setVisibleOffset] = useState({ x: -4500, y: -4500 });

    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    const hasCentered = useRef(false);

    const [selectedCity, setSelectedCity] = useState<{ city: WorldCity, pos: { x: number, y: number } } | null>(null);
    const [showAttackPanel, setShowAttackPanel] = useState<{ id: string, name: string } | null>(null);

    // Estados para Raids NPC
    const [selectedCamp, setSelectedCamp] = useState<NPCCamp | null>(null);
    const [raidResult, setRaidResult] = useState<{ result: any, campName: string } | null>(null);

    const isDragging = useRef(false);
    const startPos = useRef({ x: 0, y: 0 });

    const getCell = (val: number) => Math.floor(Math.min(99, Math.max(0, val)) / (100 / GRID_COUNT));

    useEffect(() => {
        const fetchMap = async () => {
            try {
                // Fetch ciudades
                const citiesRes = await fetch('/api/v1/world/map');
                const citiesData = await citiesRes.json();
                if (citiesData.success) {
                    setCities(citiesData.cities);
                }

                // Fetch campamentos NPC (incluir destruidos para mostrar ruinas)
                const campsRes = await fetch('/api/v1/map/npcs?x1=0&y1=0&x2=100&y2=100&includeDestroyed=true');
                const campsData = await campsRes.json();
                if (campsData.success) {
                    setNpcCamps(campsData.camps);
                }
            } catch (error) {
                console.error('Error fetching world map:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMap();
    }, []);

    const islandDataList = useMemo(() => {
        const islands = [];
        const cellSize = 100 / GRID_COUNT;
        for (let row = 0; row < GRID_COUNT; row++) {
            for (let col = 0; col < GRID_COUNT; col++) {
                const seed = row * GRID_COUNT + col;

                // Encontrar TODOS los habitantes de esta isla
                const inhabitants = cities.filter(c => getCell(c.x) === col && getCell(c.y) === row);

                const maxJitterPercent = (80 / MAP_SIZE) * 100;
                const jitterX = (seededRandom(seed * 1.5) - 0.5) * maxJitterPercent * 2;
                const jitterY = (seededRandom(seed * 2.5) - 0.5) * maxJitterPercent * 2;
                const posX = ((col * cellSize) + (cellSize / 2) + jitterX) / 100 * MAP_SIZE;
                const posY = ((row * cellSize) + (cellSize / 2) + jitterY) / 100 * MAP_SIZE;
                const rotation = Math.floor(seededRandom(seed * 4.2) * 360);
                const type = seed % 3 === 0 ? 'large' : seed % 2 === 0 ? 'medium' : 'mini';

                islands.push({ id: seed, posX, posY, type, rotation, inhabitants });
            }
        }
        return islands;
    }, [cities]);

    const visibleIslands = useMemo(() => {
        const buffer = 600;
        const viewW = typeof window !== 'undefined' ? window.innerWidth : 1920;
        const viewH = typeof window !== 'undefined' ? window.innerHeight : 1080;
        const left = -visibleOffset.x - buffer;
        const top = -visibleOffset.y - buffer;
        const right = -visibleOffset.x + viewW + buffer;
        const bottom = -visibleOffset.y + viewH + buffer;

        return islandDataList.filter(isl =>
            isl.posX >= left && isl.posX <= right &&
            isl.posY >= top && isl.posY <= bottom
        );
    }, [islandDataList, visibleOffset]);

    const updateMapTransform = useCallback(() => {
        if (mapRef.current) {
            mapRef.current.style.transform = `translate3d(${offsetRef.current.x}px, ${offsetRef.current.y}px, 0)`;
        }
    }, []);

    useEffect(() => {
        if (playerCityCoords && !hasCentered.current) {
            const col = getCell(playerCityCoords.x);
            const row = getCell(playerCityCoords.y);
            const cellSize = 100 / GRID_COUNT;
            const seed = row * GRID_COUNT + col;
            const maxJitterPercent = (80 / MAP_SIZE) * 100;
            const jitterX = (seededRandom(seed * 1.5) - 0.5) * maxJitterPercent * 2;
            const jitterY = (seededRandom(seed * 2.5) - 0.5) * maxJitterPercent * 2;
            const targetX = (((col * cellSize) + (cellSize / 2) + jitterX) / 100) * MAP_SIZE;
            const targetY = (((row * cellSize) + (cellSize / 2) + jitterY) / 100) * MAP_SIZE;
            const initialX = Math.min(0, Math.max(-(MAP_SIZE - window.innerWidth), (window.innerWidth / 2) - targetX));
            const initialY = Math.min(0, Math.max(-(MAP_SIZE - window.innerHeight), (window.innerHeight / 2) - targetY));
            offsetRef.current = { x: initialX, y: initialY };
            setVisibleOffset({ x: initialX, y: initialY });
            updateMapTransform();
            hasCentered.current = true;
        }
    }, [playerCityCoords, cities, updateMapTransform]);

    return (
        <div
            ref={containerRef}
            className={styles.worldWrapper}
            onMouseDown={(e) => {
                isDragging.current = true;
                startPos.current = { x: e.clientX - offsetRef.current.x, y: e.clientY - offsetRef.current.y };
                containerRef.current?.classList.add(styles.grabbing);
                setSelectedCity(null); // Cerrar menú al empezar a arrastrar
            }}
            onMouseMove={(e) => {
                if (!isDragging.current) return;
                let nX = Math.min(0, Math.max(-(MAP_SIZE - window.innerWidth), e.clientX - startPos.current.x));
                let nY = Math.min(0, Math.max(-(MAP_SIZE - window.innerHeight), e.clientY - startPos.current.y));
                offsetRef.current = { x: nX, y: nY };
                if (mapRef.current) mapRef.current.style.transform = `translate3d(${nX}px, ${nY}px, 0)`;
            }}
            onMouseUp={() => {
                if (isDragging.current) {
                    isDragging.current = false;
                    containerRef.current?.classList.remove(styles.grabbing);
                    setVisibleOffset(offsetRef.current);
                }
            }}
            onMouseLeave={() => {
                if (isDragging.current) {
                    isDragging.current = false;
                    containerRef.current?.classList.remove(styles.grabbing);
                    setVisibleOffset(offsetRef.current);
                }
            }}
            onTouchStart={(e) => {
                isDragging.current = true;
                const touch = e.touches[0];
                startPos.current = { x: touch.clientX - offsetRef.current.x, y: touch.clientY - offsetRef.current.y };
                setSelectedCity(null);
            }}
            onTouchMove={(e) => {
                if (!isDragging.current) return;
                const touch = e.touches[0];
                let nX = Math.min(0, Math.max(-(MAP_SIZE - window.innerWidth), touch.clientX - startPos.current.x));
                let nY = Math.min(0, Math.max(-(MAP_SIZE - window.innerHeight), touch.clientY - startPos.current.y));
                offsetRef.current = { x: nX, y: nY };
                if (mapRef.current) mapRef.current.style.transform = `translate3d(${nX}px, ${nY}px, 0)`;
            }}
            onTouchEnd={() => {
                if (isDragging.current) {
                    isDragging.current = false;
                    setVisibleOffset(offsetRef.current);
                }
            }}
        >
            <div className={styles.fogOverlay} />
            <div
                ref={mapRef}
                className={styles.mapCanvas}
                style={{
                    width: `${MAP_SIZE}px`, height: `${MAP_SIZE}px`,
                    transform: `translate3d(${offsetRef.current.x}px, ${offsetRef.current.y}px, 0)`,
                    backgroundSize: '2000px 2000px'
                }}
            >
                {visibleIslands.map(island => (
                    <div
                        key={island.id}
                        className={styles.cityNode}
                        style={{ left: `${island.posX}px`, top: `${island.posY}px` }}
                    >
                        <div className={styles.islandContainer}>
                            <img
                                src={`/assets/islands/island${island.type}.webp`}
                                className={styles.islandImg}
                                style={{ transform: `rotate(${island.rotation}deg)` }}
                                alt="Isla"
                            />

                            {/* RENDER DE ALDEAS SOBRE LA ISLA */}
                            {island.inhabitants.map((city, index) => {
                                const slots = ISLAND_SLOTS[island.type as keyof typeof ISLAND_SLOTS];
                                // Fallback: si supera el límite, los ponemos en un círculo exterior
                                const slot = slots[index] || {
                                    x: Math.cos(index * 2) * 120,
                                    y: Math.sin(index * 2) * 120
                                };

                                return (
                                    <div
                                        key={city.id}
                                        className={styles.villageNode}
                                        style={{
                                            transform: `translate(-50%, -50%) translate(${slot.x}px, ${slot.y}px)`
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // No mostrar menú si es nuestra propia aldea
                                            if (city.player.userId === currentPlayerId) return;

                                            const rect = e.currentTarget.getBoundingClientRect();
                                            setSelectedCity({
                                                city,
                                                pos: {
                                                    x: rect.left + rect.width / 2,
                                                    y: rect.top + rect.height / 2
                                                }
                                            });
                                        }}
                                    >
                                        <div className={styles.villageTooltip}>
                                            {city.player.allianceMember && (
                                                <span className={styles.villageTag}>
                                                    [{city.player.allianceMember.alliance.tag}]
                                                </span>
                                            )}
                                            <span className={styles.villageName}>{city.name}</span>
                                        </div>
                                        <img
                                            src="/assets/islands/villages.webp"
                                            className={styles.villageImg}
                                            alt="Aldea"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Renderizado de Campamentos NPC */}
                {npcCamps.map(camp => {
                    // Convertir coordenadas NPC (0-100) al sistema de celdas de islas
                    const col = getCell(camp.x);
                    const row = getCell(camp.y);
                    const cellSize = 100 / GRID_COUNT;
                    const seed = row * GRID_COUNT + col;

                    // Usar el mismo jitter que las islas para que el campamento aparezca sobre ellas
                    const maxJitterPercent = (80 / MAP_SIZE) * 100;
                    const jitterX = (seededRandom(seed * 1.5) - 0.5) * maxJitterPercent * 2;
                    const jitterY = (seededRandom(seed * 2.5) - 0.5) * maxJitterPercent * 2;

                    // Posición base de la isla
                    const islandPosX = ((col * cellSize) + (cellSize / 2) + jitterX) / 100 * MAP_SIZE;
                    const islandPosY = ((row * cellSize) + (cellSize / 2) + jitterY) / 100 * MAP_SIZE;

                    // Offset aleatorio dentro de la isla (±100px del centro)
                    const campSeed = camp.id.charCodeAt(0) + camp.id.charCodeAt(camp.id.length - 1);
                    const campOffsetX = (seededRandom(campSeed * 3.7) - 0.5) * 120;
                    const campOffsetY = (seededRandom(campSeed * 5.3) - 0.5) * 120;

                    return (
                        <div
                            key={`npc-${camp.id}`}
                            className={`${styles.npcCampNode} ${camp.isDestroyed ? styles.npcCampDestroyed : ''}`}
                            style={{
                                left: `${islandPosX + campOffsetX}px`,
                                top: `${islandPosY + campOffsetY}px`,
                                opacity: camp.isDestroyed ? 0.6 : 1,
                                cursor: camp.isDestroyed ? 'default' : 'pointer',
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                // Solo permitir click en campamentos activos
                                if (!camp.isDestroyed) {
                                    setSelectedCamp(camp);
                                }
                            }}
                        >
                            <div className={styles.npcCampTooltip}>
                                <span className={styles.npcCampTier}>
                                    {camp.isDestroyed ? '💀 Tier ' + toRoman(camp.tier) : `Tier ${toRoman(camp.tier)}`}
                                </span>
                                <span className={styles.npcCampName}>{camp.name}</span>
                                {camp.isDestroyed && camp.respawnAt && (
                                    <div className={styles.respawnInfo}>
                                        <span className={styles.respawnLabel}>Respawn en:</span>
                                        <RespawnTimer targetDate={camp.respawnAt} />
                                    </div>
                                )}
                            </div>
                            <img
                                src={camp.image}
                                className={styles.npcCampImg}
                                alt={camp.name}
                            />
                            {camp.isDestroyed && camp.respawnAt && (
                                <div className={styles.compactRespawn}>
                                    <RespawnTimer targetDate={camp.respawnAt} />
                                </div>
                            )}
                            {!camp.isDestroyed && (
                                <div className={styles.tierBadge}>{toRoman(camp.tier)}</div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className={styles.mapControls}>
                <div className={styles.coordHud}>
                    <span>{Math.floor(Math.abs(visibleOffset.x))}</span>
                    <span className={styles.coordSeparator}>|</span>
                    <span>{Math.floor(Math.abs(visibleOffset.y))}</span>
                </div>

                <button className={styles.centerBtn} onClick={() => {
                    if (playerCityCoords) {
                        const col = getCell(playerCityCoords.x);
                        const row = getCell(playerCityCoords.y);
                        const cellSize = 100 / GRID_COUNT;
                        const seed = row * GRID_COUNT + col;
                        const jitterX = (seededRandom(seed * 1.5) - 0.5) * ((80 / MAP_SIZE) * 100) * 2;
                        const jitterY = (seededRandom(seed * 2.5) - 0.5) * ((80 / MAP_SIZE) * 100) * 2;
                        const tX = (((col * cellSize) + (cellSize / 2) + jitterX) / 100) * MAP_SIZE;
                        const tY = (((row * cellSize) + (cellSize / 2) + jitterY) / 100) * MAP_SIZE;
                        const nX = Math.min(0, Math.max(-(MAP_SIZE - window.innerWidth), (window.innerWidth / 2) - tX));
                        const nY = Math.min(0, Math.max(-(MAP_SIZE - window.innerHeight), (window.innerHeight / 2) - tY));
                        offsetRef.current = { x: nX, y: nY };
                        setVisibleOffset({ x: nX, y: nY });
                        updateMapTransform();
                    }
                }} title="Centrar en mi ciudad">🏠</button>
            </div>
            {selectedCity && (
                <RadialMenu
                    position={selectedCity.pos}
                    onClose={() => setSelectedCity(null)}
                    options={[
                        {
                            label: 'Atacar', icon: '⚔️', action: () => {
                                setShowAttackPanel({ id: selectedCity.city.id, name: selectedCity.city.name });
                            }
                        },
                        {
                            label: 'Perfil', icon: '👤', action: () => {
                                if (onViewProfile) onViewProfile(selectedCity.city.player.userId);
                            }
                        },
                        { label: 'Espiar', icon: '🕵️', action: () => { } },
                        { label: 'Comerciar', icon: '⚖️', action: () => { } },
                    ]}
                />
            )}

            {showAttackPanel && (
                <AttackPanel
                    targetCity={showAttackPanel}
                    attackerPlayerId={currentPlayerId || ''}
                    availableUnits={availableUnits}
                    onClose={() => setShowAttackPanel(null)}
                    onAttackStarted={(data) => {
                        addToast(`¡Ataque enviado! Llegada en ${data.travelTimeSeconds}s`, 'success');
                    }}
                />
            )}

            {/* Panel de Raid NPC */}
            {selectedCamp && !raidResult && (
                <RaidPanel
                    camp={selectedCamp}
                    availableUnits={availableUnits}
                    onClose={() => setSelectedCamp(null)}
                    onRaidComplete={(result) => {
                        // Las tropas están en camino, el combate se resuelve cuando llegan
                        if (result.message) {
                            addToast(result.message, 'success');
                        }
                        setSelectedCamp(null);
                        // NO marcamos como destruido aquí - se resuelve en el tick del servidor
                    }}
                />
            )}

            {/* Modal de Resultado de Raid - solo se muestra si hay resultado real */}
            {raidResult && raidResult.result.victory !== undefined && (
                <RaidResultModal
                    result={raidResult.result}
                    campName={raidResult.campName}
                    onClose={() => setRaidResult(null)}
                />
            )}
        </div>
    );
}
