
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function randomizeCoordinates() {
    const cities = await prisma.city.findMany();
    console.log(`Encontradas ${cities.length} ciudades.`);

    for (const city of cities) {
        const x = Math.floor(Math.random() * 80) + 10;
        const y = Math.floor(Math.random() * 80) + 10;
        await prisma.city.update({
            where: { id: city.id },
            data: { x, y }
        });
        console.log(`Ciudad ${city.name} movida a [${x}, ${y}]`);
    }
}

randomizeCoordinates()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
