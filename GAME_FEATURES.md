# Características del Juego - Estado Actual

Este documento detalla todas las funcionalidades implementadas actualmente en la ruta `/game` del proyecto, así como recomendaciones para futuras implementaciones.

## 🏰 Funcionalidades Implementadas

### 1. Sistema de Juego Core
- **Autenticación y Sesión:**
  - Login seguro con `useAuth`.
  - Persistencia de sesión y recarga de estado de jugador.
  - Selección de raza inicial (Humano, Elfo, Orco, Enano) con bonifcaciones únicas.
- **Ciclo de Juego (Game Loop):**
  - Actualización en tiempo real (`processTick`) cada segundo.
  - Sincronización de recursos y colas con el servidor.

### 2. Interfaz de Usuario (UI/UX)
- **Barra Lateral Izquierda (Navegación):**
  - Estilo "Pilar Grepolis" (164px).
  - Medallón con avatar de raza y nivel.
  - Menú de navegación visual (Mensajes, Informes, Alianza, Clasificación, Perfil, Foro).
  - Panel de Configuración flotante (Volumen de música).
- **Barra Lateral Derecha (Comandos):**
  - Panel unificado flotante (164px).
  - **Cola de Construcción:** Visualización de edificios en mejora con tiempos y progreso.
  - **Cola de Entrenamiento:** Visualización de tropas en reclutamiento.
  - **Guarnición:** Lista de unidades estacionadas en la ciudad (`UnitsDisplay`).
- **HUD Superior (Recursos):**
  - Visualización en tiempo real de Madera, Hierro, Oro y Población.
  - Animación de conteo de recursos (`AnimatedResource`).
  - Indicadores de producción por hora.

### 3. Mapa y Ciudad
- **Visualización de Ciudad:**
  - `CityMap`: Mapa interactivo isométrico.
  - Renderizado de edificios en casillas específicas.
  - Interacción `click` para abrir panel de detalles del edificio.
- **Fondo:**
  - `TileMapCanvas`: Sistema de tiles renderizados en Canvas para el terreno circundante.

### 4. Gestión de Edificios (`BuildingPanel`)
- **Sistema de Mejora:**
  - Modal interactivo con pestañas.
  - Previsualización de costos y beneficios de la mejora (Producción, Población, Capacidad).
  - Validación de requisitos (Recursos, Población, Nivel de edificio padre).
  - Gestión de errores (Cola llena, recursos insuficientes).
- **Tipos Soportados:**
  - Ayuntamiento, Granja, Aserradero, Mina de Hierro, Mina de Oro, Almacén, Cuartel, Centro de Alianza.

### 5. Sistema Militar
- **Entrenamiento de Tropas (`BarracksPanel`):**
  - Integrado dentro del panel del Cuartel.
  - Selección de unidades para entrenar.
  - Costos y tiempos de entrenamiento.
- **Colas de Entrenamiento:**
  - Visualización de progreso en tiempo real.
  - Opción de cancelar o finalizar instantáneamente (cheat/dev).

### 6. Social
- **Chat Global:**
  - Chat en tiempo real visible en la pantalla de juego.
- **Música:**
  - Reproductor de música ambiental con control de volumen persistente.

---

## 🚧 Funcionalidades Faltantes o Parciales

1.  **Navegación Real del Menú Izquierdo:**
    - Los botones (Mensajes, Alianza, Clasificación, etc.) son visuales pero **no redirigen** a ninguna página ni abren modales funcionales.
2.  **Mapa del Mundo (World Map):**
    - Existe un tilemap de fondo, pero no hay una interfaz para "salir" de la ciudad y ver el mapa global con otros jugadores, recursos o enemigos.
3.  **Sistema de Batalla / Ataques:**
    - Puedes entrenar tropas, pero no hay interfaz para **enviarlas** a atacar o defender. No hay reportes de batalla.
4.  **Sistema de Alianzas:**
    - Existe el edificio "Centro de Alianza", pero no hay lógica ni UI para crear, unirse o gestionar alianzas.
5.  **Inventario / Héroe:**
    - No hay sistema de inventario de objetos ni gestión de un personaje "Héroe".

---

## 🚀 Recomendaciones y Próximos Pasos

### Prioridad Alta (Core Loop)
1.  **Mapa del Mundo Interactivo:**
    - Crear una vista de "Mapa" donde se vea la ciudad del jugador en una cuadrícula junto a otras ciudades (NPCs o jugadores).
    - Permitir hacer click en otras ciudades para ver opciones ("Atacar", "Espiar", "Comerciar").
2.  **Sistema de Misiones / Ataques:**
    - Implementar un modal de "Marchar" al seleccionar un objetivo en el mapa.
    - Selección de tropas a enviar.
    - Cálculo de tiempo de viaje y llegada.

### Prioridad Media (Profundidad)
3.  **Funcionalidad del Menú Izquierdo:**
    - Conectar el botón **Mensajes** a un sistema de correo interno básico.
    - Conectar **Informes** para mostrar resultados de batallas futuras.
4.  **Investigación (Academia):**
    - Añadir un edificio "Academia" para investigar tecnologías que desbloqueen mejores tropas (ej. Arqueros, Caballería) o bonos pasivos.

### Prioridad Baja (Polish)
5.  **Sistema de Inventario:**
    - Si el juego tendrá items, añadir un botón de "Mochila" o "Héroe" en el sidebar.
