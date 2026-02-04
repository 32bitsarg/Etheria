'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    PlayerState,
    BuildingType,
    Raza,
    AllianceMember
} from '@lootsystem/game-engine';
import { useToast } from '@/components/ui/ToastContext';

interface AuthState {
    isLoggedIn: boolean;
    needsRaceSelection: boolean;
    player: PlayerState | null;
    userId: string | null;
    loading: boolean;
    error: string | null;
}

interface AuthContextType extends AuthState {
    login: (username: string, password?: string, rememberMe?: boolean) => Promise<void>;
    register: (username: string, password?: string, email?: string) => Promise<void>;
    logout: () => void;
    selectRace: (race: Raza, cityName: string) => Promise<void>;
    updatePlayer: (player: PlayerState) => void;
    syncWithServer: () => Promise<void>;
    upgradeBuilding: (buildingType: BuildingType) => Promise<boolean>;
    instantCompleteBuilding: (queueItemId: string) => Promise<boolean>;
    cancelBuildingUpgrade: (queueItemId: string) => Promise<boolean>;
    trainUnits: (unitType: string, count: number) => Promise<boolean>;
    cancelTraining: (queueItemId: string) => Promise<boolean>;
    finishTraining: (queueItemId: string) => Promise<boolean>;
}


const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({
        isLoggedIn: false,
        needsRaceSelection: false,
        player: null,
        userId: null,
        loading: true,
        error: null,
    });

    const STORAGE_KEY_ID = 'lootsystem_userid';
    const STORAGE_KEY_USER = 'lootsystem_username';

    // Helper para guardar sesión
    const saveSession = (userId: string, username: string, remember: boolean) => {
        if (typeof window === 'undefined') return;
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem(STORAGE_KEY_ID, userId);
        storage.setItem(STORAGE_KEY_USER, username);
        // Limpiar el otro storage por si acaso
        (remember ? sessionStorage : localStorage).removeItem(STORAGE_KEY_ID);
        (remember ? sessionStorage : localStorage).removeItem(STORAGE_KEY_USER);
    };

    const clearSession = () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(STORAGE_KEY_ID);
        localStorage.removeItem(STORAGE_KEY_USER);
        sessionStorage.removeItem(STORAGE_KEY_ID);
        sessionStorage.removeItem(STORAGE_KEY_USER);
    };

    // Helper para mapear respuesta API a PlayerState
    const mapApiToState = (apiData: any): PlayerState => {
        const { player, user } = apiData;
        const p = player || apiData; // A veces viene directo, a veces dentro de un objeto

        if (!p || !p.city) return null as any;

        return {
            id: p.id,
            username: user?.username || p.user?.username || 'Player',
            race: p.race as Raza,
            city: {
                id: p.city.id,
                name: p.city.name,
                buildings: p.city.buildings.map((b: any) => ({
                    id: b.id,
                    type: b.type as BuildingType,
                    level: b.level,
                    productionRate: 0,
                    upgradeCost: null,
                    upgradeTime: 0
                })),
                constructionQueue: (p.city.constructionQueue || []).map((q: any) => ({
                    id: q.id,
                    buildingType: q.buildingType,
                    targetLevel: q.targetLevel,
                    startTime: new Date(q.startTime).getTime(),
                    endTime: new Date(q.endTime).getTime()
                })),
                trainingQueue: (p.city.trainingQueue || []).map((q: any) => ({
                    id: q.id,
                    unitType: q.unitType,
                    count: q.count,
                    startTime: new Date(q.startTime).getTime(),
                    endTime: new Date(q.endTime).getTime()
                })),
                units: ((p.city as any).units || []).map((u: any) => ({
                    id: u.id,
                    type: u.type,
                    count: u.count
                }))
            } as any,
            resources: {
                wood: p.wood,
                iron: p.iron,
                gold: p.gold,
                populationUsed: p.populationUsed,
                populationMax: p.populationMax
            },
            lastTick: new Date(p.lastResourceUpdate).getTime(),
            createdAt: new Date(p.createdAt).getTime(),
            alliance: p.allianceMember || null
        };
    };

    // Función para sincronizar con el servidor (Tick)
    const syncWithServer = async () => {
        if (!state.userId) return;

        try {
            const res = await fetch('/api/player/tick', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId: state.player?.id })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success && data.player) {
                    const updatedPlayer = mapApiToState(data);
                    if (!updatedPlayer.username && state.player?.username) {
                        updatedPlayer.username = state.player.username;
                    }
                    setState(prev => ({ ...prev, player: updatedPlayer }));
                }
            }
        } catch (error) {
            console.error('Error syncing:', error);
        }
    };

    const { addToast } = useToast();

    // ... existing saveSession, clearSession, mapApiToState ...

    // (Kept helpers as is, assuming mapApiToState is above)
    // Moving directly to functions using addToast

    // Init Auth on Load
    useEffect(() => {
        const initAuth = async () => {
            const userId = localStorage.getItem(STORAGE_KEY_ID) || sessionStorage.getItem(STORAGE_KEY_ID);

            if (!userId) {
                setState(prev => ({ ...prev, loading: false }));
                return;
            }

            try {
                // Restore session from User ID
                const res = await fetch('/api/auth/session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId })
                });

                if (res.ok) {
                    const data = await res.json();

                    if (data.needsRaceSelection) {
                        setState({
                            isLoggedIn: true,
                            needsRaceSelection: true,
                            player: null,
                            userId: userId,
                            loading: false,
                            error: null
                        });
                    } else if (data.player) {
                        const playerState = mapApiToState(data);
                        setState({
                            isLoggedIn: true,
                            needsRaceSelection: false,
                            player: playerState,
                            userId: userId,
                            loading: false,
                            error: null
                        });
                    } else {
                        throw new Error('Invalid session data');
                    }
                } else {
                    throw new Error('Session invalid');
                }
            } catch (error) {
                console.error('Session restore failed', error);
                clearSession();
                setState(prev => ({ ...prev, loading: false, isLoggedIn: false }));
            }
        };

        initAuth();
    }, []);

    // Periodic Sync
    useEffect(() => {
        if (!state.isLoggedIn || !state.player || typeof window === 'undefined') return;

        // Sync every 10 seconds to keep resources fresh, but rely on optimistic updates for UI
        const interval = setInterval(syncWithServer, 10000);
        return () => clearInterval(interval);
    }, [state.isLoggedIn, state.player?.id]);

    const login = async (username: string, password?: string, rememberMe: boolean = false) => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');

            const userId = data.user.id;
            saveSession(userId, username, rememberMe);

            if (data.needsRaceSelection) {
                setState({
                    isLoggedIn: true,
                    needsRaceSelection: true,
                    player: null,
                    userId: userId,
                    loading: false,
                    error: null
                });
                addToast(`Bienvenido ${username}. Por favor selecciona tu raza.`, 'info');
            } else {
                const playerState = mapApiToState(data);
                setState({
                    isLoggedIn: true,
                    needsRaceSelection: false,
                    player: playerState,
                    userId: userId,
                    loading: false,
                    error: null
                });
                addToast(`Bienvenido de nuevo, ${username}!`, 'success');
            }
        } catch (error: any) {
            setState(prev => ({ ...prev, loading: false, error: error.message }));
            addToast(error.message, 'error');
        }
    };

    const register = async (username: string, password?: string, email?: string) => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, email })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Register failed');

            const userId = data.user.id;
            saveSession(userId, username, false);

            setState({
                isLoggedIn: true,
                needsRaceSelection: true,
                player: null,
                userId: userId,
                loading: false,
                error: null
            });
            addToast('Registro exitoso. Selecciona tu raza.', 'success');
        } catch (error: any) {
            setState(prev => ({ ...prev, loading: false, error: error.message }));
            addToast(error.message, 'error');
        }
    };

    const selectRace = async (race: Raza, cityName: string) => {
        if (!state.userId) return;
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const res = await fetch('/api/player/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: state.userId, race, cityName })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Race selection failed');

            const storedUsername = localStorage.getItem(STORAGE_KEY_USER) || sessionStorage.getItem(STORAGE_KEY_USER) || 'Player';
            const playerData = { ...data.player, user: { username: storedUsername } };
            const playerState = mapApiToState(playerData);

            setState({
                isLoggedIn: true,
                needsRaceSelection: false,
                player: playerState,
                userId: state.userId,
                loading: false,
                error: null
            });
            addToast('Imperio creado con éxito!', 'success');
        } catch (error: any) {
            setState(prev => ({ ...prev, loading: false, error: error.message }));
            addToast(error.message, 'error');
        }
    };

    const logout = () => {
        clearSession();
        setState({
            isLoggedIn: false,
            needsRaceSelection: false,
            player: null,
            userId: null,
            loading: false,
            error: null
        });
        addToast('Sesión cerrada correctamente', 'info');
    };

    const updatePlayer = (player: PlayerState) => {
        setState(prev => ({ ...prev, player }));
    };

    const upgradeBuilding = async (buildingType: BuildingType): Promise<boolean> => {
        if (!state.player?.id) return false;
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const res = await fetch('/api/buildings/upgrade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId: state.player.id, buildingType })
            });

            const data = await res.json();
            if (!res.ok) {
                // If specific resource error, show it
                throw new Error(data.error || 'Upgrade failed');
            }

            const username = state.player?.username || 'Player';
            const playerData = { ...data.player, user: { username } };
            const playerState = mapApiToState(playerData);

            setState(prev => ({ ...prev, player: playerState, loading: false, error: null }));
            addToast('Mejora de edificio iniciada', 'success');
            return true;
        } catch (error: any) {
            console.error('Upgrade error:', error);
            setState(prev => ({ ...prev, loading: false, error: error.message }));
            addToast(error.message, 'error');
            return false;
        }
    };

    const instantCompleteBuilding = async (queueItemId: string): Promise<boolean> => {
        if (!state.player?.id) return false;
        try {
            const res = await fetch('/api/buildings/instant-complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId: state.player.id, queueItemId })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Instant complete failed');

            const username = state.player?.username || 'Player';
            const playerData = { ...data.player, user: { username } };
            const playerState = mapApiToState(playerData);

            setState(prev => ({ ...prev, player: playerState }));
            addToast('Construcción completada instantáneamente!', 'success');
            return true;
        } catch (error: any) {
            console.error('Instant complete error:', error);
            addToast(error.message, 'error');
            return false;
        }
    };

    const cancelBuildingUpgrade = async (queueItemId: string): Promise<boolean> => {
        if (!state.player?.id) return false;
        try {
            const res = await fetch('/api/buildings/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId: state.player.id, queueItemId })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Cancel failed');

            const username = state.player?.username || 'Player';
            const playerData = { ...data.player, user: { username } };
            const playerState = mapApiToState(playerData);

            setState(prev => ({ ...prev, player: playerState }));
            addToast('Construcción cancelada', 'info');
            return true;
        } catch (error: any) {
            console.error('Cancel error:', error);
            addToast(error.message, 'error');
            return false;
        }
    };

    const trainUnits = async (unitType: string, count: number): Promise<boolean> => {
        if (!state.player?.id) return false;
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const res = await fetch('/api/military/train', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId: state.player.id, unitType, count })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Training failed');

            const username = state.player?.username || 'Player';
            const playerData = { ...data.player, user: { username } };
            const playerState = mapApiToState(playerData);

            setState(prev => ({ ...prev, player: playerState, loading: false, error: null }));
            addToast(`Entrenamiento de ${count} ${unitType} iniciado`, 'success');
            return true;
        } catch (error: any) {
            console.error('Training error:', error);
            setState(prev => ({ ...prev, loading: false, error: error.message }));
            addToast(error.message, 'error');
            return false;
        }
    };

    const cancelTraining = async (queueItemId: string): Promise<boolean> => {
        if (!state.player?.id) return false;
        try {
            const res = await fetch('/api/military/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId: state.player.id, queueItemId })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Cancel training failed');

            const username = state.player?.username || 'Player';
            const playerData = { ...data.player, user: { username } };
            const playerState = mapApiToState(playerData);

            setState(prev => ({ ...prev, player: playerState }));
            addToast('Entrenamiento cancelado', 'info');
            return true;
        } catch (error: any) {
            console.error('Cancel training error:', error);
            addToast(error.message, 'error');
            return false;
        }
    };

    const finishTraining = async (queueItemId: string): Promise<boolean> => {
        if (!state.player?.id) return false;
        try {
            const res = await fetch('/api/military/finish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId: state.player.id, queueId: queueItemId })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Finish training failed');
            }

            await syncWithServer();
            addToast('Entrenamiento finalizado ahora!', 'success');
            return true;
        } catch (error: any) {
            console.error('Finish training error:', error);
            addToast(error.message, 'error');
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{
            ...state,
            login,
            register,
            logout,
            selectRace,
            updatePlayer,
            syncWithServer,
            upgradeBuilding,
            instantCompleteBuilding,
            cancelBuildingUpgrade,
            trainUnits,
            cancelTraining,
            finishTraining
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
