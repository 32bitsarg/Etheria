# 🎲 Sistema de Loot

Sistema de generación de loot inspirado en Diablo II, completamente en español.

## ✨ Características

### Sistema de Rareza
- **Normal** (Gris) - Sin afijos
- **Mágico** (Azul) - 1-2 afijos
- **Raro** (Amarillo) - 3-6 afijos
- **Legendario** (Naranja) - Stats fijos únicos
- **Conjunto** (Verde) - Parte de un set con bonuses

### Sistema de Afijos
- **Prefijos**: Afilado, Cortante, Devastador, Cruel, Brutal, Divino, etc.
- **Sufijos**: de Vida, de Vitalidad, de la Ballena, del Vampiro, del Rayo, etc.
- **Tiers**: Cada afijo tiene 3 niveles de poder

### Sistema de Balance

#### Pity System
Garantiza drops después de cierta cantidad de intentos:
- Legendario: garantizado después de 50 drops sin uno
- Raro: garantizado después de 15 drops sin uno
- Conjunto: garantizado después de 60 drops sin uno

#### Bad Luck Protection
Aumenta las chances después de rachas de drops normales:
- Se activa después de 5 drops normales consecutivos
- +10% por cada drop normal adicional
- Máximo bonus: +100%

### Items Legendarios
Items predefinidos con stats fijos y descripciones flavorizadas:
- Corona del Rey Olvidado
- Filo de la Sombra
- Piel del Dragón Ancestral
- Anillo del Poder Absoluto
- Y más...

### Items de Conjunto
Sets completos con bonuses por piezas:
- **Armadura del Guerrero Inmortal** (3 piezas)
- **Vestiduras del Archimago** (4 piezas)
- **Equipo del Cazador Nocturno** (3 piezas)

## 📦 Estructura del Proyecto

\`\`\`
lootsystem/
├── packages/
│   └── core/                 # Librería principal
│       ├── src/
│       │   ├── types/        # Tipos TypeScript
│       │   ├── rarity/       # Sistema de rarezas
│       │   ├── affix/        # Sistema de afijos
│       │   ├── item/         # Items base
│       │   ├── legendario/   # Items legendarios
│       │   ├── conjunto/     # Items de conjunto
│       │   ├── treasure-class/  # Treasure Classes
│       │   └── loot-generator/  # Generador principal
│       └── demo.ts           # Demo de consola
└── apps/
    └── web/                  # Frontend Next.js
        └── src/app/          # Páginas
\`\`\`

## 🚀 Uso Rápido

### Instalación

\`\`\`bash
npm install
npm run build -w packages/core
\`\`\`

### Uso del Core

\`\`\`typescript
import { GeneradorLoot, Rareza } from '@lootsystem/core';

// Crear generador con configuración
const generador = new GeneradorLoot({
  hallazgoMagico: 150, // +150% Magic Find
  pity: {
    legendario: 50,    // Garantizado después de 50 drops
    raro: 15,
    conjunto: 60,
  },
  badLuck: {
    habilitado: true,
    dropsParaActivar: 5,
    bonusPorcentaje: 10,
    maxBonus: 100,
  },
});

// Generar loot desde un boss
const resultado = generador.generarDesdeTC('tc_jefe_acto1', {
  nivelMonstruo: 30,
  esJefe: true,
});

// Ver items
for (const item of resultado.items) {
  console.log(\`\${item.nombre} (\${item.rareza})\`);
}

// Ver estado del balance
console.log(\`Drops sin Legendario: \${resultado.estadoPity?.dropsSinLegendario}\`);
console.log(\`Bonus Bad Luck: +\${resultado.estadoBadLuck?.bonusActual}%\`);
\`\`\`

### Frontend

\`\`\`bash
# Iniciar servidor de desarrollo
npm run dev -w apps/web

# Abrir http://localhost:3000
\`\`\`

## 📊 Treasure Classes

| TC | Nombre | Picks | Modificadores |
|----|--------|-------|---------------|
| tc_monstruo_normal | Monstruo Normal | 1 | - |
| tc_monstruo_campeon | Monstruo Campeón | 2 | +50% Legendario |
| tc_monstruo_elite | Monstruo Élite | 3 | +150% Legendario |
| tc_jefe_acto1 | Jefe del Acto 1 | 5 | +300% Legendario |
| tc_jefe_final | Jefe Final | 7 | +500% Legendario |

## 🎮 Demo

\`\`\`bash
cd packages/core
npx ts-node demo.ts
\`\`\`

## 📝 Licencia

MIT
