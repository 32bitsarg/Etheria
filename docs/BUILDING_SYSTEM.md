# Etheria - Sistema de Construcción de Edificios

## Descripción General

El sistema de construcción permite a los jugadores mejorar edificios para aumentar la producción de recursos, almacenamiento y capacidades militares.

## Mecánicas Principales

### Cola de Construcción

- **Máximo de construcciones simultáneas:** 3
- Los edificios se construyen de forma secuencial
- Cada edificio solo puede tener una mejora activa a la vez

### Completar Instantáneamente

Para los **primeros 4 niveles** de cualquier edificio, el jugador puede completar la construcción instantáneamente usando el botón "⚡ Completar" en la cola de construcción.

> ⚠️ Esta funcionalidad está diseñada para acelerar el early-game y no está disponible para niveles superiores.

### Tiempos de Construcción

Los tiempos de construcción usan un multiplicador **agresivo** de `1.40x` por nivel:

| Edificio | Nivel 1 | Nivel 4 | Nivel 10 | Nivel 20 |
|----------|---------|---------|----------|----------|
| Ayuntamiento | 1.5 min | 5.7 min | 39 min | 16 h |
| Cuartel | 1.25 min | 4.7 min | 32 min | 13 h |
| Minas | 1 min | 3.8 min | 26 min | 10.5 h |
| Granja | 50 seg | 3.1 min | 21 min | 8.5 h |
| Almacén | 55 seg | 3.5 min | 23 min | 9.5 h |
| Centro Alianza | 3 min | 11.4 min | 78 min | 32 h |

**Fórmula:** `Tiempo = TiempoBase × 1.40^(nivel-1)`

### Costos de Mejora

Los costos usan un multiplicador de `1.26x` por nivel:

**Fórmula:** `Costo = CostoBase × 1.26^(nivel-1)`

| Nivel | Multiplicador |
|-------|---------------|
| 1 | 1.00x |
| 5 | 2.52x |
| 10 | 8.00x |
| 15 | 25.4x |
| 20 | 80.7x |

### Producción de Recursos

Los edificios productores usan un multiplicador de `1.18x` por nivel:

| Edificio | Base/h (Nivel 1) | Nivel 5 | Nivel 10 |
|----------|------------------|---------|----------|
| Aserradero | 50 | 96 | 208 |
| Mina Hierro | 40 | 77 | 167 |
| Mina Oro | 25 | 48 | 104 |

**Fórmula:** `Producción = ProducciónBase × 1.18^(nivel-1)`

## Interfaz de Usuario

### Panel de Vista Previa

Al hacer clic en un edificio, el panel muestra:

1. **Información del edificio** - Nombre, nivel actual, descripción
2. **Preview de mejora** - Comparación visual entre producción actual y nueva:
   ```
   Actual: 50/h → Nuevo: 59/h
   +9 madera/h
   ```
3. **Costos** - Madera, Hierro, Oro, Población
4. **Tiempo de construcción**
5. **Errores** - Si no hay recursos suficientes o cola llena

### Cola de Construcción (Lado Derecho)

Panel fijo que muestra:

- Contador de cola (ej: `2/3`)
- Lista de construcciones activas con:
  - Icono y nombre del edificio
  - Transición de nivel (ej: `Nivel 1 → 2`)
  - Barra de progreso con porcentaje
  - Tiempo restante
  - Botón "⚡ Completar" (si nivel ≤ 4)
  - Botón "✕ Cancelar" (devuelve 50% recursos)

### Barras de Progreso en el Mapa

Los edificios en construcción muestran:

- Animación de pulso azul
- Icono de martillo (🔨)
- Barra de progreso debajo del edificio
- Nivel objetivo (ej: `→ Nv.2`)

## Prerrequisitos

| Edificio | Requiere |
|----------|----------|
| Cuartel | Ayuntamiento Nv.3 |
| Mina Hierro | Ayuntamiento Nv.1 |
| Mina Oro | Ayuntamiento Nv.2 |
| Aserradero | Ayuntamiento Nv.1 |
| Granja | Ayuntamiento Nv.1 |
| Almacén | Ayuntamiento Nv.1 |
| Centro Alianza | Ayuntamiento Nv.5 |

## Archivos Relacionados

### Frontend (`apps/web/src/components/game/`)

- `BuildingPanel.tsx` - Modal de detalles y mejora
- `ConstructionQueue.tsx` - Panel de cola de construcción
- `CityMap.tsx` - Mapa con edificios y progreso

### Backend (`packages/`)

- `game-engine/src/index.ts` - Lógica de mejora y cola
- `buildings/src/index.ts` - Datos de edificios, costos, tiempos
- `resources/src/index.ts` - Producción y almacenamiento

## Constantes Configurables

```typescript
// packages/game-engine/src/index.ts
export const MAX_CONSTRUCTION_QUEUE = 3;
export const INSTANT_COMPLETE_MAX_LEVEL = 4;

// packages/buildings/src/index.ts
const TIME_MULTIPLIER_PER_LEVEL = 1.40;
const COST_MULTIPLIER_PER_LEVEL = 1.26;
const PRODUCTION_MULTIPLIER_PER_LEVEL = 1.18;
```

## Historial de Cambios

### v0.0.2 (2026-02-02)

- ⚖️ Aumentada producción base: Madera 35→50, Hierro 30→40, Oro 20→25
- ⚖️ Mejorada escala de producción: 1.12x → 1.18x por nivel
- ⚖️ Tiempos de construcción ajustados: nivel 4 ahora supera 5 minutos
- ✨ Cola de construcción de hasta 3 edificios simultáneos
- ✨ Botón "Completar Instantáneamente" para niveles 1-4
- ✨ Vista previa de mejora en el panel de edificio
- 🎨 Barra de progreso en edificios del mapa
- 🎨 Recursos animados en tiempo real

### v0.0.1 (2026-02-02)

- 🎉 Lanzamiento inicial del sistema de construcción
