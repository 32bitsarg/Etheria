'use client';

import { useState } from 'react';
import { ChangelogEntry, CATEGORY_INFO, TYPE_INFO } from '@/lib/app-config';
import styles from './Changelog.module.css';

interface ChangelogViewerProps {
    changelog: ChangelogEntry[];
}

export function ChangelogViewer({ changelog }: ChangelogViewerProps) {
    const [activeVersion, setActiveVersion] = useState<string>(changelog[0]?.version);

    // Smooth scroll handler
    const scrollToVersion = (version: string) => {
        setActiveVersion(version);
        const element = document.getElementById(`version-${version}`);
        if (element) {
            // Offset for sticky header if needed, though here we just scroll nicely
            const yOffset = -20;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <div className={styles.container}>
            {/* Sidebar Navigation */}
            <aside className={styles.sidebar}>
                {changelog.map((entry) => (
                    <button
                        key={entry.version}
                        onClick={() => scrollToVersion(entry.version)}
                        className={`${styles.navItem} ${activeVersion === entry.version ? styles.navItemActive : ''}`}
                    >
                        <span className={styles.navVersion}>v{entry.version}</span>
                        <span className={styles.navDate}>{entry.date}</span>
                    </button>
                ))}
            </aside>

            {/* Main Content Feed */}
            <div className={styles.feed}>
                {changelog.map((entry) => {
                    // Group changes logic
                    const groupedChanges: Record<string, typeof entry.changes> = {};
                    entry.changes.forEach(change => {
                        if (!groupedChanges[change.category]) {
                            groupedChanges[change.category] = [];
                        }
                        groupedChanges[change.category].push(change);
                    });

                    const categoryOrder: Array<keyof typeof CATEGORY_INFO> = ['feature', 'ui', 'balance', 'performance', 'bugfix'];

                    return (
                        <div key={entry.version} id={`version-${entry.version}`} className={styles.versionGroup}>
                            {/* Timeline Node */}
                            <div className={styles.timelineNode}>
                                {entry.type === 'major' ? '👑' : entry.type === 'minor' ? '✨' : '📝'}
                            </div>

                            {/* Content Card */}
                            <div className={styles.contentCard}>
                                <div className={styles.header}>
                                    <div className={styles.versionTitleRow}>
                                        <h2 className={styles.versionNumber}>v{entry.version}</h2>
                                        <span
                                            className={styles.versionTag}
                                            style={{ backgroundColor: TYPE_INFO[entry.type].color }}
                                        >
                                            {TYPE_INFO[entry.type].label}
                                        </span>
                                    </div>
                                    <h3 className={styles.versionTitle}>{entry.title}</h3>
                                    <time className={styles.versionDate}>Published on {entry.date}</time>
                                </div>

                                <div className={styles.categoriesGrid}>
                                    {categoryOrder.map(cat => {
                                        const changes = groupedChanges[cat];
                                        if (!changes || changes.length === 0) return null;
                                        const info = CATEGORY_INFO[cat];

                                        return (
                                            <div key={cat} className={styles.categoryGroup}>
                                                <h4 className={styles.categoryHeader}>
                                                    <span style={{ color: info.color, fontSize: '1.2em' }}>{info.icon}</span>
                                                    {info.label}
                                                </h4>
                                                <ul className={styles.changeList}>
                                                    {changes.map((change, cIdx) => (
                                                        <li key={cIdx} className={styles.changeItem}>
                                                            <span className={styles.bullet}>•</span>
                                                            <span>{change.description}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

