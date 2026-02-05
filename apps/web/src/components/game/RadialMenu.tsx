'use client';

import React, { useEffect, useState } from 'react';
import styles from './RadialMenu.module.css';

interface RadialOption {
    label: string;
    icon: string;
    action: () => void;
}

interface RadialMenuProps {
    options: RadialOption[];
    onClose: () => void;
    position: { x: number; y: number };
}

export function RadialMenu({ options, onClose, position }: RadialMenuProps) {
    const [active, setActive] = useState(false);

    useEffect(() => {
        // Trigger animation after mount
        const timer = setTimeout(() => setActive(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const radius = 60; // Desplazamiento desde el centro más compacto

    return (
        <>
            <div className={styles.radialMenuOverlay} onClick={onClose} onMouseDown={(e) => e.stopPropagation()} />
            <div
                className={`${styles.radialMenuContainer} ${active ? styles.active : ''}`}
                style={{ left: position.x, top: position.y }}
                onMouseDown={(e) => e.stopPropagation()}
            >
                {options.map((opt, i) => {
                    // Calcular ángulo para cada item (distribuirlos en abanico o círculo)
                    // Para 3 opciones: -60, 0, 60 grados (centrado arriba) o similar
                    const angleStep = 360 / Math.max(options.length, 1);
                    const startAngle = -90; // Empezar arriba
                    const angle = startAngle + (i * angleStep);
                    const angleRad = (angle * Math.PI) / 180;

                    const x = Math.cos(angleRad) * radius;
                    const y = Math.sin(angleRad) * radius;

                    return (
                        <div
                            key={opt.label}
                            className={styles.radialItem}
                            style={{
                                transform: active
                                    ? `translate(${x}px, ${y}px) scale(1)`
                                    : `translate(0,0) scale(0.5)`
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                opt.action();
                                onClose();
                            }}
                        >
                            <span className={styles.itemIcon}>{opt.icon}</span>
                            <span className={styles.itemLabel}>{opt.label}</span>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
