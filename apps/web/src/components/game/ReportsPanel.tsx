'use client';

import { useState, useEffect } from 'react';
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

export function ReportsPanel({ playerId, onClose }: ReportsPanelProps) {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await fetch('/api/v1/player/reports');
                const data = await res.json();
                if (data.success) {
                    setReports(data.reports);
                }
            } catch (error) {
                console.error('Error fetching reports:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [playerId]);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString();
    };

    const isAttacker = (report: Report) => report.attackerId === playerId;

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
                                    {getVictoryStatus(selectedReport)}
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
                                                        <td>{UNIT_STATS[u.type as UnitType]?.name || u.type}</td>
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
                                                        <td>{UNIT_STATS[u.type as UnitType]?.name || u.type}</td>
                                                        <td>{u.count}</td>
                                                        <td className={styles.loss}>-{loss}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {(selectedReport.lootedWood > 0 || selectedReport.lootedIron > 0 || selectedReport.lootedGold > 0) && (
                                <div className={styles.lootPanel}>
                                    <div className={styles.lootTitle}>Botín Capturado</div>
                                    <div className={styles.lootGrid}>
                                        <div className={styles.lootItem}>
                                            <img src="/assets/resources/Wood Resource.png" className={styles.lootIcon} alt="Wood" />
                                            <span>{Math.floor(selectedReport.lootedWood)}</span>
                                        </div>
                                        <div className={styles.lootItem}>
                                            <img src="/assets/resources/Iron_Resource.png" className={styles.lootIcon} alt="Iron" />
                                            <span>{Math.floor(selectedReport.lootedIron)}</span>
                                        </div>
                                        <div className={styles.lootItem}>
                                            <img src="/assets/resources/Gold_Resource.png" className={styles.lootIcon} alt="Gold" />
                                            <span>{Math.floor(selectedReport.lootedGold)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className={styles.reportDate} style={{ marginTop: 'auto', textAlign: 'right' }}>
                                {formatDate(selectedReport.timestamp)}
                            </div>
                        </div>
                    ) : reports.length === 0 ? (
                        <div className={styles.empty}>No tienes informes de combate aún.</div>
                    ) : (
                        reports.map(report => (
                            <div
                                key={report.id}
                                className={`${styles.reportItem} ${!report.read ? styles.unread : ''}`}
                                onClick={() => setSelectedReport(report)}
                            >
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
                </div>
            </div>
        </div>
    );
}
