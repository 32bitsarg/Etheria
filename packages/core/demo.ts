/**
 * Demo del Sistema de Loot
 * Ejecutar: npx ts-node demo.ts
 */

import {
    GeneradorLoot,
    Rareza,
    obtenerNombreRareza,
    NOMBRES_STATS,
} from './src';

// Crear instancia con Hallazgo Mágico
const generador = new GeneradorLoot({
    hallazgoMagico: 150,
    pity: {
        legendario: 50,
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

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║             SISTEMA DE LOOT - DEMO                         ║');
console.log('╚════════════════════════════════════════════════════════════╝');
console.log('');

// Simular drops de diferentes TCs
const treasureClasses = [
    { id: 'tc_monstruo_normal', nombre: 'Monstruo Normal', nivel: 10 },
    { id: 'tc_monstruo_campeon', nombre: 'Monstruo Campeón', nivel: 20 },
    { id: 'tc_jefe_acto1', nombre: 'Jefe del Acto 1', nivel: 30 },
];

for (const tc of treasureClasses) {
    console.log(`\n▓▓▓ ${tc.nombre.toUpperCase()} (Nivel ${tc.nivel}) ▓▓▓`);
    console.log('─'.repeat(50));

    const resultado = generador.generarDesdeTC(tc.id, {
        nivelMonstruo: tc.nivel,
        esJefe: tc.id.includes('jefe'),
    });

    // Mostrar oro
    if (resultado.cantidadOro) {
        console.log(`💰 ${resultado.cantidadOro.toLocaleString()} ORO`);
    }

    // Mostrar items
    if (resultado.items.length === 0) {
        console.log('❌ No cayó nada');
    } else {
        for (const item of resultado.items) {
            const colorRareza = obtenerColorRareza(item.rareza);
            const nombreRareza = obtenerNombreRareza(item.rareza);

            console.log(`\n  ┌─ ${item.nombre}`);
            console.log(`  │  ${nombreRareza} ${item.itemBase.nombre}`);

            // Stats base
            if (item.itemBase.statsBase.length > 0) {
                for (const stat of item.itemBase.statsBase) {
                    const nombre = NOMBRES_STATS[stat.stat] ?? stat.stat;
                    console.log(`  │  ${nombre}: ${stat.min}${stat.max !== stat.min ? `-${stat.max}` : ''}`);
                }
            }

            // Afijos
            for (const afijo of item.afijos) {
                for (const mod of afijo.modificadoresRolleados) {
                    const nombre = NOMBRES_STATS[mod.stat] ?? mod.stat;
                    console.log(`  │  +${mod.valor} ${nombre}`);
                }
            }

            // Flavor text (legendarios)
            if (item.datosLegendario?.descripcion) {
                console.log(`  │  ${item.datosLegendario.descripcion}`);
            }

            // Nombre del conjunto
            if (item.datosConjunto) {
                console.log(`  │  Parte de: ${item.datosConjunto.nombreConjunto}`);
            }

            console.log(`  └─ Nivel ${item.nivelItem}`);
        }
    }

    // Mostrar estado del balance
    console.log('\n  [Estado de Balance]');
    console.log(`  • Drops sin Legendario: ${resultado.estadoPity?.dropsSinLegendario}`);
    console.log(`  • Drops sin Raro: ${resultado.estadoPity?.dropsSinRaro}`);
    console.log(`  • Bonus Bad Luck: +${resultado.estadoBadLuck?.bonusActual}%`);
}

console.log('\n');
console.log('═'.repeat(50));
console.log('Demo completada!');

// Helper para color
function obtenerColorRareza(rareza: Rareza): string {
    const colores: Record<Rareza, string> = {
        [Rareza.NORMAL]: '\x1b[37m',
        [Rareza.MAGICO]: '\x1b[34m',
        [Rareza.RARO]: '\x1b[33m',
        [Rareza.LEGENDARIO]: '\x1b[38;5;208m',
        [Rareza.CONJUNTO]: '\x1b[32m',
    };
    return colores[rareza] ?? '\x1b[0m';
}
