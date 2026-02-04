import { CHANGELOG } from '@/lib/app-config';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { ChangelogViewer } from '@/components/changelog/ChangelogViewer';
import Link from 'next/link';
import styles from '@/app/page.module.css';

export default function ChangelogPage() {
    return (
        <main className={styles.main}>
            <LandingHeader />

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <Link href="/" className="mb-8 inline-flex items-center text-primary hover:underline font-bold">
                    ← Volver al Inicio
                </Link>

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Bitácora de Cambios</h1>
                    <p className="text-secondary text-lg">Historial de decretos y mejoras del reino</p>
                </div>

                <ChangelogViewer changelog={CHANGELOG} />

                <div className="mt-12 text-center text-muted">
                    <p className="italic">"Así queda escrito en los anales de Etheria."</p>
                </div>
            </div>
        </main>
    );
}
