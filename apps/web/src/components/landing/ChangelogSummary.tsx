import { getLatestChangelog } from '@/lib/app-config';
import Link from 'next/link';
import styles from './ChangelogSummary.module.css';

export function ChangelogSummary() {
    const latest = getLatestChangelog();

    if (!latest) return null;

    // Take top 3 changes
    const topChanges = latest.changes.slice(0, 3);

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <span className={styles.versionBadge}>
                    v{latest.version}
                </span>
            </div>

            <div className={styles.list}>
                {topChanges.map((change, idx) => (
                    <div key={idx} className={styles.item}>
                        <span className={styles.icon}>
                            {change.category === 'feature' ? '✨' : change.category === 'balance' ? '⚖️' : '🔧'}
                        </span>
                        <p className={styles.description}>{change.description}</p>
                    </div>
                ))}
            </div>

            <div className={styles.footer}>
                <Link href="/changelog" className={styles.link}>
                    Ver Bitácora Completa →
                </Link>
            </div>
        </div>
    );
}

