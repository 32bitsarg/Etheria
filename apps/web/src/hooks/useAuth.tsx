'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
    PlayerState,
    BuildingType,
    Raza,
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

    const { addToast } = useToast();

    const mapApiToState = (apiData: any): PlayerState => {
        const { player, user } = apiData;
        const p = player || apiData;
        if (!p || !p.city) return null as any;

        return {
            id: p.id,
            username: user?.username || p.user?.username || 'Player',
            race: p.race as Raza,
            city: {
                id: p.city.id,
                name: p.city.name,
                x: p.city.x,
                y: p.city.y,
                buildings: p.city.buildings.map((b: any) => ({
                    id: b.id,
                    type: b.type as BuildingType,
                    level: b.level,
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
                })),
                originMovements: p.city.originMovements || [],
                targetMovements: p.city.targetMovements || []
            } as any,
            resources: {
                wood: p.wood,
                iron: p.iron,
                gold: p.gold,
                doblones: p.doblones,
                etherFragments: p.etherFragments,
                populationUsed: p.populationUsed,
                populationMax: p.populationMax
            },
            level: p.level || 1,
            experience: p.experience || 0,
            militaryPower: p.militaryPower || 0,
            lastTick: new Date(p.lastResourceUpdate).getTime(),
            createdAt: new Date(p.createdAt).getTime(),
            alliance: p.allianceMember || null
        } as any;
    };

    const updatePlayer = useCallback((player: PlayerState) => {
        setState(prev => ({ ...prev, player }));
    }, []);

    const syncWithServer = useCallback(async () => {
        if (!state.isLoggedIn) return;
        try {
            const res = await fetch('/api/v1/player/tick', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success && data.player) {
                    const updatedPlayer = mapApiToState(data);
                    setState(prev => ({ ...prev, player: updatedPlayer }));
                }
            } else if (res.status === 401) {
                setState(prev => ({ ...prev, isLoggedIn: false }));
            }
        } catch (error) {
            console.error('Error syncing:', error);
        }
    }, [state.isLoggedIn]);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await fetch('/api/v1/auth/session', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.needsRaceSelection) {
                        setState({ isLoggedIn: true, needsRaceSelection: true, player: null, userId: data.user.id, loading: false, error: null });
                    } else if (data.player) {
                        setState({ isLoggedIn: true, needsRaceSelection: false, player: mapApiToState(data), userId: data.user.id, loading: false, error: null });
                    }
                } else {
                    setState(prev => ({ ...prev, loading: false, isLoggedIn: false }));
                }
            } catch (error) {
                setState(prev => ({ ...prev, loading: false, isLoggedIn: false }));
            }
        };
        initAuth();
    }, []);

    useEffect(() => {
        if (!state.isLoggedIn || !state.player || typeof window === 'undefined') return;
        const interval = setInterval(syncWithServer, 10000);
        return () => clearInterval(interval);
    }, [state.isLoggedIn, state.player?.id, syncWithServer]);

    const login = async (username: string, password?: string, rememberMe: boolean = false) => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const res = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');

            if (data.needsRaceSelection) {
                setState({ isLoggedIn: true, needsRaceSelection: true, player: null, userId: data.user.id, loading: false, error: null });
            } else {
                setState({ isLoggedIn: true, needsRaceSelection: false, player: mapApiToState(data), userId: data.user.id, loading: false, error: null });
            }
            addToast(`Bienvenido ${username}`, 'success');
        } catch (error: any) {
            setState(prev => ({ ...prev, loading: false, error: error.message }));
            addToast(error.message, 'error');
        }
    };

    const register = async (username: string, password?: string, email?: string) => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const res = await fetch('/api/v1/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, email })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Register failed');

            setState({ isLoggedIn: true, needsRaceSelection: true, player: null, userId: data.user.id, loading: false, error: null });
            addToast('Registro exitoso', 'success');
        } catch (error: any) {
            setState(prev => ({ ...prev, loading: false, error: error.message }));
            addToast(error.message, 'error');
        }
    };

    const selectRace = async (race: Raza, cityName: string) => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const res = await fetch('/api/v1/player/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ race, cityName })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Race selection failed');

            setState(prev => ({ ...prev, needsRaceSelection: false, player: mapApiToState(data), loading: false, error: null }));
            addToast('Imperio creado!', 'success');
        } catch (error: any) {
            setState(prev => ({ ...prev, loading: false, error: error.message }));
            addToast(error.message, 'error');
        }
    };

    const logout = async () => {
        await fetch('/api/v1/auth/logout', { method: 'POST' });
        setState({ isLoggedIn: false, needsRaceSelection: false, player: null, userId: null, loading: false, error: null });
    };

    const upgradeBuilding = async (buildingType: BuildingType): Promise<boolean> => {
        try {
            const res = await fetch('/api/v1/buildings/upgrade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ buildingType })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Upgrade failed');
            setState(prev => ({ ...prev, player: mapApiToState(data) }));
            addToast('Mejora iniciada', 'success');
            return true;
        } catch (error: any) {
            addToast(error.message, 'error');
            return false;
        }
    };

    const instantCompleteBuilding = async (queueItemId: string): Promise<boolean> => {
        try {
            const res = await fetch('/api/v1/buildings/instant-complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ queueItemId })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Instant complete failed');
            setState(prev => ({ ...prev, player: mapApiToState(data) }));
            addToast('Construcción completada!', 'success');
            return true;
        } catch (error: any) {
            addToast(error.message, 'error');
            return false;
        }
    };

    const cancelBuildingUpgrade = async (queueItemId: string): Promise<boolean> => {
        try {
            const res = await fetch('/api/v1/buildings/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ queueItemId })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Cancel failed');
            setState(prev => ({ ...prev, player: mapApiToState(data) }));
            addToast('Construcción cancelada', 'info');
            return true;
        } catch (error: any) {
            addToast(error.message, 'error');
            return false;
        }
    };

    const trainUnits = async (unitType: string, count: number): Promise<boolean> => {
        try {
            const res = await fetch('/api/v1/military/train', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ unitType, count })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Training failed');
            setState(prev => ({ ...prev, player: mapApiToState(data) }));
            addToast(`Entrenamiento de ${count} unidades iniciado`, 'success');
            return true;
        } catch (error: any) {
            addToast(error.message, 'error');
            return false;
        }
    };

    const cancelTraining = async (queueItemId: string): Promise<boolean> => {
        try {
            const res = await fetch('/api/v1/military/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ queueItemId })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Cancel training failed');
            setState(prev => ({ ...prev, player: mapApiToState(data) }));
            addToast('Entrenamiento cancelado', 'info');
            return true;
        } catch (error: any) {
            addToast(error.message, 'error');
            return false;
        }
    };

    const finishTraining = async (queueItemId: string): Promise<boolean> => {
        try {
            const res = await fetch('/api/v1/military/finish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ queueId: queueItemId })
            });
            if (!res.ok) throw new Error('Finish training failed');
            await syncWithServer();
            addToast('Entrenamiento finalizado!', 'success');
            return true;
        } catch (error: any) {
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
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
