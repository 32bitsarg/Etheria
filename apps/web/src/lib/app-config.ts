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
    version: '0.0.7',
    description: 'Un juego de estrategia medieval en tiempo real',
    author: 'Etheria Team',
    website: 'https://etheria.game',
    icon: '/assets/ico.png',
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
                description: 'Nuevas alertas visuales (Toasts) inmediatas para Ataques Entrantes y Reportes de Batalla.',
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
        heading: '"Cinzel Decorative", serif',
        body: '"MedievalSharp", cursive',
        urls: [
            "https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&display=swap",
            "https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap"
        ]
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

