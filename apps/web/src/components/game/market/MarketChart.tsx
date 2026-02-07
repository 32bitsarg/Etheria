'use client';

import React from 'react';
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

interface CandleData {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

interface MarketChartProps {
    data: CandleData[];
}

export const MarketChart = ({ data }: MarketChartProps) => {
    if (!data || data.length === 0) {
        return (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '0.9rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <p>Esperando trades iniciales...</p>
                    <p style={{ fontSize: '0.7rem' }}>Realiza un intercambio para generar historial.</p>
                </div>
            </div>
        );
    }

    // Calcular el rango para el eje Y
    const minLow = Math.min(...data.map(d => d.low));
    const maxHigh = Math.max(...data.map(d => d.high));
    const margin = (maxHigh - minLow) * 0.1 || 10;
    const yDomain = [Math.max(0, Math.floor(minLow - margin)), Math.ceil(maxHigh + margin)];

    // Preparar datos para Recharts (barras bidimensionales [start, end])
    const chartData = data.map(d => ({
        ...d,
        wick: [d.low, d.high],
        body: [d.open, d.close],
        isUp: d.close >= d.open
    }));

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis
                        dataKey="time"
                        stroke="#555"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        domain={yDomain}
                        stroke="#555"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        orientation="right"
                        tickFormatter={(val) => `${val}`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1c1917', border: '1px solid #444', borderRadius: '4px', fontSize: '0.8rem' }}
                        itemStyle={{ padding: '0px' }}
                        labelStyle={{ color: '#888', marginBottom: '4px' }}
                    />

                    {/* Mecha (Wicks) */}
                    <Bar dataKey="wick" fill="#666" barSize={2}>
                        {chartData.map((entry: any, index: number) => (
                            <Cell key={`wick-${index}`} fill={entry.isUp ? '#22c55e' : '#ef4444'} opacity={0.5} />
                        ))}
                    </Bar>

                    {/* Cuerpo (Body) */}
                    <Bar dataKey="body" barSize={12}>
                        {chartData.map((entry: any, index: number) => (
                            <Cell key={`body-${index}`} fill={entry.isUp ? '#22c55e' : '#ef4444'} />
                        ))}
                    </Bar>
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};
