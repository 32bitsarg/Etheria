'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { RaceSelection } from '@/components/RaceSelection';
import { GameDashboard } from '@/components/GameDashboard';
import { Raza } from '@lootsystem/game-engine';

export default function GamePage() {
    const router = useRouter();
    const { isLoggedIn, needsRaceSelection, player, selectRace } = useAuth();

    // Redirigir si no está logueado
    useEffect(() => {
        if (!isLoggedIn && !needsRaceSelection) {
            router.push('/login');
        }
    }, [isLoggedIn, needsRaceSelection, router]);

    // Mostrar selección de raza si es nuevo usuario
    if (needsRaceSelection) {
        return (
            <RaceSelection
                onSelect={(race: Raza, cityName: string) => {
                    selectRace(race, cityName);
                }}
            />
        );
    }

    // Mostrar dashboard si está logueado y tiene jugador
    if (isLoggedIn && player) {
        return <GameDashboard />;
    }

    // Loading state
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-secondary)'
        }}>
            <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '3rem' }}>🏰</span>
                <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                    Cargando...
                </p>
            </div>
        </div>
    );
}
