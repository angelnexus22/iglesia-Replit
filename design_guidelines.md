# Diseño de Aplicación Parroquial - Guías de Diseño

## Enfoque de Diseño

**Sistema Seleccionado:** Material Design adaptado con enfoque minimalista
**Justificación:** Aplicación utility-focused para gestión administrativa que prioriza accesibilidad, rendimiento en dispositivos básicos, y patrones probados para usuarios con diferentes niveles de habilidad técnica.

**Principios Clave:**
- Claridad sobre complejidad visual
- Accesibilidad universal (ancianos, usuarios de celulares básicos)
- Rendimiento extremo (cero animaciones innecesarias)
- Jerarquía clara de información

---

## Tipografía

**Familia de Fuentes:**
- Primary: System fonts stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`)
- Razón: Cero carga adicional, máxima compatibilidad, excelente legibilidad

**Escalas de Tamaño:**
- H1 (Títulos principales): text-3xl (30px) md:text-4xl (36px)
- H2 (Secciones): text-2xl (24px) md:text-3xl (30px)
- H3 (Subsecciones): text-xl (20px) md:text-2xl (24px)
- Body: text-base (16px) md:text-lg (18px)
- Small/Labels: text-sm (14px)
- Botones: text-base (16px) font-medium

**Peso:**
- Headers: font-semibold (600)
- Body: font-normal (400)
- Énfasis: font-medium (500)

---

## Sistema de Espaciado

**Unidades Primarias Tailwind:** 2, 4, 6, 8, 12, 16
- Espaciado micro (entre elementos relacionados): p-2, gap-2
- Espaciado estándar (campos de formulario, cards): p-4, gap-4, mb-4
- Espaciado de sección: py-8, px-6
- Espaciado grande (entre secciones): mb-12, py-16

**Contenedores:**
- Ancho máximo para contenido: max-w-7xl mx-auto px-4
- Formularios y tablas: max-w-4xl mx-auto
- Paneles laterales: w-64 o w-80

---

## Layout Principal

**Estructura de Aplicación:**

1. **Header Fijo** (h-16 sticky top-0)
   - Logo/nombre parroquia (izquierda)
   - Nombre de usuario y rol (derecha)
   - Indicador de estado: "Sin conexión" / "Conectado"
   - Botón menú hamburguesa (móvil)

2. **Navegación Lateral** (Desktop: w-64, Mobile: drawer)
   - Iconos + texto para cada sección
   - Agrupación lógica: Personas, Sacramentos, Grupos, Eventos, Administración
   - Navegación persistente en desktop
   - Touch targets mínimo: h-12

3. **Área de Contenido Principal** (flex-1 p-6 overflow-y-auto)
   - Breadcrumbs superiores
   - Título de página (H1)
   - Acciones principales (botones grandes)
   - Contenido (tablas, formularios, cards)

4. **Footer Simple**
   - Estado de última sincronización
   - Versión de aplicación
   - Espacio parroquial/diocesano

**Grid Responsivo:**
- Mobile: grid-cols-1 (todo apilado)
- Tablet: grid-cols-2 (formularios, cards)
- Desktop: grid-cols-3 o grid-cols-4 (solo para galerías de cards pequeñas)

---

## Componentes Principales

### Formularios
- Labels encima de inputs: block mb-2 font-medium
- Inputs: w-full px-4 py-3 border rounded-lg (touch-friendly height)
- Grupos de campo: mb-6
- Botones submit: w-full md:w-auto px-8 py-3 rounded-lg font-medium
- Validación inline con mensajes claros

### Tablas
- Responsive: scroll horizontal en móvil
- Headers sticky: sticky top-0
- Filas: hover state sutil, cursor pointer cuando clickeable
- Acciones: iconos o menú de tres puntos
- Paginación simple: botones grandes "Anterior" / "Siguiente"

### Cards
- Padding generoso: p-6
- Bordes suaves: rounded-lg border
- Separación: gap-6 en grid
- Header con título e icono
- Footer con acciones primarias

### Botones
- Primario: px-6 py-3 rounded-lg font-medium (fill completo)
- Secundario: px-6 py-3 rounded-lg border-2 (outline)
- Tamaño touch mínimo: h-12
- Iconos: mr-2 cuando acompañan texto

### Navegación por Pestañas
- Tabs horizontales: border-b con indicador activo
- Touch target: px-6 py-4
- Scroll horizontal en móvil si necesario

### Modales/Diálogos
- Overlay oscuro
- Contenedor centrado: max-w-lg
- Header con título y botón cerrar (X grande)
- Footer con acciones (Cancelar/Confirmar)
- Scrollable si contenido largo

### Estados Vacíos
- Icono grande ilustrativo
- Mensaje claro: "No hay registros todavía"
- Botón de acción: "Agregar primer registro"

---

## Iconografía

**Biblioteca:** Heroicons (via CDN)
**Tamaños:**
- Navegación/acciones: w-6 h-6
- Botones inline: w-5 h-5
- Estados vacíos: w-16 h-16 o w-24 h-24

**Uso Consistente:**
- Usuarios: user-icon
- Grupos: user-group-icon
- Eventos: calendar-icon
- Sacramentos: document-text-icon
- Configuración: cog-icon

---

## Consideraciones de Rendimiento

**Restricciones Críticas:**
- CERO animaciones decorativas
- Transiciones solo para feedback: duration-150 (hover, focus)
- Imágenes: lazy loading, compresión agresiva
- Sin videos o media pesada
- JavaScript mínimo, progressive enhancement

**Optimización Offline:**
- Indicadores claros de estado guardado
- Mensajes de sincronización pendiente
- Botones de exportar/importar prominentes

---

## Imágenes

**Hero/Banner:**
NO incluir hero image tradicional. Es una aplicación administrativa, no sitio promocional.

**Fotografías de Uso:**
- Avatar placeholder para usuarios sin foto: iniciales en círculo
- Logo parroquial: pequeño (h-10) en header
- Estados vacíos: ilustraciones SVG simples (opcional, no crítico)

**Prioridad:** Funcionalidad sobre estética. Contenido textual y funcional es el protagonista.

---

## Accesibilidad

- Contraste mínimo WCAG AA
- Labels asociados con inputs (for/id)
- Focus visible en todos los interactivos: focus:ring-2
- Skip links para navegación por teclado
- ARIA labels en iconos sin texto
- Tamaños de fuente escalables (rem units)
- Touch targets mínimo 44x44px