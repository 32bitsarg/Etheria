'use client';

import { useState, useEffect, useMemo } from 'react';
import styles from './ReportsPanel.module.css';
import { UnitType, UNIT_STATS } from '@lootsystem/game-engine';

interface Report {
    id: string;
    attackerId: string;
    defenderId: string;
    originCityName: string;
    targetCityName: string;
    won: boolean;
    lootedWood: number;
    lootedIron: number;
    lootedGold: number;
    lootedDoblones: number;
    lootedEther: number;
    troopSummary: {
        attackerInitial: { type: string; count: number }[];
        attackerLosses: { type: string; count: number }[];
        defenderInitial: { type: string; count: number }[];
        defenderLosses: { type: string; count: number }[];
    };
    timestamp: string;
    read: boolean;
}

interface ReportsPanelProps {
    playerId: string;
    onClose: () => void;
}

const NPC_NAMES: Record<string, string> = {
    'barbarian_light': 'Bárbaro Ligero',
    'barbarian_archer': 'Arquero Bárbaro',
    'guardian': 'Guardián de las Ruinas',
};

type FilterType = 'all' | 'attack' | 'defense' | 'npc';

export function ReportsPanel({ playerId, onClose }: ReportsPanelProps) {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [filter, setFilter] = useState<FilterType>('all');

    const fetchReports = async (isLoadMore = false) => {
        if (!isLoadMore) setLoading(true);
        else setLoadingMore(true);

        try {
            const skip = isLoadMore ? reports.length : 0;
            const res = await fetch(`/api/v1/player/reports?limit=20&skip=${skip}`);
            const data = await res.json();
            if (data.success) {
                if (isLoadMore) {
                    setReports(prev => [...prev, ...data.reports]);
                } else {
                    setReports(data.reports);
                }
                setHasMore(data.hasMore);
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [playerId]);

    const handleSelectReport = async (report: Report) => {
        setSelectedReport(report);
        if (!report.read) {
            try {
                // Marcar como leído individualmente
                await fetch('/api/v1/player/reports/read', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reportId: report.id })
                });
                // Actualizar localmente
                setReports(prev => prev.map(r => r.id === report.id ? { ...r, read: true } : r));
            } catch (e) {
                console.error("Error marking report as read:", e);
            }
        }
    };

    const handleDeleteReport = async (e: React.MouseEvent, reportId: string) => {
        e.stopPropagation(); // Evitar abrir el informe
        if (!confirm('¿Seguro que quieres eliminar este informe?')) return;

        try {
            const res = await fetch('/api/v1/player/reports/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reportId })
            });
            if (res.ok) {
                setReports(prev => prev.filter(r => r.id !== reportId));
            }
        } catch (e) {
            console.error("Error deleting report:", e);
        }
    };

    const handleClearAll = async () => {
        if (!confirm('¿Seguro que quieres eliminar TODOS los informes? Esta acción no se puede deshacer.')) return;

        try {
            const res = await fetch('/api/v1/player/reports/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ all: true })
            });
            if (res.ok) {
                setReports([]);
                setSelectedReport(null);
            }
        } catch (e) {
            console.error("Error clearing reports:", e);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString();
    };

    const isAttacker = (report: Report) => report.attackerId === playerId;
    const isNPC = (report: Report) => !report.defenderId;

    const filteredReports = useMemo(() => {
        return reports.filter(r => {
            if (filter === 'all') return true;
            if (filter === 'attack') return isAttacker(r) && !isNPC(r);
            if (filter === 'defense') return !isAttacker(r);
            if (filter === 'npc') return isNPC(r);
            return true;
        });
    }, [reports, filter]);

    const getVictoryStatus = (report: Report) => {
        if (isAttacker(report)) {
            return report.won ? 'VICTORIA' : 'DERROTA';
        } else {
            return report.won ? 'DERROTA' : 'VICTORIA';
        }
    };

    return (
        <div className={styles.overlay} onMouseDown={(e) => e.stopPropagation()}>
            <div className={styles.panel}>
                <div className={styles.header}>
                    <h2>{selectedReport ? 'Detalle de Batalla' : 'Informes de Combate'}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>

                {!selectedReport && (
                    <div className={styles.toolbar}>
                        <div className={styles.filters}>
                            <button
                                className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                Todos
                            </button>
                            <button
                                className={`${styles.filterBtn} ${filter === 'attack' ? styles.active : ''}`}
                                onClick={() => setFilter('attack')}
                            >
                                Ataques
                            </button>
                            <button
                                className={`${styles.filterBtn} ${filter === 'defense' ? styles.active : ''}`}
                                onClick={() => setFilter('defense')}
                            >
                                Defensas
                            </button>
                            <button
                                className={`${styles.filterBtn} ${filter === 'npc' ? styles.active : ''}`}
                                onClick={() => setFilter('npc')}
                            >
                                NPCs
                            </button>
                        </div>
                        <div className={styles.actions}>
                            <button className={styles.actionBtn} onClick={handleClearAll}>
                                Limpiar Todo
                            </button>
                        </div>
                    </div>
                )}

                <div className={styles.content}>
                    {loading ? (
                        <div className={styles.loading}>Cargando informes...</div>
                    ) : selectedReport ? (
                        <div className={styles.detailView}>
                            <button className={styles.backBtn} onClick={() => setSelectedReport(null)}>
                                ← Volver a la lista
                            </button>

                            <div className={styles.reportHeader}>
                                <div className={styles.reportTitle}>
                                    Ataque sobre <span className={styles.defender}>{selectedReport.targetCityName}</span>
                                </div>
                                <div className={`${styles.status} ${getVictoryStatus(selectedReport) === 'VICTORIA' ? styles.victory : styles.defeat}`}>
                                    {(() => {
                                        const status = getVictoryStatus(selectedReport);
                                        const totalInitial = selectedReport.troopSummary.attackerInitial.reduce((sum, u) => sum + u.count, 0);
                                        const totalLosses = selectedReport.troopSummary.attackerLosses.reduce((sum, u) => sum + u.count, 0);
                                        const efficiency = ((totalInitial - totalLosses) / totalInitial) * 100;

                                        if (status === 'VICTORIA') {
                                            if (efficiency > 90) return 'Victoria Aplastante';
                                            if (efficiency < 25) return 'Victoria Pírrica';
                                            return 'Victoria';
                                        } else {
                                            if (efficiency < 10) return 'Aniquilación Total';
                                            return 'Derrota';
                                        }
                                    })()}
                                </div>
                            </div>

                            <div className={styles.efficiencySection}>
                                <div className={styles.efficiencyBarWrapper}>
                                    <div className={styles.efficiencyLabel}>
                                        <span>Estado del Atacante</span>
                                        <span>{(() => {
                                            const total = selectedReport.troopSummary.attackerInitial.reduce((sum, u) => sum + u.count, 0);
                                            const losses = selectedReport.troopSummary.attackerLosses.reduce((sum, u) => sum + u.count, 0);
                                            return Math.round(((total - losses) / total) * 100);
                                        })()}%</span>
                                    </div>
                                    <div className={styles.progressBarContainer}>
                                        <div
                                            className={`${styles.progressBar} ${styles.attackerProgress}`}
                                            style={{
                                                width: `${(() => {
                                                    const total = selectedReport.troopSummary.attackerInitial.reduce((sum, u) => sum + u.count, 0);
                                                    const losses = selectedReport.troopSummary.attackerLosses.reduce((sum, u) => sum + u.count, 0);
                                                    return Math.round(((total - losses) / total) * 100);
                                                })()}%`
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className={styles.efficiencyBarWrapper}>
                                    <div className={styles.efficiencyLabel}>
                                        <span>Estado del Defensor</span>
                                        <span>{(() => {
                                            const total = selectedReport.troopSummary.defenderInitial.reduce((sum, u) => sum + u.count, 0);
                                            const losses = selectedReport.troopSummary.defenderLosses.reduce((sum, u) => sum + u.count, 0);
                                            return Math.round(((total - losses) / total) * 100);
                                        })()}%</span>
                                    </div>
                                    <div className={styles.progressBarContainer}>
                                        <div
                                            className={`${styles.progressBar} ${styles.defenderProgress}`}
                                            style={{
                                                width: `${(() => {
                                                    const total = selectedReport.troopSummary.defenderInitial.reduce((sum, u) => sum + u.count, 0);
                                                    const losses = selectedReport.troopSummary.defenderLosses.reduce((sum, u) => sum + u.count, 0);
                                                    return Math.round(((total - losses) / total) * 100);
                                                })()}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.battleStats}>
                                <div className={styles.sidePanel}>
                                    <div className={`${styles.sideTitle} ${styles.attacker}`}>Atacante: {selectedReport.originCityName}</div>
                                    <table className={styles.troopTable}>
                                        <thead>
                                            <tr>
                                                <th>Unidad</th>
                                                <th>Inicial</th>
                                                <th>Bajas</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedReport.troopSummary.attackerInitial.map(u => {
                                                const loss = selectedReport.troopSummary.attackerLosses.find(l => l.type === u.type)?.count || 0;
                                                return (
                                                    <tr key={u.type}>
                                                        <td>{UNIT_STATS[u.type as UnitType]?.name || NPC_NAMES[u.type] || u.type}</td>
                                                        <td>{u.count}</td>
                                                        <td className={styles.loss}>-{loss}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <div className={styles.sidePanel}>
                                    <div className={`${styles.sideTitle} ${styles.defender}`}>Defensor: {selectedReport.targetCityName}</div>
                                    <table className={styles.troopTable}>
                                        <thead>
                                            <tr>
                                                <th>Unidad</th>
                                                <th>Inicial</th>
                                                <th>Bajas</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedReport.troopSummary.defenderInitial.map(u => {
                                                const loss = selectedReport.troopSummary.defenderLosses.find(l => l.type === u.type)?.count || 0;
                                                return (
                                                    <tr key={u.type}>
                                                        <td>{UNIT_STATS[u.type as UnitType]?.name || NPC_NAMES[u.type] || u.type}</td>
                                                        <td>{u.count}</td>
                                                        <td className={styles.loss}>-{loss}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {(selectedReport.lootedWood > 0 || selectedReport.lootedIron > 0 || selectedReport.lootedGold > 0 || selectedReport.lootedDoblones > 0 || selectedReport.lootedEther > 0) && (
                                <div className={styles.lootPanel}>
                                    <div className={styles.lootTitle}>Botín Capturado</div>
                                    <div className={styles.lootGrid}>
                                        {selectedReport.lootedWood > 0 && (
                                            <div className={styles.lootItem}>
                                                <img src="/assets/resources/Wood Resource.webp" className={styles.lootIcon} alt="Madera" title="Madera" />
                                                <span>{Math.floor(selectedReport.lootedWood)}</span>
                                            </div>
                                        )}
                                        {selectedReport.lootedIron > 0 && (
                                            <div className={styles.lootItem}>
                                                <img src="/assets/resources/Iron_Resource.webp" className={styles.lootIcon} alt="Hierro" title="Hierro" />
                                                <span>{Math.floor(selectedReport.lootedIron)}</span>
                                            </div>
                                        )}
                                        {selectedReport.lootedGold > 0 && (
                                            <div className={styles.lootItem}>
                                                <img src="/assets/resources/Gold_Resource.webp" className={styles.lootIcon} alt="Oro" title="Oro" />
                                                <span>{Math.floor(selectedReport.lootedGold)}</span>
                                            </div>
                                        )}
                                        {selectedReport.lootedDoblones > 0 && (
                                            <div className={styles.lootItem}>
                                                <img src="/assets/hud/doblones.webp" className={styles.lootIcon} alt="Doblones" title="Doblones" />
                                                <span>{Math.floor(selectedReport.lootedDoblones)}</span>
                                            </div>
                                        )}
                                        {selectedReport.lootedEther > 0 && (
                                            <div className={styles.lootItem}>
                                                <img src="/assets/hud/ether.webp" className={styles.lootIcon} alt="Éter" title="Éter" />
                                                <span>{Math.floor(selectedReport.lootedEther)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className={styles.reportDate} style={{ marginTop: 'auto', textAlign: 'right' }}>
                                {formatDate(selectedReport.timestamp)}
                            </div>
                        </div>
                    ) : filteredReports.length === 0 ? (
                        <div className={styles.empty}>
                            {reports.length === 0 ? 'No tienes informes de combate aún.' : 'No hay informes que coincidan con el filtro.'}
                        </div>
                    ) : (
                        filteredReports.map(report => (
                            <div
                                key={report.id}
                                className={`${styles.reportItem} ${!report.read ? styles.unread : ''}`}
                                onClick={() => handleSelectReport(report)}
                            >
                                <button
                                    className={styles.deleteBtn}
                                    onClick={(e) => handleDeleteReport(e, report.id)}
                                    title="Eliminar informe"
                                >
                                    🗑️
                                </button>
                                <div className={styles.reportHeader}>
                                    <div className={`${styles.status} ${getVictoryStatus(report) === 'VICTORIA' ? styles.victory : styles.defeat}`}>
                                        {getVictoryStatus(report)}
                                    </div>
                                    <div className={styles.reportDate}>{formatDate(report.timestamp)}</div>
                                </div>
                                <div className={styles.reportTitle}>
                                    {isAttacker(report) ? (
                                        <>Atacaste a <span className={styles.defender}>{report.targetCityName}</span></>
                                    ) : (
                                        <><span className={styles.attacker}>{report.originCityName}</span> te atacó</>
                                    )}
                                </div>
                                <div className={styles.reportSummary}>
                                    {report.won ? 'Las tropas atacantes se alzaron con la victoria.' : 'El ataque fue repelido con éxito.'}
                                    {report.lootedWood + report.lootedIron + report.lootedGold > 0 &&
                                        ` Se capturaron recursos. `}
                                </div>
                            </div>
                        ))
                    )}

                    {!selectedReport && reports.length > 0 && hasMore && (
                        <div className={styles.loadMoreWrapper}>
                            <button
                                className={styles.loadMoreBtn}
                                onClick={() => fetchReports(true)}
                                disabled={loadingMore}
                            >
                                {loadingMore ? 'Cargando...' : 'Cargar más informes'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
