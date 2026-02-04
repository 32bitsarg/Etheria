'use client';

import Link from 'next/link';
import styles from '@/app/page.module.css';

interface RaceCardProps {
    id: string;
    name: string;
    title: string;
    quote: string;
    imageName: string;
}

export function RaceCard({ id, name, title, quote, imageName }: RaceCardProps) {
    return (
        <div className={styles.raceCard}>
            <div className={styles.raceImageContainer}>
                <img
                    src={`/assets/races/${imageName}`}
                    alt={name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                        // Fallback if image fails
                        e.currentTarget.style.display = 'none';
                        // We can't easily access parentElement in a clean React way for text injection without refs, 
                        // but for a simple fallback we can toggle a state. 
                        // However, to keep it simple and match the previous logic:
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                            parent.innerText = id === 'humans' ? '🏰' : id === 'elves' ? '🧝' : id === 'orcs' ? '👹' : '⚒️';
                        }
                    }}
                />
            </div>
            <div className={styles.raceContent}>
                <h3 className={styles.raceTitle}>{title}</h3>
                <p className={styles.raceLore}>
                    {quote}
                </p>
                <Link href={`/wiki/races/${id}`} className="mt-auto self-center px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white text-sm font-bold transition-all hover:scale-105">
                    Descubrir Linaje
                </Link>
            </div>
        </div>
    );
}
