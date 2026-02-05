'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { RaceSelection } from '@/components/RaceSelection';
import { GameDashboard } from '@/components/GameDashboard';
import { MobileDashboard } from '@/components/game/MobileDashboard';
import { Raza } from '@lootsystem/game-engine';

export default function GamePage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const { isLoggedIn, needsRaceSelection, player, selectRace } = useAuth();

    // Detectar tamaño de pantalla
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 900);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
        return isMobile ? <MobileDashboard /> : <GameDashboard />;
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
