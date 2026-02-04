'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

import { APP_CONFIG } from '@/lib/app-config';
import styles from './LandingHeader.module.css';

export function LandingHeader() {
    const { isLoggedIn } = useAuth();
    const pathname = usePathname();

    const navItems = [
        { label: 'Reino', href: '/' },
        { label: 'Bitácora', href: '/changelog' },
    ];

    return (
        <header className={styles.header}>
            <div className={styles.leftSection}>
                <Link href="/" className={styles.logo}>
                    <img src={APP_CONFIG.icon} alt="Etheria Logo" className={styles.logoImage} />
                    <span className={styles.logoText}>{APP_CONFIG.name}</span>
                </Link>
                <span className={styles.versionBadge}>{APP_CONFIG.version}</span>
            </div>

            <nav className={styles.nav}>
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.navLink} ${pathname === item.href ? styles.activeLink : ''}`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className={styles.rightSection}>

                {isLoggedIn ? (
                    <Link href="/game" className={`${styles.actionButton} ${styles.primaryBtn}`}>
                        Ir al Juego
                    </Link>
                ) : (
                    <Link href="/login" className={`${styles.actionButton} ${styles.loginBtn}`}>
                        Iniciar Sesión
                    </Link>
                )}
            </div>
        </header>
    );
}
