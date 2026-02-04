'use client';

import { useState, useEffect, useRef } from 'react';

interface AnimatedResourceProps {
    value: number;
    ratePerHour: number;
    formatFn?: (n: number) => string;
}

/**
 * Componente que muestra un recurso incrementándose en tiempo real
 * basado en la tasa de producción por hora
 */
export function AnimatedResource({ value, ratePerHour, formatFn }: AnimatedResourceProps) {
    const [displayValue, setDisplayValue] = useState(value);
    const lastUpdateRef = useRef(Date.now());
    const baseValueRef = useRef(value);

    // Reset cuando el valor real cambia significativamente (construcción completada, etc.)
    useEffect(() => {
        const diff = Math.abs(value - displayValue);
        // Si la diferencia es mayor al equivalente de 2 segundos de producción, resetear
        const threshold = Math.max(1, (ratePerHour / 3600) * 2);
        if (diff > threshold) {
            setDisplayValue(value);
            baseValueRef.current = value;
            lastUpdateRef.current = Date.now();
        }
    }, [value, displayValue, ratePerHour]);

    // Animación continua
    useEffect(() => {
        if (ratePerHour <= 0) {
            setDisplayValue(value);
            return;
        }

        const ratePerMs = ratePerHour / 3600000; // Por milisegundo

        const interval = setInterval(() => {
            const now = Date.now();
            const elapsed = now - lastUpdateRef.current;
            const increment = elapsed * ratePerMs;

            setDisplayValue(prev => {
                const newValue = prev + increment;
                lastUpdateRef.current = now;
                return newValue;
            });
        }, 100); // Actualizar cada 100ms para animación suave

        return () => clearInterval(interval);
    }, [ratePerHour, value]);

    const format = formatFn || ((n: number) => Math.floor(n).toLocaleString());

    return <span style={{ fontVariantNumeric: 'tabular-nums' }}>{format(displayValue)}</span>;
}
