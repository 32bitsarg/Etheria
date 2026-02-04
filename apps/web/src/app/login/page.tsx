'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

import { APP_CONFIG, getVersionDisplay, getLatestChangelog } from '@/lib/app-config';
import styles from './page.module.css';

export default function LoginPage() {
    const router = useRouter();
    const { login, register, isLoggedIn, needsRaceSelection } = useAuth();

    // State
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [localError, setLocalError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Password strength calculation
    const passStrength = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9!@#$%^&*]/.test(password)
    };

    // Redirect logic
    useEffect(() => {
        if (isLoggedIn) {
            if (needsRaceSelection) {
                router.push('/game?step=race');
            } else {
                router.push('/game');
            }
        }
    }, [isLoggedIn, needsRaceSelection, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');
        setIsLoading(true);

        if (!username.trim() || username.length < 3) {
            setLocalError('El usuario debe tener al menos 3 caracteres');
            setIsLoading(false);
            return;
        }

        if (mode === 'register') {
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setLocalError('Por favor ingresa un correo electrónico válido');
                setIsLoading(false);
                return;
            }

            // Password validation
            if (!Object.values(passStrength).every(Boolean)) {
                setLocalError('La contraseña no cumple con todos los requisitos de seguridad');
                setIsLoading(false);
                return;
            }

            if (password !== confirmPassword) {
                setLocalError('Las contraseñas no coinciden');
                setIsLoading(false);
                return;
            }
        }

        try {
            if (mode === 'login') {
                await login(username.trim(), password, rememberMe);
            } else {
                await register(username.trim(), password, email);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const changelog = getLatestChangelog();
    const latestUpdate = {
        version: changelog?.version || getVersionDisplay(),
        features: changelog?.changes.slice(0, 4).map(c => c.description) || [
            "Sistema de construcción de edificios",
            "Recursos en tiempo real",
            "4 Razas jugables"
        ]
    };

    return (
        <main className={styles.main}>
            {/* LEFT SIDE: Hero / Branding */}
            <div className={styles.heroSection}>
                <div className={styles.heroBackground}></div>

                <div className={styles.heroContent}>
                    <div className={styles.brand}>
                        <div className={styles.logo}>
                            <img src={APP_CONFIG.icon} alt="Logo" />
                        </div>
                        <div>
                            <h1 className={styles.appName}>{APP_CONFIG.name}</h1>
                        </div>
                    </div>

                    <p className={styles.tagline}>
                        Forja tu imperio. Comanda ejércitos. Conquista el mundo.
                        <br />
                        La estrategia en tiempo real definitiva.
                    </p>

                    <div className={styles.updateCard}>
                        <div className={styles.updateHeader}>
                            <span className={styles.updateTitle}>Novedades</span>
                            <span className={styles.versionBadge}>{latestUpdate.version}</span>
                        </div>
                        {latestUpdate.features.map((feature, i) => (
                            <div key={i} className={styles.updateItem}>
                                <span className={styles.updateBullet}>➤</span>
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: Form */}
            <div className={styles.formSection}>
                <div className={styles.topBar}>
                </div>

                <div className={styles.formWrapper}>
                    <div className={styles.welcomeText}>
                        <h2 className={styles.heading}>
                            {mode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
                        </h2>
                        <p className={styles.subHeading}>
                            {mode === 'login'
                                ? 'Ingresa tus credenciales para acceder'
                                : 'Comienza tu aventura hoy mismo'}
                        </p>
                    </div>

                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${mode === 'login' ? styles.activeTab : ''}`}
                            onClick={() => { setMode('login'); setLocalError(''); }}
                        >
                            Ingresar
                        </button>
                        <button
                            className={`${styles.tab} ${mode === 'register' ? styles.activeTab : ''}`}
                            onClick={() => { setMode('register'); setLocalError(''); }}
                        >
                            Registrarse
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {localError && (
                            <div className={styles.error}>{localError}</div>
                        )}

                        <div className={styles.field}>
                            <label htmlFor="username">Usuario</label>
                            <input
                                id="username"
                                type="text"
                                className={styles.input}
                                placeholder="Nombre de usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={isLoading}
                                autoFocus
                                autoComplete="username"
                            />
                        </div>

                        {mode === 'register' && (
                            <div className={styles.field}>
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    className={styles.input}
                                    placeholder="correo@ejemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    autoComplete="email"
                                />
                            </div>
                        )}

                        <div className={styles.field}>
                            <label htmlFor="password">Contraseña</label>
                            <input
                                id="password"
                                type="password"
                                className={styles.input}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                autoComplete={mode === 'login' ? "current-password" : "new-password"}
                            />
                            {mode === 'register' && (
                                <div className={styles.passwordStrength}>
                                    <div className={styles.strengthBar}>
                                        <div
                                            className={styles.strengthFill}
                                            style={{
                                                width: `${(Object.values(passStrength).filter(Boolean).length / 4) * 100}%`,
                                                backgroundColor: Object.values(passStrength).every(Boolean) ? '#22c55e' : '#eab308'
                                            }}
                                        />
                                    </div>
                                    <div className={styles.requirementsList}>
                                        <span className={passStrength.length ? styles.met : styles.unmet}>8+ chars</span>
                                        <span className={passStrength.uppercase ? styles.met : styles.unmet}>ABC</span>
                                        <span className={passStrength.lowercase ? styles.met : styles.unmet}>abc</span>
                                        <span className={passStrength.number ? styles.met : styles.unmet}>123/#$</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {mode === 'register' && (
                            <div className={styles.field}>
                                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    className={styles.input}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={isLoading}
                                    autoComplete="new-password"
                                />
                            </div>
                        )}

                        {mode === 'login' && (
                            <div className={styles.rememberMe}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span>Recordarme</span>
                                </label>
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`btn btn-primary ${styles.submitBtn}`}
                            disabled={isLoading}
                        >
                            {isLoading ? '...' : (mode === 'login' ? 'Ingresar' : 'Registrarse')}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
