import Link from 'next/link';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { QuickRegisterForm } from '@/components/landing/QuickRegisterForm';
import { ChangelogSummary } from '@/components/landing/ChangelogSummary';
import { RaceCard } from '@/components/landing/RaceCard';
import styles from './page.module.css';

import { getRaceData } from '@/lib/lore';

export default function Home() {
  const races = ['humans', 'elves', 'orcs', 'dwarves'];
  const raceData = races.map(raceId => {
    const data = getRaceData(raceId);
    return data ? {
      id: raceId,
      name: raceId.charAt(0).toUpperCase() + raceId.slice(1),
      title: data.title,
      quote: data.quote
    } : {
      id: raceId,
      name: raceId,
      title: 'Unknown',
      quote: ''
    };
  });

  return (
    <main className={styles.main}>
      <LandingHeader />

      {/* Hero Section: The Battlefield */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <img
            src="/assets/landing/hero-medieval-oil.png" // Using the new oil painting background
            alt="Campo de Batalla Etheria"
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay} />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroHeader}>
            <h1 className={styles.heroTitle}>ETHERIA</h1>
            <p className={styles.heroSubtitle}>Crónicas de la Caída</p>
          </div>

          <div className={styles.heroCTA}>
            <Link href="/game" className={styles.ctaButton}>
              Entrar al Reino
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section: The Scrolls */}
      <section className={styles.features}>
        <div className={styles.featureGrid} style={{ display: 'flex', justifyContent: 'center', width: '100%', maxWidth: '100%' }}>
          <div className={styles.feature} style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
            <div className={styles.featureIcon}>📜</div>
            <h3 className={styles.featureTitle}>Decretos Reales</h3>
            <p className={styles.featureDesc}>
              Mantente informado con los últimos mandatos y cambios en el reino.
            </p>
            <div style={{ marginTop: '1rem', width: '100%' }}>
              <ChangelogSummary />
            </div>
          </div>
        </div>
      </section>

      {/* Motivational Section: The Prophecy */}
      <section className={styles.motivational}>
        <div className={styles.motivationalText}>
          "En las cenizas de los antiguos reinos, solo los más fuertes forjarán su destino con acero y sangre."
        </div>
      </section>

      {/* Races Section: The Lineages */}
      <section className={styles.races}>
        <h2 className={styles.sectionTitle}>Elige tu Linaje</h2>
        <div className={styles.raceGrid}>
          {raceData.map(raceRedux => {
            const imageMap: Record<string, string> = {
              'humans': 'Human.png',
              'elves': 'Elf.png',
              'orcs': 'Orc.png',
              'dwarves': 'Dwarf.png'
            };
            const imageAltMap: Record<string, string> = { // Added alt map for translations
              'humans': 'Humanos',
              'elves': 'Elfos',
              'orcs': 'Orcos',
              'dwarves': 'Enanos'
            }
            const imageName = imageMap[raceRedux.id];

            return (
              <RaceCard
                key={raceRedux.id}
                id={raceRedux.id}
                name={raceRedux.name} // Note: The name is coming from internal logic, might need translation in raceData map if not already done. But user asked for landing page translation.
                title={raceRedux.title}
                quote={raceRedux.quote}
                imageName={imageName}
              />
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>ETHERIA</p>
          <p>© 2026 Strategy Loot System. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
