'use client';

import { useEffect, useRef, useState } from 'react';

interface TileMapProps {
    width?: number; // width in tiles
    height?: number; // height in tiles
}

interface MapJSON {
    tileSize: number;
    mapWidth: number;
    mapHeight: number;
    layers: {
        name: string;
        tiles: { id: string; x: number; y: number }[];
    }[];
}

export function TileMapCanvas({ width = 30, height = 20 }: TileMapProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [tileset, setTileset] = useState<HTMLImageElement | null>(null);
    const [mapJson, setMapJson] = useState<MapJSON | null>(null);

    const SCALE = 2; // Adjust if needed: The exported map seems large (200x120), might need zooming or scrolling

    // 1. Cargar Tileset y JSON
    useEffect(() => {
        // Cargar Imagen
        const img = new Image();
        img.src = '/assets/tilesets/map/spritesheet.webp';
        img.onload = () => setTileset(img);
        img.onerror = () => console.error('Error loading spritesheet');

        // Cargar Mapa JSON
        fetch('/assets/tilesets/map/map.json')
            .then(res => res.json())
            .then(data => setMapJson(data))
            .catch(err => console.error('Error loading map.json', err));
    }, []);

    const TILE_SIZE = mapJson?.tileSize || 16;

    // Render Loop (Full Map)
    useEffect(() => {
        if (!tileset || !mapJson || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Limpiar canvas
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.imageSmoothingEnabled = false;

        const cols = Math.floor(tileset.width / TILE_SIZE);

        const layersToDraw = [...mapJson.layers].reverse();

        layersToDraw.forEach(layer => {
            layer.tiles.forEach(tile => {
                const tileId = parseInt(tile.id, 10);

                const srcX = (tileId % cols) * TILE_SIZE;
                const srcY = Math.floor(tileId / cols) * TILE_SIZE;

                // Coordenadas Absolutas en el Canvas
                const destX = tile.x * TILE_SIZE * SCALE;
                const destY = tile.y * TILE_SIZE * SCALE;

                ctx.drawImage(
                    tileset,
                    srcX, srcY,
                    TILE_SIZE, TILE_SIZE,
                    destX, destY,
                    TILE_SIZE * SCALE, TILE_SIZE * SCALE
                );
            });
        });

    }, [tileset, mapJson, TILE_SIZE, SCALE]);

    if (!mapJson) return null;

    const fullWidth = mapJson.mapWidth * TILE_SIZE * SCALE;
    const fullHeight = mapJson.mapHeight * TILE_SIZE * SCALE;

    return (
        <canvas
            ref={canvasRef}
            width={fullWidth}
            height={fullHeight}
            style={{
                display: 'block',
                imageRendering: 'pixelated',
                // AJUSTA ESTE VALOR MANUALMENTE: 
                // -15% sube mucho el mapa. 0% lo deja original.
                // Prueba valores como -8%, -10%, -12% o pixeles fijos como -100px.
                transform: 'translateY(-10%)'
            }}
        />
    );
}
