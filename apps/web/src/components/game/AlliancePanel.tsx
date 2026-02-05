'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import styles from './AlliancePanel.module.css';
import { Alliance } from '@lootsystem/game-engine';

export function AlliancePanel() {
    const { player, syncWithServer } = useAuth();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
    const [createForm, setCreateForm] = useState({ name: '', tag: '' });
    const [allianceList, setAllianceList] = useState<Alliance[]>([]);
    const [viewAlliance, setViewAlliance] = useState<Alliance | null>(null);

    // Initial check or load
    useEffect(() => {
        if (player?.alliance) {
            fetchAllianceDetails(player.alliance.allianceId);
        } else if (activeTab === 'join') {
            fetchAllianceList();
        }
    }, [player?.alliance, activeTab]);

    const fetchAllianceDetails = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/v1/alliance/${id}`);
            const data = await res.json();
            if (res.ok) setViewAlliance(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllianceList = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/v1/alliance/list');
            const data = await res.json();
            if (res.ok) setAllianceList(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!player) return;
        setLoading(true);
        try {
            const res = await fetch('/api/v1/alliance/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: createForm.name,
                    tag: createForm.tag
                })
            });

            if (res.ok) {
                await syncWithServer();
            } else {
                const err = await res.json();
                alert(err.error || 'Error al crear la alianza');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (allianceId: string) => {
        if (!player) return;
        setLoading(true);
        try {
            const res = await fetch('/api/v1/alliance/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    allianceId
                })
            });

            if (res.ok) {
                await syncWithServer();
            } else {
                const err = await res.json();
                alert(err.error || 'Error al unirse');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLeave = async () => {
        if (!player) return;
        if (!confirm('¿Estás seguro de que quieres salir de la alianza?')) return;

        setLoading(true);
        try {
            const res = await fetch('/api/v1/alliance/leave', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                setViewAlliance(null);
                await syncWithServer();
            } else {
                const err = await res.json();
                alert(err.error || 'Error al salir');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDissolve = async () => {
        if (!player) return;
        if (!confirm('⚠ PELIGRO: Esto eliminará la alianza permanentemente y expulsará a todos los miembros. ¿Continuar?')) return;

        setLoading(true);
        try {
            const res = await fetch('/api/v1/alliance/dissolve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                setViewAlliance(null);
                await syncWithServer();
            } else {
                const err = await res.json();
                alert(err.error || 'Error al disolver');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !player?.alliance && !viewAlliance && allianceList.length === 0) {
        return <div className={styles.section}>Cargando...</div>;
    }

    // --- HAS ALLIANCE VIEW ---
    if (player?.alliance && viewAlliance) {
        const isLeader = player.alliance.rank === 'LEADER';

        return (
            <div className={styles.panel}>
                <h2 className={styles.title}>[{viewAlliance.tag}] {viewAlliance.name}</h2>

                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                        <span className={styles.infoValue}>{viewAlliance.members?.length || 0}</span>
                        <span className={styles.infoLabel}>Miembros</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoValue}>{new Date(viewAlliance.createdAt).toLocaleDateString()}</span>
                        <span className={styles.infoLabel}>Fundada</span>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Miembros</h3>
                    <div className={styles.memberList}>
                        {viewAlliance.members?.map((mem: any) => (
                            <div key={mem.id} className={styles.memberItem}>
                                <span className={styles.memberName}>{mem.player?.user?.username || 'Desconocido'}</span>
                                <span className={styles.memberName} style={{ fontSize: '0.8em', color: '#888' }}>{mem.player?.city?.name}</span>
                                <span className={`${styles.memberRank} ${mem.rank === 'LEADER' ? styles.leader : ''}`}>
                                    {mem.rank === 'LEADER' ? '👑 Líder' : 'Soldado'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <button className={styles.dangerBtn} onClick={handleLeave} disabled={loading}>
                        Salir de la Alianza
                    </button>

                    {isLeader && (
                        <div className={styles.dangerZone}>
                            <button className={styles.dangerBtn} style={{ background: '#b91c1c', color: 'white' }} onClick={handleDissolve} disabled={loading}>
                                ☠️ Disolver Alianza
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- NO ALLIANCE VIEW ---
    return (
        <div className={styles.panel}>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'create' ? styles.active : ''}`}
                    onClick={() => setActiveTab('create')}
                >
                    Crear Nueva
                </button>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'join' ? styles.active : ''}`}
                    onClick={() => setActiveTab('join')}
                >
                    Unirse a Existente
                </button>
            </div>

            {activeTab === 'create' ? (
                <div className={styles.section}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Nombre de la Alianza</label>
                        <input
                            className={styles.input}
                            value={createForm.name}
                            onChange={e => setCreateForm({ ...createForm, name: e.target.value })}
                            placeholder="Ej. Reinos Unidos"
                            maxLength={20}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Etiqueta (Tag)</label>
                        <input
                            className={styles.input}
                            value={createForm.tag}
                            onChange={e => setCreateForm({ ...createForm, tag: e.target.value })}
                            placeholder="Ej. UK"
                            maxLength={4}
                            style={{ textTransform: 'uppercase' }}
                        />
                    </div>
                    <button
                        className={styles.actionBtn}
                        onClick={handleCreate}
                        disabled={!createForm.name || !createForm.tag || loading}
                    >
                        {loading ? 'Fundando...' : 'Fundar Alianza'}
                    </button>
                </div>
            ) : (
                <div className={styles.section}>
                    <div className={styles.memberList}>
                        {allianceList.length === 0 ? (
                            <div style={{ padding: '1rem', textAlign: 'center', color: '#888' }}>No hay alianzas disponibles</div>
                        ) : (
                            allianceList.map((alliance: any) => (
                                <div key={alliance.id} className={styles.memberItem}>
                                    <span className={styles.memberName}>[{alliance.tag}] {alliance.name}</span>
                                    <span style={{ color: '#888' }}>{alliance._count?.members || 0} miemb.</span>
                                    <button
                                        style={{
                                            padding: '0.25rem 0.5rem',
                                            background: 'var(--primary)',
                                            border: 'none',
                                            borderRadius: '2px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}
                                        onClick={() => handleJoin(alliance.id)}
                                        disabled={loading}
                                    >
                                        Unirse
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
