# ⚔️ Etheria

![Etheria Banner](https://raw.githubusercontent.com/32bitsarg/Etheria/main/apps/web/public/assets/logo.png)

> **Etheria** es un juego de estrategia RPG premium para navegador con una estética de fantasía oscura. Lidera tu civilización desde un pequeño asentamiento hasta convertirla en un imperio legendario. Construye, gestiona recursos y conquista las tierras de Etheria.

---

## 🌌 Etheria

En un mundo envuelto en misterios antiguos y guerras constantes, cuatro grandes razas compiten por la dominancia. Elige tu camino y moldea el destino de tu pueblo.

### 🎭 Razas Ancestrales
- **🛡️ Humanos**: Maestros de la adaptación. Producción equilibrada y unidades militares versátiles.
- **🌿 Elfos**: Armonía con la naturaleza. Eficiencia superior en oro y combate a distancia especializado.
- **🌑 Orcos**: Fuerza bruta y hierro. Enfocados en la recolección agresiva de recursos e infantería pesada.
- **🏔️ Enanos**: Moldeadores de la tierra. Inigualables en la extracción de madera/hierro y fortificaciones defensivas.

---

## 🏰 Mecánicas Principales de Juego

Etheria combina estrategia profunda con progresión en tiempo real:

### 🛠️ Gestión de la Ciudad
- **Ciudad Isométrica Radial**: Un diseño de ciudad único y visualmente impactante donde cada edificio es parte de un ecosistema complejo.
- **Cola de Construcción**: Planificación estratégica con una cola secuencial de 3 espacios.
- **Recompensas Instantáneas**: Acelera tu progreso inicial con finalizaciones instantáneas para estructuras de bajo nivel.

### 💰 Economía en Tiempo Real
Experimenta una economía viva con generación de recursos actualizada cada segundo (`processTick`):
- **🌲 Madera**: La base de todas las estructuras.
- **⚙️ Hierro**: El núcleo de tu poder militar.
- **🪙 Oro**: La moneda para el comercio e investigaciones de alto nivel.
- **🍞 Población**: Tu recurso más preciado, motor de la mano de obra y la guerra.

### ⚔️ Militar y Conquista
- **Cuarteles y Entrenamiento**: Recluta unidades especializadas basadas en las fortalezas únicas de tu raza.
- **Sistema de Batalla**: Envía tropas para expandir tus fronteras, defender tu ciudad o saquear recursos enemigos.
- **Informes e Inteligencia**: Registros detallados de batalla y misiones de espionaje para mantenerte por delante de tus rivales.

---

## 🛠️ Arquitectura Técnica

Construido con una arquitectura de monorepo moderna y escalable:

### 💻 Stack Tecnológico
- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Estilos**: Vanilla CSS Modules (Estética Aero, fantasía oscura)
- **Backend**: API de Node.js con [Prisma ORM](https://www.prisma.io/)
- **Base de Datos**: PostgreSQL
- **Gestión de Estado**: Contexto de React / Hooks (`useAuth`, `useTheme`)
- **Gestor de Paquetes**: npm Workspaces

### 📂 Estructura del Espacio de Trabajo
```
/lootsystem
├── apps/
│   └── web/                # Aplicación Frontend Next.js
├── packages/
│   ├── game-engine/        # Lógica central del juego y procesamiento de ticks
│   ├── buildings/          # Datos de edificios, costos y fórmulas
│   ├── resources/          # Tipos de recursos y lógica de producción
│   ├── races/              # Rasgos y bonificaciones específicas de cada raza
│   └── combat/             # Simulación de batalla y estadísticas de unidades
└── docs/                   # Especificaciones técnicas de bajo nivel
```

---

## 🚀 Primeros Pasos

1. **Clonar el repositorio**
2. **Instalar dependencias**: `npm install`
3. **Configurar el entorno**: Configurar `.env.local` en `apps/web`
4. **Sincronizar esquema de base de datos**: `npx prisma db push`
5. **Ejecutar el servidor de desarrollo**: `npm run dev`

---

## 🎨 Identidad Visual
Etheria utiliza una estética **Dark Fantasy Aero**:
- **Glassmorphism**: Elementos de interfaz elegantes y semitransparentes.
- **HUD Dinámico**: Contadores de recursos animados en tiempo real.
- **Interfaz Temática**: La interfaz adapta sus visuales según la facción elegida.

---

*Desarrollado con ❤️ por el equipo de Etheria.*
