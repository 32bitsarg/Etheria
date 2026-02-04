'use client';

import { useState } from 'react';
import { Raza, RAZAS } from '@lootsystem/game-engine';
import styles from './RaceSelection.module.css';

interface RaceSelectionProps {
    onSelect: (race: Raza, cityName: string) => void;
}

const RACE_IMAGES: Record<Raza, string> = {
    [Raza.ELFO]: '/assets/races/Elf.png',
    [Raza.HUMANO]: '/assets/races/Human.png',
    [Raza.ORCO]: '/assets/races/Orc.png',
    [Raza.ENANO]: '/assets/races/Dwarf.png',
};

export function RaceSelection({ onSelect }: RaceSelectionProps) {
    const [selectedRace, setSelectedRace] = useState<Raza | null>(null);
    const [cityName, setCityName] = useState('');
    const [step, setStep] = useState<'race' | 'city'>('race');

    const races = Object.values(RAZAS);

    const handleContinue = () => {
        if (selectedRace) {
            setStep('city');
        }
    };

    const handleStart = () => {
        if (selectedRace && cityName.trim()) {
            onSelect(selectedRace, cityName.trim());
        }
    };

    const selectedRaceData = selectedRace ? RAZAS[selectedRace] : null;

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {step === 'race' ? (
                    <>
                        <div className={styles.header}>
                            <h1 className={styles.title}>Elige tu Raza</h1>
                            <p className={styles.subtitle}>
                                Cada raza tiene bonuses únicos de producción que afectarán tu estrategia
                            </p>
                        </div>

                        <div className={styles.grid}>
                            {races.map((race) => (
                                <div
                                    key={race.id}
                                    className={`${styles.card} ${selectedRace === race.id ? styles.selected : ''}`}
                                    onClick={() => setSelectedRace(race.id)}
                                >
                                    <div className={styles.cardImage}>
                                        <img
                                            src={RACE_IMAGES[race.id]}
                                            alt={race.nombre}
                                            className={styles.raceImg}
                                            loading="lazy"
                                        />
                                    </div>

                                    <div className={styles.cardContent}>
                                        <div className={styles.cardHeader}>
                                            <h3 className={styles.raceName}>{race.nombre}</h3>
                                        </div>

                                        <p className={styles.description}>{race.descripcion}</p>

                                        <div className={styles.bonuses}>
                                            <div className={styles.bonusTitle}>Bonuses de Producción</div>
                                            <div className={styles.bonusList}>
                                                {race.productionBonus.wood !== 0 && (
                                                    <span className={race.productionBonus.wood > 0 ? styles.positive : styles.negative}>
                                                        🪵 {race.productionBonus.wood > 0 ? '+' : ''}{race.productionBonus.wood}%
                                                    </span>
                                                )}
                                                {race.productionBonus.iron !== 0 && (
                                                    <span className={race.productionBonus.iron > 0 ? styles.positive : styles.negative}>
                                                        ⛏️ {race.productionBonus.iron > 0 ? '+' : ''}{race.productionBonus.iron}%
                                                    </span>
                                                )}
                                                {race.productionBonus.gold !== 0 && (
                                                    <span className={race.productionBonus.gold > 0 ? styles.positive : styles.negative}>
                                                        🪙 {race.productionBonus.gold > 0 ? '+' : ''}{race.productionBonus.gold}%
                                                    </span>
                                                )}
                                                {race.productionBonus.population !== 0 && (
                                                    <span className={race.productionBonus.population > 0 ? styles.positive : styles.negative}>
                                                        👥 {race.productionBonus.population > 0 ? '+' : ''}{race.productionBonus.population}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {selectedRace === race.id && (
                                        <div className={styles.selectedBadge}>✓</div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className={styles.actions}>
                            <button
                                className={`btn btn-primary btn-lg ${styles.continueBtn}`}
                                onClick={handleContinue}
                                disabled={!selectedRace}
                            >
                                Continuar →
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles.header}>
                            <h1 className={styles.title}>Nombra tu Ciudad</h1>
                            <p className={styles.subtitle}>
                                Como {selectedRaceData?.nombre}, tu ciudad será el centro de tu imperio
                            </p>
                        </div>

                        <div className={styles.cityForm}>
                            <div className={styles.selectedRacePreview}>
                                <span className={styles.previewName}>{selectedRaceData?.nombre}</span>
                            </div>

                            <input
                                type="text"
                                className={`input ${styles.cityInput}`}
                                placeholder="Nombre de tu ciudad..."
                                value={cityName}
                                onChange={(e) => setCityName(e.target.value)}
                                maxLength={24}
                                autoFocus
                            />

                            <div className={styles.cityActions}>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setStep('race')}
                                >
                                    ← Volver
                                </button>
                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={handleStart}
                                    disabled={!cityName.trim()}
                                >
                                    🏰 Comenzar el Juego
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
