'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface VolumeContextType {
    musicVolume: number;
    sfxVolume: number;
    setMusicVolume: (v: number) => void;
    setSfxVolume: (v: number) => void;
}

const VolumeContext = createContext<VolumeContextType | undefined>(undefined);

export function VolumeProvider({ children }: { children: ReactNode }) {
    const [musicVolume, setMusicVolumeState] = useState(0.3);
    const [sfxVolume, setSfxVolumeState] = useState(0.5);

    useEffect(() => {
        const savedMusic = localStorage.getItem('musicVolume');
        if (savedMusic !== null) {
            const val = parseFloat(savedMusic);
            if (!isNaN(val)) setMusicVolumeState(val);
        }

        const savedSfx = localStorage.getItem('sfxVolume');
        if (savedSfx !== null) {
            const val = parseFloat(savedSfx);
            if (!isNaN(val)) setSfxVolumeState(val);
        }
    }, []);

    const setMusicVolume = (v: number) => {
        const clamped = Math.max(0, Math.min(1, v));
        setMusicVolumeState(clamped);
        localStorage.setItem('musicVolume', clamped.toString());
    };

    const setSfxVolume = (v: number) => {
        const clamped = Math.max(0, Math.min(1, v));
        setSfxVolumeState(clamped);
        localStorage.setItem('sfxVolume', clamped.toString());
    };

    return (
        <VolumeContext.Provider value={{ musicVolume, sfxVolume, setMusicVolume, setSfxVolume }}>
            {children}
        </VolumeContext.Provider>
    );
}

export function useVolume() {
    const context = useContext(VolumeContext);
    if (!context) {
        throw new Error('useVolume must be used within a VolumeProvider');
    }
    return context;
}
