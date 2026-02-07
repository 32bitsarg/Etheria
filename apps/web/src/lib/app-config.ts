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
    version: '0.1.2',
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
        version: '0.1.2',
        date: '2026-02-07',
        title: 'Integridad Comercial y Estética Imperial',
        type: 'minor',
        changes: [
            {
                category: 'feature',
                description: 'Garantía Real de Tratos: Los fondos de las órdenes ahora se protegen instantáneamente para asegurar que cada intercambio se cumpla con honor.',
            },
            {
                category: 'feature',
                description: 'Decreto de Cancelación: Nueva autoridad para retirar ofertas del mercado y recuperar tus riquezas de forma inmediata.',
            },
            {
                category: 'ui',
                description: 'Pergamino de Confirmación Real: Sustitución de avisos genéricos por un diálogo imperial con estética de cristal para acciones críticas.',
            },
            {
                category: 'balance',
                description: 'Estabilización del Mercado: El Banco Imperial ahora interviene para asegurar precios justos y evitar oscilaciones extrañas causadas por pequeños mercaderes.',
            },
            {
                category: 'ui',
                description: 'Resaltado de Pertenencias: Tus ofertas en el mercado ahora brillan con un borde dorado, facilitando su gestión en el libro de comercio.',
            },
            {
                category: 'bugfix',
                description: 'Corrección de Identidad: Se ha resuelto un problema que impedía a algunos mercaderes reconocer sus propios tratos publicados.',
            },
            {
                category: 'ui',
                description: 'Mercado Móvil Refinado: Adaptación total del tablón de anuncios y el tablero de cambio para un uso táctil impecable.',
            },
            {
                category: 'ui',
                description: 'HUD de Tesorería Evolucionado: La barra superior ahora muestra Doblones y Éter con nuevos iconos imperiales, adaptándose a cualquier pantalla.',
            },
            {
                category: 'ui',
                description: 'Acabados Nobles: Implementación de texturas de cristal y cierres dorados en todos los paneles para una experiencia de juego superior.',
            },
        ],
    },
    {
        version: '0.1.1',
        date: '2026-02-06',
        title: 'Fluidez y Optimización de los Reinos',
        type: 'patch',
        changes: [
            {
                category: 'performance',
                description: 'Alquimia de Carga: El reino ahora carga un 90% más rápido gracias a un nuevo proceso de compresión de mapas e insignias.',
            },
            {
                category: 'performance',
                description: 'Fluidez de los Informes: Los pergaminos de batalla, mensajes y perfiles se despliegan ahora con mayor agilidad.',
            },
            {
                category: 'performance',
                description: 'Eficiencia Energética: Reducción del esfuerzo del dispositivo, ideal para ahorrar batería en largas campañas de conquista.',
            },
            {
                category: 'performance',
                description: 'Tipografía Noble: Los textos imperiales ahora son más legibles y se muestran al instante para una mejor comunicación.',
            },
            {
                category: 'bugfix',
                description: 'Restaurada la comunicación del pregonero real para el funcionamiento correcto del Chat Global.',
            },
        ],
    },
    {
        version: '0.1.0',
        date: '2026-02-05',
        title: 'Hito Alpha: Conquista Móvil y Sistemas de Guerra',
        type: 'major',
        changes: [
            {
                category: 'feature',
                description: 'Lanzamiento del Tablero Móvil: Gestiona tu imperio desde cualquier lugar con una interfaz diseñada exclusivamente para el mando táctil.',
            },
            {
                category: 'feature',
                description: 'Campaña Militar: Despliegue del motor de combate, informes detallados de escaramuzas y movimientos de tropas en tiempo real.',
            },
            {
                category: 'ui',
                description: 'Estética de Cristal (Glassmorphism): Nuevo lenguaje visual para los paneles del juego, equilibrando modernidad y ambientación medieval.',
            },
            {
                category: 'feature',
                description: 'Exploración Táctica: Control mejorado del Mapamundi con capacidad de arrastre fluido y centrado automático en tu capital.',
            },
            {
                category: 'performance',
                description: 'Reino Sin Fronteras: Adaptación universal para un juego fluido en ordenadores, tabletas y móviles por igual.',
            },
            {
                category: 'bugfix',
                description: 'Sincronización de Cuarteles: Corregido el retraso en los tiempos de entrenamiento de las tropas.',
            },
            {
                category: 'feature',
                description: 'Gestión Terrritorial: Implementación de límites de población por isla para evitar el hacinamiento y asegurar un crecimiento sano.',
            },
            {
                category: 'ui',
                description: 'Nuevos Instrumentos de Mapa: Rediseño de la brújula y coordenadas con un estilo más limpio y elegante.',
            },
            {
                category: 'feature',
                description: 'Decretos del Reino: Nuevo panel de ajustes para gestionar el sonido y las crónicas de tu imperio.',
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
        title: 'Protección Imperial y Estabilidad del Reino',
        type: 'major',
        changes: [
            {
                category: 'feature',
                description: 'Seguridad de Nivel Imperial: Implementado sistema de llaves cifradas para una protección total de vuestras cuentas.',
            },
            {
                category: 'feature',
                description: 'Estabilización de las Rutas del Reino: Todos los caminos reales han sido reforzados para garantizar viajes sin contratiempos.',
            },
            {
                category: 'ui',
                description: 'Nueva Ruta Real: El juego ahora reside bajo la URL /play, con accesos directos mejorados para los guerreros.',
            },
            {
                category: 'performance',
                description: 'Procesamiento Seguro de Tesorería: Los recursos y unidades se acreditan ahora con precisión infalible.',
            },
            {
                category: 'performance',
                description: 'Optimización de Registros Militares: Mejora en la velocidad de consulta de la clasificación y resoluciones de combate.',
            },
            {
                category: 'bugfix',
                description: 'Consolidación del Reino: Eliminadas zonas en construcción, dejando el imperio totalmente integrado y listo para la batalla.',
            },
        ],
    },
    {
        version: '0.0.8',
        date: '2026-02-05',
        title: 'Sistema de Rangos y Perfiles Reales',
        type: 'minor',
        changes: [
            {
                category: 'feature',
                description: 'Clasificación Global: Compite por el primer puesto en un ranking basado en tu verdadero Poder Militar.',
            },
            {
                category: 'feature',
                description: 'Perfiles de Guerrero: Ahora puedes consultar las hazañas, biografía y hazañas de cualquier otro comandante.',
            },
            {
                category: 'ui',
                description: 'Diseño de Pergamino: Implementada biografía con estilo medieval auténtico para vuestros perfiles.',
            },
            {
                category: 'feature',
                description: 'Integración Social: Acceso directo a perfiles desde el Mapamundi y la tabla de Clasificación.',
            },
            {
                category: 'performance',
                description: 'Cálculo de Poder Instantáneo: Tu posición en el ranking se actualiza ahora sin esperas.',
            },
            {
                category: 'ui',
                description: 'Notificaciones de Rango: Alertas visuales inmediatas al alcanzar nuevos niveles de veteranía.',
            },
        ],
    },
    {
        version: '0.0.7',
        date: '2026-02-04',
        title: 'Reacción en Tiempo Real y Cero Latencia',
        type: 'minor',
        changes: [
            {
                category: 'performance',
                description: 'Sincronización Inmediata: Los edificios y tropas se resuelven en el mismo instante en que se completa su tiempo.',
            },
            {
                category: 'feature',
                description: 'Mensajería Instantánea del Reino: Recibe avisos de combate y eventos al momento sin necesidad de mensajeros.',
            },
            {
                category: 'ui',
                description: 'Avisos de Combate Integrados: Nuevo diseño de pergamino lateral para notificaciones críticas.',
            },
            {
                category: 'ui',
                description: 'Gestión Inteligente de Avisos: Las noticias importantes son ahora más fáciles de leer y gestionar.',
            },
            {
                category: 'bugfix',
                description: 'Retorno de Tropas: Se ha asegurado que todos los guerreros vuelvan a casa y se acrediten tras las batallas.',
            },
            {
                category: 'feature',
                description: 'Correo Imperial: Implementado sistema de correspondencia privada entre todos los comandantes.',
            },
            {
                category: 'ui',
                description: 'Sidebar Renovado: Insignias y botones reales personalizados de alta resolución.',
            },
            {
                category: 'bugfix',
                description: 'Compatibilidad Universal: Mejoras para asegurar que el reino funcione en todos los navegadores modernos.',
            },
            {
                category: 'bugfix',
                description: 'Buscador de Destinatarios: Ahora es más sencillo contactar con otros señores por su nombre o el de su ciudad.',
            },
        ],
    },
    {
        version: '0.0.6',
        date: '2026-02-04',
        title: 'Mapamundi y Navegación',
        type: 'minor',
        changes: [
            {
                category: 'feature',
                description: 'Vasto Mapamundi: Explorad un océano con cientos de islas descubiertas por nuestros cartógrafos.',
            },
            {
                category: 'feature',
                description: 'Asentamientos del Archipiélago: Las islas ahora permiten la coexistencia de hasta 8 ciudades.',
            },
            {
                category: 'ui',
                description: 'Insignias de Alianza: Visualización clara de los estandartes aliados sobre el mapa.',
            },
            {
                category: 'ui',
                description: 'Océano Infinito: Navegación visual fluida sin cortes en el horizonte.',
            },
            {
                category: 'performance',
                description: 'Visión Selectiva: Mejora en la fluidez del mapa al centrarse solo en lo que vuestros ojos ven.',
            },
            {
                category: 'balance',
                description: 'Asignación Territorial Inteligente: Se ha mejorado el reparto de nuevos colonos para evitar tierras superpobladas.',
            },
        ],
    },
    {
        version: '0.0.5',
        date: '2026-02-04',
        title: 'Comunicación y Estabilidad',
        type: 'minor',
        changes: [
            {
                category: 'feature',
                description: 'Consejo de Alianza: Implementado chat privado para coordinar estrategias con vuestros aliados.',
            },
            {
                category: 'bugfix',
                description: 'Persistencia Real: Se ha asegurado que vuestra sesión se mantenga activa incluso tras largos periodos fuera.',
            },
            {
                category: 'bugfix',
                description: 'Mantenimiento Místico: Corregidos errores ocultos en las crónicas fundamentales del mundo.',
            },
            {
                category: 'ui',
                description: 'Crónica de Razas (Wiki): Rediseño visual de los conocimientos ancestrales sobre las 4 razas.',
            },
        ],
    },
    {
        version: '0.0.4',
        date: '2026-02-04',
        title: 'Forja de Alianzas',
        type: 'minor',
        changes: [
            {
                category: 'feature',
                description: 'Sistema de Alianzas: Autoridad total para crear, unirse y liderar grandes coaliciones en el reino.',
            },
            {
                category: 'ui',
                description: 'Centro de Alianzas: Nueva interfaz de gestión integrada directamente en el edificio correspondiente.',
            },
            {
                category: 'feature',
                description: 'Rangos de Hermandad: Gestión de jerarquías para líderes y miembros leales.',
            },
        ],
    },
    {
        version: '0.0.3',
        date: '2026-02-02',
        title: 'Seguridad y Arte de la Guerra',
        type: 'minor',
        changes: [
            {
                category: 'ui',
                description: 'Frontera de Acceso: Nuevo diseño para la entrada al reino con ilustraciones animadas.',
            },
            {
                category: 'feature',
                description: 'Protección de Cuentas: Implementado cifrado de alto nivel para las contraseñas reales.',
            },
            {
                category: 'feature',
                description: 'Arte de la Guerra: Implementación completa del entrenamiento militar y finalización instantánea por mérito.',
            },
            {
                category: 'balance',
                description: 'Logística Militar: Ajuste de suministros y tiempos para las tropas de vanguardia.',
            },
        ],
    },
    {
        version: '0.0.2',
        date: '2026-02-02',
        title: 'Prosperidad y Refinamiento visual',
        type: 'minor',
        changes: [
            {
                category: 'balance',
                description: 'Bonanza Económica: Aumentada la producción base de madera, hierro y oro en todas las aldeas.',
            },
            {
                category: 'balance',
                description: 'Crecimiento Exponencial: Las mejoras de edificios son ahora más gratificantes a niveles altos.',
            },
            {
                category: 'ui',
                description: 'Flujo de Riquezas: Los recursos ahora aumentan visualmente segundo a segundo.',
            },
            {
                category: 'ui',
                description: 'Censo de Pobladores: Visualización clara de los ciudadanos disponibles para vuestras labores.',
            },
        ],
    },
    {
        version: '0.0.1',
        date: '2026-02-02',
        title: 'Lanzamiento Inicial - Alpha Imperial',
        type: 'major',
        changes: [
            {
                category: 'feature',
                description: 'Gestión de Capital: Sistema de construcción con colas de producción realistas.',
            },
            {
                category: 'feature',
                description: 'Pilares del Reino: Gestión de Madera, Hierro, Oro y mano de obra aldeana.',
            },
            {
                category: 'feature',
                description: 'Arquitectura Radial: Mapa de ciudad con disposición circular de vuestros edificios.',
            },
            {
                category: 'feature',
                description: 'Mensajería Mágica: Chat global para hablar con comandantes de todo el archipiélago.',
            },
            {
                category: 'feature',
                description: 'Las 4 Grandes Razas: Elfos, Humanos, Orcos y Enanos listos para la batalla.',
            },
            {
                category: 'ui',
                description: 'Interfaz Clásica: Barra de mando superior inspirada en los grandes juegos de estrategia.',
            },
            {
                category: 'ui',
                description: 'Visión Nítida: Motor gráfico ligero para una representación fluida de vuestras tierras.',
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

