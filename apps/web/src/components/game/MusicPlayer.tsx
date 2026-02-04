'use client';

import { useEffect, useRef, useState } from 'react';

interface MusicPlayerProps {
    src: string;
    volume: number;
    autoPlay?: boolean;
}

export function MusicPlayer({ src, volume, autoPlay = true }: MusicPlayerProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Initialize audio
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio(src);
            audioRef.current.loop = true;
        }

        audioRef.current.volume = Math.max(0, Math.min(1, volume));

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [src]);

    // Update volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = Math.max(0, Math.min(1, volume));
        }
    }, [volume]);

    // AutoPlay logic
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !autoPlay || isPlaying) return;

        // Try to play immediately
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => setIsPlaying(true))
                .catch(error => {
                    console.log("Auto-play prevented. Waiting for interaction.");

                    const playOnInteraction = () => {
                        if (audioRef.current) {
                            audioRef.current.play()
                                .then(() => setIsPlaying(true))
                                .catch(console.error);
                        }
                        cleanupInteractionListeners();
                    };

                    const cleanupInteractionListeners = () => {
                        document.removeEventListener('click', playOnInteraction);
                        document.removeEventListener('keydown', playOnInteraction);
                    };

                    document.addEventListener('click', playOnInteraction);
                    document.addEventListener('keydown', playOnInteraction);

                    return () => cleanupInteractionListeners();
                });
        }
    }, [autoPlay, isPlaying]);

    // Visibility handling - Robust pause/resume
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!audioRef.current) return;

            if (document.hidden) {
                console.log("Tab hidden - Pausing music");
                audioRef.current.pause();
                // We DON'T update isPlaying to false here to remember 
                // that we were playing (or trying to) when we come back.
            } else {
                console.log("Tab visible - Resuming if autoPlay");
                if (autoPlay) {
                    audioRef.current.play()
                        .then(() => setIsPlaying(true))
                        .catch(e => console.error("Resume failed", e));
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [autoPlay]);

    return null;
}

// Hook for music control
export function useMusicVolume() {
    const [volume, setVolume] = useState(0.3); // Default 30%

    useEffect(() => {
        // Load from localStorage
        const saved = localStorage.getItem('musicVolume');
        if (saved !== null) {
            setVolume(parseFloat(saved));
        }
    }, []);

    const updateVolume = (newVolume: number) => {
        const clamped = Math.max(0, Math.min(1, newVolume));
        setVolume(clamped);
        localStorage.setItem('musicVolume', clamped.toString());
    };

    return { volume, setVolume: updateVolume };
}
