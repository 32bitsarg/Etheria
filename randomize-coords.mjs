
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function randomizeCoordinates() {
    try {
        const cities = await prisma.city.findMany();
        console.log(`Encontradas ${cities.length} ciudades.`);

        for (const city of cities) {
            // Distribución aleatoria real por todo el mapa (0-100)
            // Usamos un margen pequeño (5-95) para que no queden pegadas al borde absoluto
            const x = Math.floor(Math.random() * 90) + 5;
            const y = Math.floor(Math.random() * 90) + 5;

            await prisma.city.update({
                where: { id: city.id },
                data: { x, y }
            });
            console.log(`✅ Ciudad "${city.name}" reubicada en: [X:${x}, Y:${y}]`);
        }

        console.log('\n✨ ¡Todas las ciudades han sido esparcidas por el mundo!');
    } catch (error) {
        console.error('❌ Error al randomizar coordenadas:', error);
    } finally {
        await prisma.$disconnect();
    }
}

randomizeCoordinates();
