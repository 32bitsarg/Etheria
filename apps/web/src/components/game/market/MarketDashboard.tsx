'use client';

import { useState, useEffect, useCallback } from 'react';
import { MarketChart } from './MarketChart';
import styles from './Market.module.css';
import { useToast } from '@/components/ui/ToastContext';

interface MarketData {
    marketPrice: number;
    spread: {
        bestBuy: number | null;
        bestSell: number | null;
    };
    orderBook: {
        buy: any[];
        sell: any[];
    };
}

interface TradeListing {
    id: string;
    offeredType: string;
    offeredAmount: number;
    requestedType: string;
    requestedAmount: number;
    seller: {
        user: { username: string };
    };
}

const RESOURCE_ICONS: Record<string, React.ReactNode> = {
    'WOOD': <img src="/assets/resources/Wood Resource.webp" alt="Wood" style={{ width: '18px', height: '18px', verticalAlign: 'middle' }} />,
    'IRON': <img src="/assets/resources/Iron_Resource.webp" alt="Iron" style={{ width: '18px', height: '18px', verticalAlign: 'middle' }} />,
    'GOLD': <img src="/assets/resources/Gold_Resource.webp" alt="Gold" style={{ width: '18px', height: '18px', verticalAlign: 'middle' }} />,
    'DOBLONES': <img src="/assets/hud/doblones.webp" alt="Doblones" style={{ width: '18px', height: '18px', verticalAlign: 'middle' }} />,
    'ETHER': <img src="/assets/hud/ether.webp" alt="Ether" style={{ width: '18px', height: '18px', verticalAlign: 'middle' }} />
};

const RESOURCE_LABELS: Record<string, string> = {
    'WOOD': 'Madera',
    'IRON': 'Hierro',
    'GOLD': 'Oro',
    'DOBLONES': 'Doblones',
    'ETHER': 'Éter'
};

function ResourceSelector({ value, onChange }: { value: string, onChange: (val: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.customSelect}>
            <div className={styles.selectTrigger} onClick={() => setIsOpen(!isOpen)}>
                {RESOURCE_ICONS[value]}
                <span>{RESOURCE_LABELS[value]}</span>
                <span style={{ marginLeft: 'auto', opacity: 0.5, fontSize: '0.7rem' }}>▼</span>
            </div>

            {isOpen && (
                <div className={styles.selectOptions}>
                    {Object.keys(RESOURCE_ICONS).map((key) => (
                        <div
                            key={key}
                            className={`${styles.option} ${value === key ? styles.optionActive : ''}`}
                            onClick={() => {
                                onChange(key);
                                setIsOpen(false);
                            }}
                        >
                            {RESOURCE_ICONS[key]}
                            <span>{RESOURCE_LABELS[key]}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Backdrop para cerrar al hacer click fuera */}
            {isOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={() => setIsOpen(false)} />}
        </div>
    );
}

export function MarketDashboard() {
    const { addToast } = useToast();
    const [marketTab, setMarketTab] = useState<'EXCHANGE' | 'P2P'>('EXCHANGE');

    // Exchange States
    const [data, setData] = useState<MarketData | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [recentTrades, setRecentTrades] = useState<any[]>([]);

    // P2P States
    const [trades, setTrades] = useState<TradeListing[]>([]);
    const [p2pOfferedType, setP2POfferedType] = useState('WOOD');
    const [p2pOfferedAmount, setP2POfferedAmount] = useState<number>(0);
    const [p2pRequestedType, setP2PRequestedType] = useState('IRON');
    const [p2pRequestedAmount, setP2PRequestedAmount] = useState<number>(0);

    const [loading, setLoading] = useState(true);
    const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
    const [amount, setAmount] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);
    const [processing, setProcessing] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState<any>(null);
    const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        try {
            const res = await fetch('/api/v1/auth/session');
            const data = await res.json();
            if (data.success && data.player) setCurrentPlayer(data.player);
        } catch (error) {
            console.error('Error fetching session:', error);
        }
    }, []);

    const fetchMarketData = useCallback(async () => {
        try {
            const [ratesRes, historyRes] = await Promise.all([
                fetch('/api/v1/market/rates'),
                fetch('/api/v1/market/history')
            ]);
            const ratesData = await ratesRes.json();
            const historyData = await historyRes.json();
            if (ratesData.success) setData(ratesData);
            if (historyData.success) {
                setHistory(historyData.history);
                setRecentTrades(historyData.recentTrades || []);
            }
        } catch (error) {
            console.error('Error fetching market data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchP2PTrades = useCallback(async () => {
        try {
            const res = await fetch('/api/v1/market/trades');
            const data = await res.json();
            if (data.success) setTrades(data.trades);
        } catch (error) {
            console.error('Error fetching P2P trades:', error);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (marketTab === 'EXCHANGE') {
            fetchMarketData();
            const interval = setInterval(fetchMarketData, 30000);
            return () => clearInterval(interval);
        } else {
            fetchP2PTrades();
            const interval = setInterval(fetchP2PTrades, 30000);
            return () => clearInterval(interval);
        }
    }, [marketTab, fetchMarketData, fetchP2PTrades]);

    const handleCancelOrder = async (orderId: string) => {
        setOrderToCancel(orderId);
    };

    const confirmCancelOrder = async () => {
        if (!orderToCancel) return;
        const orderId = orderToCancel;
        setOrderToCancel(null);
        setProcessing(true);
        try {
            const res = await fetch('/api/v1/market/exchange/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId })
            });
            const result = await res.json();
            if (result.success) {
                fetchMarketData();
                addToast('Orden cancelada y fondos devueltos', 'success');
            } else {
                addToast(`Error: ${result.error}`, 'error');
            }
        } catch (error) {
            addToast('Error al cancelar la orden', 'error');
        } finally {
            setProcessing(false);
        }
    };

    const handleTrade = async () => {
        if (amount <= 0) return;
        setProcessing(true);
        try {
            const res = await fetch('/api/v1/market/exchange', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: tradeType, amount, price: price || undefined })
            });
            const result = await res.json();
            if (result.success) {
                fetchMarketData();
                setAmount(0);
                setPrice(0);
                addToast('Transacción completada con éxito', 'success');
            } else {
                addToast(`Error: ${result.error}`, 'error');
            }
        } catch (error) {
            addToast('Error en la comunicación con el servidor', 'error');
        } finally {
            setProcessing(false);
        }
    };

    const handleCreateP2PTrade = async () => {
        if (p2pOfferedAmount <= 0 || p2pRequestedAmount <= 0) return;
        setProcessing(true);
        try {
            const res = await fetch('/api/v1/market/trades', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    offeredType: p2pOfferedType,
                    offeredAmount: p2pOfferedAmount,
                    requestedType: p2pRequestedType,
                    requestedAmount: p2pRequestedAmount
                })
            });
            const result = await res.json();
            if (result.success) {
                fetchP2PTrades();
                addToast('Oferta publicada en el tablón', 'success');
                setP2POfferedAmount(0);
                setP2PRequestedAmount(0);
            } else {
                addToast(`Error: ${result.error}`, 'error');
            }
        } catch (error) {
            addToast('Error al publicar la oferta', 'error');
        } finally {
            setProcessing(false);
        }
    };

    const handleAcceptP2PTrade = async (tradeId: string) => {
        setProcessing(true);
        try {
            const res = await fetch('/api/v1/market/trades/accept', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tradeId })
            });
            const result = await res.json();
            if (result.success) {
                fetchP2PTrades();
                addToast('¡Trato cerrado!', 'success');
            } else {
                addToast(`Error: ${result.error}`, 'error');
            }
        } catch (error) {
            addToast('Error al aceptar el trato', 'error');
        } finally {
            setProcessing(false);
        }
    };

    if (loading && !data && marketTab === 'EXCHANGE') return <div className={styles.container}>Cargando Mercado...</div>;

    const currentPrice = data?.marketPrice || 500;
    const bestBuy = data?.spread.bestBuy;
    const bestSell = data?.spread.bestSell;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h2 className={styles.title}>Mercado Imperial</h2>
                    <div className={styles.tabs} style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                        <button
                            className={`${styles.tab} ${marketTab === 'EXCHANGE' ? styles.activeTabBuy : ''}`}
                            onClick={() => setMarketTab('EXCHANGE')}
                            style={{ fontSize: '0.7rem', padding: '0.3rem 1rem' }}
                        >CASA DE CAMBIO</button>
                        <button
                            className={`${styles.tab} ${marketTab === 'P2P' ? styles.activeTabBuy : ''}`}
                            onClick={() => setMarketTab('P2P')}
                            style={{ fontSize: '0.7rem', padding: '0.3rem 1rem' }}
                        >TABLÓN P2P</button>
                    </div>
                </div>
                {marketTab === 'EXCHANGE' && (
                    <div className={styles.marketInfo}>
                        <div className={styles.priceDisplay}>
                            <div className={styles.priceLabel}>Precio de Mercado</div>
                            <div className={styles.priceValue}>{currentPrice.toFixed(0)} Doblones</div>
                            <div className={`${styles.trend} ${styles.up}`}>
                                ▲ +2.4% <span style={{ fontSize: '0.7rem', color: 'gray' }}>(24h)</span>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {marketTab === 'EXCHANGE' ? (
                <div className={styles.mainGrid}>
                    <div className={styles.panel}>
                        <h3 className={styles.panelTitle}>📜 Libro de Órdenes</h3>
                        <div style={{ fontSize: '0.7rem', color: '#ce9e58', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 'bold', alignItems: 'center' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>PRECIO (<img src="/assets/hud/doblones.webp" alt="Doblones" style={{ width: '14px', height: '14px' }} />)</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>CANTIDAD (<img src="/assets/hud/ether.webp" alt="Ether" style={{ width: '14px', height: '14px' }} />)</span>
                        </div>
                        <div className={styles.orderBookContainer}>
                            {data?.orderBook.sell.slice(0, 15).reverse().map((order: any, i: number) => {
                                const isOwnOrder = String(order.playerId) === String(currentPlayer?.id);
                                return (
                                    <div
                                        key={i}
                                        className={`${styles.orderRow} ${styles.sellRow}`}
                                        style={{
                                            cursor: isOwnOrder ? 'pointer' : 'default',
                                            border: isOwnOrder ? '1px solid #ce9e58' : 'none',
                                            backgroundColor: isOwnOrder ? 'rgba(206, 158, 88, 0.1)' : undefined
                                        }}
                                        title={isOwnOrder ? 'Tu orden (Click para cancelar)' : ''}
                                        onClick={() => isOwnOrder && handleCancelOrder(order.id)}
                                    >
                                        <span>{order.price.toFixed(1)}</span>
                                        <span>{order.amount}</span>
                                        {isOwnOrder && <span style={{ fontSize: '0.8rem', marginLeft: '4px', filter: 'drop-shadow(0 0 2px black)' }}>❌</span>}
                                    </div>
                                );
                            })}
                            <div style={{ padding: '0.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', margin: '0.25rem 0', fontWeight: 'bold', fontSize: '1rem', color: '#ce9e58', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                {currentPrice.toFixed(1)} <img src="/assets/hud/doblones.webp" alt="Doblones" style={{ width: '20px', height: '20px' }} />
                            </div>
                            {data?.orderBook.buy.slice(0, 15).map((order: any, i: number) => {
                                const isOwnOrder = String(order.playerId) === String(currentPlayer?.id);
                                return (
                                    <div
                                        key={i}
                                        className={`${styles.orderRow} ${styles.buyRow}`}
                                        style={{
                                            cursor: isOwnOrder ? 'pointer' : 'default',
                                            border: isOwnOrder ? '1px solid #ce9e58' : 'none',
                                            backgroundColor: isOwnOrder ? 'rgba(206, 158, 88, 0.1)' : undefined
                                        }}
                                        title={isOwnOrder ? 'Tu orden (Click para cancelar)' : ''}
                                        onClick={() => isOwnOrder && handleCancelOrder(order.id)}
                                    >
                                        <span>{order.price.toFixed(1)}</span>
                                        <span>{order.amount}</span>
                                        {isOwnOrder && <span style={{ fontSize: '0.8rem', marginLeft: '4px', filter: 'drop-shadow(0 0 2px black)' }}>❌</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className={styles.panel}>
                        <h3 className={styles.panelTitle}>📈 Valor del Éter (24h)</h3>
                        <div style={{ flexGrow: 1, minHeight: 0 }}>
                            <MarketChart data={history} />
                        </div>
                    </div>

                    <div className={styles.panel}>
                        <h3 className={styles.panelTitle}>💸 Casa de Cambio</h3>
                        <div className={styles.tradingContent}>
                            <div className={styles.tabs}>
                                <button
                                    className={`${styles.tab} ${tradeType === 'BUY' ? styles.activeTabBuy : ''}`}
                                    onClick={() => setTradeType('BUY')}
                                >COMPRAR</button>
                                <button
                                    className={`${styles.tab} ${tradeType === 'SELL' ? styles.activeTabSell : ''}`}
                                    onClick={() => setTradeType('SELL')}
                                >VENDER</button>
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>CANTIDAD A {tradeType === 'BUY' ? 'COMPRAR' : 'VENDER'}</label>
                                <div className={styles.inputWrapper}>
                                    <input type="number" className={styles.input} value={amount} onChange={(e) => setAmount(Number(e.target.value))} placeholder="0.00" />
                                    <span className={styles.currencyIcon}><img src="/assets/hud/ether.webp" alt="Ether" style={{ width: '18px', height: '18px' }} /></span>
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>PRECIO {tradeType === 'BUY' ? 'MÁXIMO' : 'MÍNIMO'} (OPCIONAL)</label>
                                <div className={styles.inputWrapper}>
                                    <input type="number" className={styles.input} value={price || ''} onChange={(e) => setPrice(Number(e.target.value))} placeholder={tradeType === 'BUY' ? `${bestSell || currentPrice}` : `${bestBuy || currentPrice}`} />
                                    <span className={styles.currencyIcon}><img src="/assets/hud/doblones.webp" alt="Doblones" style={{ width: '18px', height: '18px' }} /></span>
                                </div>
                            </div>
                            <div className={styles.summary}>
                                <div className={styles.summaryRow}>
                                    <span>{tradeType === 'BUY' ? 'Total Éter' : 'Éter a vender'}</span>
                                    <span style={{ color: '#ce9e58', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {amount.toFixed(2)} <img src="/assets/hud/ether.webp" alt="Ether" style={{ width: '16px', height: '16px' }} />
                                    </span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>{tradeType === 'BUY' ? 'Coste' : 'Retorno'}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {(amount * (price || currentPrice)).toFixed(0)} <img src="/assets/hud/doblones.webp" alt="Doblones" style={{ width: '16px', height: '16px' }} />
                                    </span>
                                </div>
                            </div>
                            <button className={`${styles.actionBtn} ${tradeType === 'BUY' ? styles.buyBtn : styles.sellBtn}`} onClick={handleTrade} disabled={processing || amount <= 0}>
                                {processing ? '...' : `${tradeType === 'BUY' ? 'COMPRAR' : 'VENDER'} ÉTER`}
                            </button>
                        </div>
                    </div>

                    <div className={styles.panel}>
                        <h3 className={styles.panelTitle}>🏛️ Compañía de Comercio</h3>
                        <div style={{ fontSize: '0.7rem', color: '#ce9e58', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                            <span>PRECIO</span>
                            <span>CANT.</span>
                            <span>HORA</span>
                        </div>
                        <div className={styles.orderBookContainer}>
                            {recentTrades.map((t, i) => (
                                <div key={i} className={styles.orderRow} style={{ color: t.type === 'BUY' ? '#4ade80' : '#f87171', background: 'transparent' }}>
                                    <span style={{ fontWeight: 'bold' }}>{t.price.toFixed(1)}</span>
                                    <span>{t.volume.toFixed(2)}</span>
                                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>{t.time}</span>
                                </div>
                            ))}
                            {recentTrades.length === 0 && <div style={{ textAlign: 'center', color: 'gray', padding: '1rem', fontSize: '0.8rem' }}>Sin trades recientes.</div>}
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.mainGrid}>
                    <div className={styles.panel} style={{ gridColumn: 'span 2' }}>
                        <h3 className={styles.panelTitle}>🤝 Ofertas de Jugadores</h3>
                        <div className={styles.orderBookContainer}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '1rem', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.7rem', color: 'gray', fontWeight: 'bold' }}>
                                <span>VENDE</span>
                                <span>PIDE</span>
                                <span>RATIO</span>
                                <span>JUGADOR</span>
                                <span>ACCIÓN</span>
                            </div>
                            {trades.map((t) => (
                                <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '1rem', padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center', fontSize: '0.85rem' }}>
                                    <span>{t.offeredAmount} {RESOURCE_ICONS[t.offeredType]}</span>
                                    <span>{t.requestedAmount} {RESOURCE_ICONS[t.requestedType]}</span>
                                    <span style={{ color: '#ce9e58' }}>{(t.requestedAmount / t.offeredAmount).toFixed(2)}</span>
                                    <span>{t.seller.user.username}</span>
                                    <button
                                        onClick={() => handleAcceptP2PTrade(t.id)}
                                        className={styles.buyBtn}
                                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', margin: 0, height: 'auto', minWidth: '80px' }}
                                        disabled={processing}
                                    >ACEPTAR</button>
                                </div>
                            ))}
                            {trades.length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: 'gray' }}>No hay ofertas públicas en este momento.</div>}
                        </div>
                    </div>

                    <div className={styles.panel}>
                        <h3 className={styles.panelTitle}>📝 Crear Nueva Oferta</h3>
                        <div className={styles.tradingContent}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>ESTOY VENDIENDO</label>
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                                    <ResourceSelector value={p2pOfferedType} onChange={setP2POfferedType} />
                                    <input type="number" className={styles.input} style={{ flex: 1 }} value={p2pOfferedAmount} onChange={(e) => setP2POfferedAmount(Number(e.target.value))} placeholder="0" />
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>A CAMBIO DE</label>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <ResourceSelector value={p2pRequestedType} onChange={setP2PRequestedType} />
                                    <input type="number" className={styles.input} style={{ flex: 1 }} value={p2pRequestedAmount} onChange={(e) => setP2PRequestedAmount(Number(e.target.value))} placeholder="0" />
                                </div>
                            </div>
                            <div className={styles.summary} style={{ marginTop: '1rem' }}>
                                <div className={styles.summaryRow}>
                                    <span>Ratio del trato</span>
                                    <span style={{ color: '#ce9e58' }}>{p2pOfferedAmount > 0 ? (p2pRequestedAmount / p2pOfferedAmount).toFixed(2) : '0.00'}</span>
                                </div>
                            </div>
                            <button className={styles.actionBtn} style={{ background: 'var(--color-primary-main)' }} onClick={handleCreateP2PTrade} disabled={processing || p2pOfferedAmount <= 0}>
                                {processing ? '...' : 'PUBLICAR OFERTA'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {orderToCancel && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,
                    borderRadius: '8px'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #2d2a26 0%, #1c1917 100%)',
                        border: '1px solid #ce9e58',
                        padding: '2rem',
                        borderRadius: '12px',
                        maxWidth: '400px',
                        textAlign: 'center',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                    }}>
                        <h3 style={{ color: '#ce9e58', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>🏛️ Decreto de Cancelación</h3>
                        <p style={{ color: '#e5e7eb', marginBottom: '2rem', fontSize: '0.9rem', lineHeight: '1.5' }}>
                            ¿Deseas retirar tu oferta del mercado imperial?<br />
                            <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Los fondos bloqueados serán devueltos a tu tesorería inmediatamente.</span>
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => setOrderToCancel(null)}
                                style={{
                                    flex: 1, padding: '0.75rem', background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)', color: 'white',
                                    borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
                                }}
                            >
                                MANTENER
                            </button>
                            <button
                                onClick={confirmCancelOrder}
                                style={{
                                    flex: 1, padding: '0.75rem', background: 'linear-gradient(to bottom, #ef4444, #dc2626)',
                                    border: 'none', color: 'white',
                                    borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold',
                                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                                }}
                            >
                                CANCELAR
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
