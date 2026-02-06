/**
 * =========================================
 * ETHERIA - Game Configuration & Changelog
 * =========================================
 * 
 * Este archivo es la ÚNICA fuente de verdad para:
 * - Nombre de la aplicación
 * - Versión actual
 * - Historial de cambios (Changelog)
 * 
 * Cualquier cambio aquí se reflejará en toda la aplicación.
 */

export const APP_CONFIG = {
    name: 'Etheria',
    version: '0.1.1',
    description: 'Un juego de estrategia medieval en tiempo real',
    author: 'Etheria Team',
    website: 'https://etheria.game',
    icon: '/assets/ico.webp',
} as const;

export interface ChangelogEntry {
    version: string;
    date: string;
    title: string;
    type: 'major' | 'minor' | 'patch' | 'hotfix';
    changes: {
        category: 'feature' | 'balance' | 'bugfix' | 'ui' | 'performance';
        description: string;
    }[];
}

export const CHANGELOG: ChangelogEntry[] = [
    {
        version: '0.1.1',
        date: '2026-02-06',
        title: 'Performance & Architecture Optimization',
        type: 'patch',
        changes: [
            {
                category: 'performance',
                description: 'Migración masiva de activos: Todas las imágenes JPG/PNG convertidas a WebP, reduciendo el peso de carga en un ~90%.',
            },
            {
                category: 'performance',
                description: 'Carga Dinámica (Dynamic Imports): Los paneles del juego (Reportes, Perfil, Chat) ahora se descargan solo bajo demanda.',
            },
            {
                category: 'performance',
                description: 'Optimización de Renderizado: Implementado React.memo y memorización de callbacks para reducir el uso de CPU y batería.',
            },
            {
                category: 'performance',
                description: 'Next.js Fonts: Integración nativa de tipografía medieval para una carga instantánea sin peticiones externas.',
            },
            {
                category: 'bugfix',
                description: 'Restablecida la comunicación del chat global para operar bajo el nuevo dominio log.stockcito.com.',
            },
        ],
    },
    {
        version: '0.1.0',
        date: '2026-02-05',
        title: 'Alpha Milestone: Mobile Conquest & Battle Systems',
        type: 'major',
        changes: [
            {
                category: 'feature',
                description: 'Lanzamiento Alpha Imperial: Mobile Dashboard optimizado con navegación táctil nativa y layout especializado para guerreros en movimiento.',
            },
            {
                category: 'feature',
                description: 'Sistema de Batallas: Implementado motor de combate, informes de batalla y movimientos de tropas en tiempo real.',
            },
            {
                category: 'ui',
                description: 'Diseño Glassmorphism: Nuevo sistema estético de cristales para modales móviles, garantizando una experiencia premium y moderna.',
            },
            {
                category: 'feature',
                description: 'Navegación Táctica: Soporte nativo para "Drag & Pan" en el Mapamundi y centrado automático en la ubicación real del jugador.',
            },
            {
                category: 'performance',
                description: 'Unificación de Reinos: Nuevo breakpoint de 900px para una compatibilidad perfecta entre Tablets, Móviles y Desktop.',
            },
            {
                category: 'bugfix',
                description: 'Resuelto error crítico de "Training Queue" y sincronización de tiempos de entrenamiento en el motor de juego.',
            },
            {
                category: 'feature',
                description: 'Control de Capacidad: Implementado sistema de gestión de islas por tamaño para evitar el hacinamiento de aldeas.',
            },
            {
                category: 'ui',
                description: 'Reubicación y rediseño de controles de mapa (Coordenadas y Centrado) con estética Glassmorphism en la esquina superior.',
            },
            {
                category: 'feature',
                description: 'Ajustes del Reino: Nuevo panel de configuración móvil con gestión de audio y sistema de salida centralizado.',
            },
            {
                category: 'performance',
                description: 'Sincronización de Audio: Implementada música ambiente en móvil con control de volumen reactivo en tiempo real.',
            },
        ],
    },
    {
        version: '0.0.9',
        date: '2026-02-05',
        title: 'Security Hardening & v1 API Migration',
        type: 'major',
        changes: [
            {
                category: 'feature',
                description: 'Seguridad de Nivel Imperial: Implementado sistema de autenticación JWT con Cookies HTTP-Only para una protección total.',
            },
            {
                category: 'feature',
                description: 'Migración a v1 API: Todos los endpoints del reino han sido actualizados a la versión 1, garantizando estabilidad y estándares modernos.',
            },
            {
                category: 'ui',
                description: 'Nueva Ruta Real: El juego ahora reside bajo la URL /play, con redirecciones automáticas para asegurar el flujo de los guerreros.',
            },
            {
                category: 'performance',
                description: 'Procesamiento Atómico: El motor del juego ahora utiliza transacciones de base de datos para asegurar que los recursos y unidades se acrediten sin errores.',
            },
            {
                category: 'performance',
                description: 'Optimización de Consultas: Añadidos índices de alto rendimiento en la base de datos para acelerar el ranking y la resolución de colas.',
            },
            {
                category: 'bugfix',
                description: 'Eliminados todos los placeholders y rutas temporales, consolidando una base de código totalmente integrada y lista para la batalla.',
            },
        ],
    },
    {
        version: '0.0.8',
        date: '2026-02-05',
        title: 'Ranking System & Player Profiles',
        type: 'minor',
        changes: [
            {
                category: 'feature',
                description: 'Sistema de Clasificación Global: Compite por el primer puesto en un ranking basado en tu Poder Militar real.',
            },
            {
                category: 'feature',
                description: 'Perfiles de Jugador Extendidos: Ahora puedes ver las estadísticas detalladas, biografía y historial de batallas de cualquier guerrero.',
            },
            {
                category: 'ui',
                description: 'Diseño de Pergamino: Implementada biografía con estilo medieval auténtico y maquetación de perfil mejorada.',
            },
            {
                category: 'feature',
                description: 'Integración Social: Acceso directo a perfiles desde el Mapamundi y la tabla de Clasificación.',
            },
            {
                category: 'performance',
                description: 'Poder Militar Persistente: Optimización del servidor para cálculos de ranking instantáneos sin latencia.',
            },
            {
                category: 'ui',
                description: 'Notificaciones de Nivel: Alertas visuales inmediatas cuando alcanzas un nuevo rango de experiencia.',
            },
        ],
    },
    {
        version: '0.0.7',
        date: '2026-02-04',
        title: 'Real-Time Reactivity & Zero Lag',
        type: 'minor',
        changes: [
            {
                category: 'performance',
                description: 'Sincronización Inmediata: Los edificios y movimientos ahora se resuelven en el milisegundo en que el temporizador llega a cero.',
            },
            {
                category: 'feature',
                description: 'Implementado sistema de Server-Sent Events (SSE) para notificaciones en tiempo real sin recargar la página.',
            },
            {
                category: 'ui',
                description: 'Sistema de Notificaciones Integrado: Nuevo diseño medieval en el lateral inferior para avisos de combate, mensajes y eventos.',
            },
            {
                category: 'ui',
                description: 'Gestión de Avisos Inteligente: Las notificaciones ahora persisten 15s, se pueden cerrar manualmente y tienen un límite de 5 elementos para evitar el hacinamiento.',
            },
            {
                category: 'ui',
                description: 'Filtrado optimista: Los elementos terminados desaparecen instantáneamente de la barra lateral.',
            },
            {
                category: 'bugfix',
                description: 'Corregido error en el retorno de tropas donde las unidades no se acreditaban correctamente tras una batalla.',
            },
            {
                category: 'feature',
                description: 'Correo Imperial: Implementado sistema completo de mensajería interna entre jugadores.',
            },
            {
                category: 'ui',
                description: 'Sidebar Renovado: Nuevos iconos premium personalizados de alta resolución.',
            },
            {
                category: 'bugfix',
                description: 'Next.js 15 Compatibility: Corregido error de desglosado de parámetros asíncronos en rutas dinámicas.',
            },
            {
                category: 'bugfix',
                description: 'Buscador de Destinatarios: Ahora permite enviar mensajes buscando tanto por Username como por Nombre de Ciudad.',
            },
            {
                category: 'bugfix',
                description: 'Corregida visibilidad del panel de ajustes en el sidebar mediante ajuste de desbordamiento.',
            },
            {
                category: 'performance',
                description: 'Optimización de consola: Eliminado el spam de logs de base de datos para un desarrollo más limpio.',
            },
        ],
    },
    {
        version: '0.0.6',
        date: '2026-02-04',
        title: 'World Map & Navigation',
        type: 'minor',
        changes: [
            {
                category: 'feature',
                description: 'Nuevo sistema de Mapamundi interactivo con 400 islas generadas por procedimiento.',
            },
            {
                category: 'feature',
                description: 'Sistema de Asentamientos Múltiples: Las islas ahora albergan hasta 8 aldeas de jugadores.',
            },
            {
                category: 'ui',
                description: 'Representación visual de aldeas sobre islas con etiquetas dinámicas de Alianza.',
            },
            {
                category: 'ui',
                description: 'Océano infinito con texturas de doble capa para eliminar costuras visuales.',
            },
            {
                category: 'performance',
                description: 'Optimización masiva (Culling): Solo se renderiza lo que ves, reduciendo el consumo de CPU/GPU.',
            },
            {
                category: 'performance',
                description: 'Navegación ultra fluida mediante bypass del ciclo de renderizado de React.',
            },
            {
                category: 'balance',
                description: 'Algoritmo de asignación de islas inteligente: Previene el hacinamiento de jugadores.',
            },
        ],
    },
    {
        version: '0.0.5',
        date: '2026-02-04',
        title: 'Communication & Stability',
        type: 'minor',
        changes: [
            {
                category: 'feature',
                description: 'Implementado Chat de Alianza con pestañas separadas (Global/Alianza).',
            },
            {
                category: 'bugfix',
                description: 'Solucionado error de redirección en Login y restauración de sesión al recargar.',
            },
            {
                category: 'bugfix',
                description: 'Corrección crítica en esquema de base de datos y sincronización de tipos.',
            },
            {
                category: 'ui',
                description: 'Rediseño visual de la Wiki de Razas con soporte para alias en URLs.',
            },
            {
                category: 'performance',
                description: 'Optimización de consultas de actualización de jugador (tick).',
            },
        ],
    },
    {
        version: '0.0.4',
        date: '2026-02-04',
        title: 'Alliance System Integration',
        type: 'minor',
        changes: [
            {
                category: 'feature',
                description: 'Implementado sistema de alianzas completo (Crear, Unirse, Salir, Disolver).',
            },
            {
                category: 'ui',
                description: 'Nueva interfaz de gestión de Alianzas integrada en el edificio "Centro de Alianzas".',
            },
            {
                category: 'ui',
                description: 'Eliminados botones de Alianza del menú lateral para centralizar la gestión en el edificio.',
            },
            {
                category: 'feature',
                description: 'Soporte de base de datos para Alianzas y rangos de Miembros (Líder/Miembro).',
            },
        ],
    },
    {
        version: '0.0.3',
        date: '2026-02-02',
        title: 'Auth Redesign & Security Hardening',
        type: 'minor',
        changes: [
            {
                category: 'ui',
                description: 'Nuevo diseño de Login/Registro con Split Layout y Hero Section animado',
            },
            {
                category: 'feature',
                description: 'Sistema de autenticación robusto: Hashing de contraseñas (SHA-256) y validación de email',
            },
            {
                category: 'ui',
                description: 'Indicador visual de fortaleza de contraseña en tiempo real',
            },
            {
                category: 'feature',
                description: 'Implementación completa del sistema militar (Entrenamiento, Cola, Finalización instantánea)',
            },
            {
                category: 'balance',
                description: 'Ajuste de costos y tiempos de entrenamiento para unidades básicas',
            },
        ],
    },
    {
        version: '0.0.2',
        date: '2026-02-02',
        title: 'Balance de Producción y Mejoras UI',
        type: 'minor',
        changes: [
            {
                category: 'balance',
                description: 'Aumentada producción base: Madera 35→50, Hierro 30→40, Oro 20→25 por hora',
            },
            {
                category: 'balance',
                description: 'Mejorada escala de producción: 1.12x → 1.18x por nivel (más satisfactorio)',
            },
            {
                category: 'ui',
                description: 'Recursos ahora muestran incremento en tiempo real (animación continua)',
            },
            {
                category: 'ui',
                description: 'Población ahora muestra "disponible/máximo" en lugar de "usada/máximo"',
            },
            {
                category: 'feature',
                description: 'Chat global centrado en la parte inferior de la pantalla',
            },
        ],
    },
    {
        version: '0.0.1',
        date: '2026-02-02',
        title: 'Lanzamiento Inicial - Alpha',
        type: 'major',
        changes: [
            {
                category: 'feature',
                description: 'Sistema de construcción de edificios con cola de producción',
            },
            {
                category: 'feature',
                description: 'Sistema de recursos: Madera, Hierro, Oro y Población',
            },
            {
                category: 'feature',
                description: 'Mapa de ciudad con layout radial de edificios',
            },
            {
                category: 'feature',
                description: 'Chat global en tiempo real con Appwrite',
            },
            {
                category: 'feature',
                description: '4 razas jugables: Elfos, Humanos, Orcos y Enanos',
            },
            {
                category: 'ui',
                description: 'Interfaz estilo Grepolis con barra de navegación superior',
            },
            {
                category: 'ui',
                description: 'Mapa de tiles renderizado con canvas',
            },
        ],
    },
];

// Helper functions
export function getLatestVersion(): string {
    return CHANGELOG[0]?.version || APP_CONFIG.version;
}

export function getLatestChangelog(): ChangelogEntry | undefined {
    return CHANGELOG[0];
}

export function getVersionDisplay(): string {
    return `v${APP_CONFIG.version}`;
}

export function getFullAppName(): string {
    return `${APP_CONFIG.name} ${getVersionDisplay()}`;
}

// Category display names and icons
export const CATEGORY_INFO: Record<ChangelogEntry['changes'][0]['category'], { label: string; icon: string; color: string }> = {
    feature: { label: 'Nueva Función', icon: '✨', color: '#22c55e' },
    balance: { label: 'Balance', icon: '⚖️', color: '#eab308' },
    bugfix: { label: 'Corrección', icon: '🐛', color: '#ef4444' },
    ui: { label: 'Interfaz', icon: '🎨', color: '#8b5cf6' },
    performance: { label: 'Rendimiento', icon: '⚡', color: '#3b82f6' },
};

export const TYPE_INFO: Record<ChangelogEntry['type'], { label: string; color: string }> = {
    major: { label: 'Mayor', color: '#ef4444' },
    minor: { label: 'Menor', color: '#f97316' },
    patch: { label: 'Parche', color: '#22c55e' },
    hotfix: { label: 'Hotfix', color: '#eab308' },
};

export const THEME_CONFIG = {
    fonts: {
        heading: 'var(--font-heading)',
        body: 'var(--font-body)',
    },
    colors: {
        // ROYAL MEDIEVAL DARK FANTASY - Authentic & Epic
        background: {
            primary: '#0c0a09',    // Stone Black
            secondary: '#1c1917',  // Dark Wood / Iron
            tertiary: '#292524',   // Deep Shadow
            card: 'rgba(28, 25, 23, 0.9)', // Opaque parchment overlay
        },
        text: {
            primary: '#e7e5e4',    // Warm Ivory (Paper)
            secondary: '#a8a29e',  // Stone Grey
            muted: '#57534e',      // Darker Stone
        },
        primary: {
            main: '#d4af37',       // Metallic Gold (Royal)
            hover: '#b5952f',
            light: '#fcd34d',      // Highlight Gold
        },
        secondary: {
            main: '#7f1d1d',       // Blood Red (War)
            hover: '#991b1b',
        },
        border: {
            light: 'rgba(212, 175, 55, 0.3)', // Gold Border
            medium: '#44403c',     // Iron Border
        }
    }
} as const;

