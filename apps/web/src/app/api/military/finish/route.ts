import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 5 minutos en milisegundos
// 5 minutos en milisegundos (Threshold)
const INSTANT_FINISH_THRESHOLD = 5 * 60 * 1000;

export async function POST(req: Request) {
    try {
        // En una app real, validar sesión aquí (o usar middleware/headers)
        // Por ahora simulamos que el playerId viene en el body o header, 
        // pero dado que el userAuth hook maneja el state, asumiremos que validamos
        // via cookie/token si estuviera implementado full.
        // Como estamos en un prototipo donde el userAuth pasa el playerId en requests (o deberia),
        // vamos a leer el playerId del body para simplificar la validación de propiedad.

        const body = await req.json();
        const { queueId, playerId } = body;

        if (!queueId || !playerId) {
            return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
        }

        // 1. Obtener item de cola
        const queueItem = await prisma.trainingQueueItem.findUnique({
            where: { id: queueId },
            include: { city: true } // Para verificar dueño
        });

        if (!queueItem) {
            return NextResponse.json({ error: 'Entrenamiento no encontrado' }, { status: 404 });
        }

        // Verificar propiedad (simplificado: verificar si el player es dueño de la ciudad)
        // Necesitamos saber si la ciudad pertenece al player.
        // El queueItem tiene cityId.
        const player = await prisma.player.findUnique({
            where: { id: playerId },
            include: { city: true }
        });

        if (!player || !player.city || player.city.id !== queueItem.cityId) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
        }

        // 2. Verificar tiempo
        const now = new Date();
        const timeLeft = new Date(queueItem.endTime).getTime() - now.getTime();

        if (timeLeft > INSTANT_FINISH_THRESHOLD) {
            return NextResponse.json({
                error: 'Faltan más de 5 minutos para terminar',
                timeLeft: Math.floor(timeLeft / 1000)
            }, { status: 400 });
        }

        // 3. Ejecutar finalización (Transacción)
        await prisma.$transaction(async (tx) => {
            // A. Agregar unidades
            // Upsert: si existe unidad de ese tipo en la ciudad, update count. Si no, create.
            // Ojo: Prisma upsert requiere un unique constraint.
            // En schema.prisma definí @@unique([cityId, type]) en el modelo Unit?
            // Verifiqué en el log paso 986: @@unique([cityId, type]). SÍ.

            await tx.unit.upsert({
                where: {
                    cityId_type: {
                        cityId: queueItem.cityId,
                        type: queueItem.unitType
                    }
                },
                update: {
                    count: { increment: queueItem.count }
                },
                create: {
                    cityId: queueItem.cityId,
                    type: queueItem.unitType,
                    count: queueItem.count
                }
            });

            // B. Eliminar de la cola
            await tx.trainingQueueItem.delete({
                where: { id: queueId }
            });
        });

        return NextResponse.json({ success: true, message: 'Entrenamiento finalizado' });

    } catch (error) {
        console.error('Error finalizando entrenamiento:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
