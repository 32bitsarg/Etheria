
'use client';

import { useState, useEffect } from 'react';
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

export function WorldMap() {
    const [cities, setCities] = useState<WorldCity[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewPort, setViewPort] = useState({ x: 50, y: 50, zoom: 1 });

    useEffect(() => {
        const fetchMap = async () => {
            try {
                const res = await fetch('/api/world/map');
                const data = await res.json();
                if (data.success) {
                    setCities(data.cities);
                }
            } catch (error) {
                console.error('Error fetching world map:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMap();
    }, []);

    if (loading) {
        return <div className={styles.loading}>Explorando los mares... ⚓</div>;
    }

    return (
        <div className={styles.worldWrapper}>
            <div className={styles.mapCanvas} style={{
                transform: `scale(${viewPort.zoom})`,
                backgroundImage: "url('/assets/islands/water.png')"
            }}>
                {cities.map(city => (
                    <div
                        key={city.id}
                        className={styles.cityNode}
                        style={{
                            left: `${city.x}%`,
                            top: `${city.y}%`
                        }}
                        title={`${city.name} [${city.player.allianceMember?.alliance.tag || 'S/A'}]`}
                    >
                        <img
                            src="/assets/islands/islandmedium.png"
                            className={styles.islandImg}
                            alt="City"
                        />
                        <div className={styles.cityNameLabel}>
                            {city.name}
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.controls}>
                <button onClick={() => setViewPort(v => ({ ...v, zoom: Math.min(2, v.zoom + 0.1) }))}>➕</button>
                <button onClick={() => setViewPort(v => ({ ...v, zoom: Math.max(0.5, v.zoom - 0.1) }))}>➖</button>
            </div>
        </div>
    );
}
