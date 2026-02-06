'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import styles from './QuickRegisterForm.module.css';

export function QuickRegisterForm() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [touched, setTouched] = useState({ password: false, confirm: false });

    // Password Strength Logic
    const strength = useMemo(() => {
        if (!password) return 0;
        let score = 0;
        if (password.length > 5) score += 1;
        if (password.length > 7) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        return score; // Max 5
    }, [password]);

    const getStrengthLabel = (s: number) => {
        if (s < 2) return { text: 'Débil', class: styles.weak, width: '20%' };
        if (s < 3) return { text: 'Regular', class: styles.fair, width: '40%' };
        if (s < 4) return { text: 'Buena', class: styles.good, width: '70%' };
        return { text: 'Fuerte', class: styles.strong, width: '100%' };
    };

    const strengthInfo = getStrengthLabel(strength);
    const passwordsMatch = password === confirmPassword;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!passwordsMatch) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        if (strength < 2) {
            alert('La contraseña es demasiado débil.');
            return;
        }

        // Placeholder for registration logic
        alert('¡Bienvenido, noble Lord! Tu solicitud ha sido enviada a los escribas.');
    };

    return (
        <div className={styles.card}>
            <h3 className={styles.title}>
                Reclama tu Trono
            </h3>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="username">Nombre de Lord</label>
                    <input
                        id="username"
                        type="text"
                        className={styles.input}
                        placeholder="Ej. Lord Aragon"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="email">Correo Real</label>
                    <input
                        id="email"
                        type="email"
                        className={styles.input}
                        placeholder="tu@reino.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        className={styles.input}
                        placeholder="******"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setTouched(prev => ({ ...prev, password: true }));
                        }}
                        required
                    />
                    {touched.password && password && (
                        <div className={styles.strengthWrapper}>
                            <div className={styles.strengthMeter}>
                                <div
                                    className={`${styles.strengthBar} ${strengthInfo.class}`}
                                    style={{ width: strengthInfo.width }}
                                />
                            </div>
                            <div className={styles.strengthText} style={{ color: password.length < 6 ? 'var(--error)' : 'var(--text-muted)' }}>
                                {strengthInfo.text}
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="confirmPassword">Confirmar Contraseña</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        className={styles.input}
                        placeholder="Repite tu contraseña"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setTouched(prev => ({ ...prev, confirm: true }));
                        }}
                        required
                    />
                    {touched.confirm && confirmPassword && !passwordsMatch && (
                        <div className={styles.errorText}>Las contraseñas no coinciden</div>
                    )}
                </div>

                <button type="submit" className={styles.submitBtn}>
                    Fundar Imperio
                </button>

                <div className={styles.footer}>
                    ¿Ya tienes un reino? <Link href="/login" className={styles.link}>Entrar</Link>
                </div>
            </form>
        </div>
    );
}
