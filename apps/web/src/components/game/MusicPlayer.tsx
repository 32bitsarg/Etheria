'use client';

import { useEffect, useRef, useState } from 'react';
import { useVolume } from '@/hooks/useVolume';

interface MusicPlayerProps {
    src: string;
    autoPlay?: boolean;
}

export function MusicPlayer({ src, autoPlay = true }: MusicPlayerProps) {
    const { musicVolume } = useVolume();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Initialize audio
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio(src);
            audioRef.current.loop = true;
        }

        audioRef.current.volume = musicVolume;

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
            audioRef.current.volume = musicVolume;
        }
    }, [musicVolume]);

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
                audioRef.current.pause();
            } else {
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
