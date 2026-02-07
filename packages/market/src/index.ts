/**
 * @lootsystem/market
 * Motor de economía y comercio para Etheria
 */

export type OrderType = 'BUY' | 'SELL';
export type OrderStatus = 'OPEN' | 'FILLED' | 'CANCELLED' | 'PARTIAL';

export interface ExchangeOrder {
    id: string;
    playerId: string;
    type: OrderType;
    amount: number;
    remainingAmount: number;
    price: number;
    status: OrderStatus;
    createdAt: Date;
}

export interface MatchResult {
    executedAmount: number;
    totalCost: number; // En Doblones
    averagePrice: number;
    matches: {
        orderId: string;
        amount: number;
        price: number;
    }[];
}

export class MarketEngine {
    private readonly TAX_RATE = 0.02; // 2% de comisión (Gold Sink)

    constructor() { }

    /**
     * Calcula el coste total de una operación incluyendo impuestos
     */
    calculateTotalCost(amount: number, price: number): number {
        const base = amount * price;
        return base * (1 + this.TAX_RATE);
    }

    /**
     * Encuentra matches para una nueva orden contra el libro de órdenes existente
     * @param newOrder La orden que entra al mercado
     * @param orderBook Órdenes abiertas del tipo opuesto, ordenadas por precio (mejor primero)
     */
    matchOrder(
        type: OrderType,
        amount: number,
        orderBook: ExchangeOrder[]
    ): MatchResult {
        let remainingToFill = amount;
        let totalCost = 0;
        const matches: MatchResult['matches'] = [];

        for (const order of orderBook) {
            if (remainingToFill <= 0) break;

            const amountFromThisOrder = Math.min(remainingToFill, order.remainingAmount);

            matches.push({
                orderId: order.id,
                amount: amountFromThisOrder,
                price: order.price
            });

            totalCost += amountFromThisOrder * order.price;
            remainingToFill -= amountFromThisOrder;
        }

        const executedAmount = amount - remainingToFill;

        return {
            executedAmount,
            totalCost,
            averagePrice: executedAmount > 0 ? totalCost / executedAmount : 0,
            matches
        };
    }

    /**
     * Calcula el precio actual basado en reservas (Constant Product Formula: x * y = k)
     */
    getCurrentAMMPrice(etherReserve: number, doblonesReserve: number): number {
        return doblonesReserve / etherReserve;
    }

    /**
     * Calcula cuánto recibirá/pagará el usuario por una cantidad X usando AMM
     * @returns { amountOut: number, newEtherReserve: number, newDoblonesReserve: number }
     */
    calculateAMMTrade(
        type: 'BUY' | 'SELL',
        amount: number,
        etherReserve: number,
        doblonesReserve: number
    ): { costInDoblones: number; etherReceived: number; newEtherReserve: number; newDoblonesReserve: number } {
        const k = etherReserve * doblonesReserve;

        if (type === 'BUY') {
            // El usuario da Doblones, recibe Éter
            // Queremos que el usuario RECIBA 'amount' de Éter
            const newEtherReserve = etherReserve - amount;
            if (newEtherReserve <= 0) throw new Error('Liquidez del sistema insuficiente');

            const newDoblonesReserve = k / newEtherReserve;
            const costInDoblones = newDoblonesReserve - doblonesReserve;

            return {
                costInDoblones,
                etherReceived: amount,
                newEtherReserve,
                newDoblonesReserve
            };
        } else {
            // El usuario da Éter, recibe Doblones
            const newEtherReserve = etherReserve + amount;
            const newDoblonesReserve = k / newEtherReserve;
            const receivingDoblones = doblonesReserve - newDoblonesReserve;

            return {
                costInDoblones: -receivingDoblones, // Negativo porque el usuario "paga" negativo (recibe)
                etherReceived: amount,
                newEtherReserve,
                newDoblonesReserve
            };
        }
    }

    /**
     * Obtiene el precio sugerido de mercado considerando al AMM como un participante más.
     * El AMM actúa como un "market maker" permanente en el spread.
     */
    getMarketPrice(buyOrders: ExchangeOrder[], sellOrders: ExchangeOrder[], ammPrice?: number): number {
        const playerBestBuy = buyOrders[0]?.price || 0;
        const playerBestSell = sellOrders[0]?.price || 0;

        // El AMM siempre es una opción de compra y venta a su precio actual
        const effectiveAmmPrice = ammPrice || 500;

        // El mejor precio para comprar (ASK) es el menor entre el mejor vendedor y el AMM
        const bestAsk = playerBestSell > 0 ? Math.min(playerBestSell, effectiveAmmPrice) : effectiveAmmPrice;

        // El mejor precio para vender (BID) es el mayor entre el mejor comprador y el AMM
        const bestBid = playerBestBuy > 0 ? Math.max(playerBestBuy, effectiveAmmPrice) : effectiveAmmPrice;

        return (bestAsk + bestBid) / 2;
    }
}
