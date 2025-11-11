# 🚀 Plan de Mejoras - 5 Días Intensivos

**Objetivo:** Implementar las funcionalidades más críticas para hacer el sistema robusto, completo y listo para producción en Replit.

**Fecha inicio:** Noviembre 11, 2025
**Fecha fin:** Noviembre 15, 2025
**Metodología:** Desarrollo incremental con testing continuo

---

## 📋 RESUMEN EJECUTIVO

### Funcionalidades a Implementar

**Día 1 - Fundamentos Críticos:**
- ✅ Sistema de respaldo/exportación USB
- ✅ Keep-alive para Replit
- ✅ Health check endpoint

**Día 2 - Resiliencia y Vista General:**
- ✅ Reconexión automática y manejo de conexión intermitente
- ✅ Dashboard general parroquial
- ✅ Indicadores de conectividad

**Día 3 - Productividad:**
- ✅ Búsqueda global (Cmd+K)
- ✅ Notificaciones y recordatorios internos
- ✅ Modo oscuro
- ✅ Mejoras de accesibilidad básicas

**Día 4 - Reportes y Datos:**
- ✅ Reportes mejorados con exportación PDF
- ✅ Importación masiva desde Excel
- ✅ Calendario litúrgico básico

**Día 5 - Optimización y Testing:**
- ✅ Optimizaciones de rendimiento
- ✅ Testing E2E completo
- ✅ Gestión de usuarios mejorada
- ✅ Documentación final

---

## 🗓️ DÍA 1: FUNDAMENTOS CRÍTICOS (Lunes)

### Objetivos del Día
Implementar las funcionalidades críticas para que el sistema no pierda datos y funcione correctamente en Replit.

---

### SESIÓN 1.1: Sistema de Respaldo USB (3-4 horas)

**Prompt para Claude:**
```
Necesito implementar un sistema completo de respaldo y restauración de datos para mi aplicación parroquial en Replit.

REQUISITOS:
1. Exportación completa de TODAS las tablas de la BD a un archivo JSON
2. Descarga directa del archivo JSON al navegador del usuario
3. Importación desde archivo JSON con validación
4. Manejo de errores y confirmaciones
5. Interfaz en la página /respaldo (ya existe placeholder)

ESTRUCTURA QUE DEBE TENER:
- Endpoint POST /api/respaldo/exportar que devuelva JSON con todas las tablas
- Endpoint POST /api/respaldo/importar que reciba file y lo procese
- Función para validar integridad del JSON antes de importar
- Estrategia de importación: reemplazar datos existentes (con confirmación)
- Progress indicators en la UI
- Logs de lo que se importó/exportó

TABLAS A INCLUIR:
- users, feligreses, sacramentos, grupos, miembros_grupo
- eventos, voluntarios, categorias_financieras, transacciones
- articulos_inventario, movimientos_inventario, prestamos

La interfaz debe ser simple con:
- Botón "Exportar Todo" → descarga JSON
- Área de drag & drop para subir archivo JSON
- Preview de datos antes de importar
- Botón "Importar" con confirmación de que reemplazará datos

Por favor implementa toda la funcionalidad backend y frontend completa.
```

**Archivos a crear/modificar:**
- `server/routes.ts` - Nuevos endpoints de respaldo
- `server/utils/backup.ts` - Lógica de exportación/importación
- `client/src/pages/respaldo.tsx` - Interfaz completa
- `client/src/components/ui/file-upload.tsx` - Componente de drag & drop

**Testing:**
- Exportar datos con seed data
- Verificar integridad del JSON
- Importar en BD vacía
- Importar con datos existentes

---

### SESIÓN 1.2: Keep-Alive y Health Check (1-2 horas)

**Prompt para Claude:**
```
Necesito implementar un sistema de keep-alive para evitar que mi aplicación en Replit se duerma por inactividad.

REQUISITOS:
1. Endpoint GET /api/health que devuelva status del servidor y conexión a BD
2. Ping automático cada 5 minutos desde el frontend
3. Indicador visual en el header del estado del servidor (conectado/desconectado)
4. Configuración para UptimeRobot (documentación de cómo configurarlo)

IMPLEMENTACIÓN:
Backend:
- Crear endpoint /api/health que haga:
  - Verificar conexión a PostgreSQL
  - Devolver { status: 'ok', database: 'connected', timestamp: Date.now() }
  - Si falla la BD: { status: 'error', database: 'disconnected', error: message }

Frontend:
- Hook useHealthCheck que haga ping cada 5 minutos
- Mostrar badge en el header: verde (online) / rojo (offline) / amarillo (degradado)
- Reintentar conexión automáticamente si falla

Documentación:
- Crear docs/CONFIGURACION-REPLIT.md con:
  - Cómo configurar UptimeRobot para hacer ping cada 5 min
  - Variables de entorno necesarias
  - Troubleshooting común

Por favor implementa todo.
```

**Archivos a crear/modificar:**
- `server/routes.ts` - Endpoint /api/health
- `client/src/hooks/use-health-check.tsx` - Hook de monitoreo
- `client/src/components/connection-status.tsx` - Badge de estado
- `client/src/components/app-sidebar.tsx` - Integrar badge
- `docs/CONFIGURACION-REPLIT.md` - Nueva documentación

**Testing:**
- Health check responde correctamente
- Badge cambia de color según estado
- Ping automático funciona
- Reconexión tras desconexión

---

### SESIÓN 1.3: Testing del Día 1 (1 hora)

**Prompt para Claude:**
```
Necesito crear tests E2E para las funcionalidades que acabamos de implementar:

TESTS A CREAR:
1. Test de exportación de respaldo:
   - Login como párroco
   - Ir a /respaldo
   - Click en "Exportar Todo"
   - Verificar que se descarga archivo JSON
   - Validar estructura del JSON

2. Test de importación de respaldo:
   - Login como párroco
   - Ir a /respaldo
   - Subir archivo JSON de respaldo
   - Confirmar importación
   - Verificar que los datos se importaron correctamente

3. Test de health check:
   - Verificar que /api/health responde
   - Verificar que badge de conexión aparece
   - Simular desconexión y verificar que badge cambia

Usa Playwright para los tests. Guárdalos en un archivo que pueda ejecutar.
```

**Entregables del Día 1:**
- ✅ Sistema de respaldo completo y funcional
- ✅ Keep-alive implementado
- ✅ Documentación de configuración Replit
- ✅ Tests E2E pasando

---

## 🗓️ DÍA 2: RESILIENCIA Y DASHBOARD (Martes)

### Objetivos del Día
Hacer el sistema resiliente a conexiones intermitentes y crear un dashboard general.

---

### SESIÓN 2.1: Reconexión Automática (2-3 horas)

**Prompt para Claude:**
```
Necesito implementar un sistema robusto de manejo de conexiones intermitentes para mi aplicación en Replit.

REQUISITOS:
1. Guardar datos de formularios en localStorage antes de enviar
2. Reintentar automáticamente peticiones fallidas (exponential backoff)
3. Cola de operaciones pendientes cuando no hay conexión
4. Indicador visual de estado de conexión (online/offline/sincronizando)
5. Mensajes claros al usuario sobre el estado

IMPLEMENTACIÓN:

1. Hook useOnlineStatus:
   - Detectar cuando se pierde/recupera conexión
   - Listener de eventos online/offline
   - Ping periódico al servidor

2. Wrapper de fetch con retry:
   - Interceptar todos los fetch
   - Reintentar 3 veces con backoff: 1s, 2s, 4s
   - Si falla todo, agregar a cola de pendientes
   - Cuando se recupere conexión, procesar cola

3. LocalStorage para formularios:
   - Auto-guardar cada 10 segundos
   - Recuperar al recargar página
   - Limpiar al enviar exitosamente

4. UI de estado de conexión:
   - Banner en top cuando está offline
   - Toast al recuperar conexión
   - Indicador de "operaciones pendientes: X"
   - Botón para reintentar manualmente

5. Integración con TanStack Query:
   - Configurar retry automático
   - Manejo de errores de red
   - Refetch al reconectar

Por favor implementa todo el sistema completo.
```

**Archivos a crear/modificar:**
- `client/src/hooks/use-online-status.tsx` - Detección de conexión
- `client/src/lib/offline-queue.ts` - Cola de operaciones
- `client/src/lib/fetch-wrapper.ts` - Fetch con retry
- `client/src/lib/form-storage.ts` - Persistencia de formularios
- `client/src/components/connection-banner.tsx` - Banner offline
- `client/src/lib/queryClient.ts` - Configurar retry en TanStack Query
- `client/src/App.tsx` - Integrar banner

**Testing:**
- Simular pérdida de conexión
- Verificar que formularios se guardan
- Verificar retry automático
- Verificar cola de pendientes

---

### SESIÓN 2.2: Dashboard General Parroquial (2-3 horas)

**Prompt para Claude:**
```
Necesito crear un dashboard general parroquial que sea la página principal al entrar al sistema.

REQUISITOS:
Mostrar vista general de TODA la actividad parroquial con las siguientes secciones:

1. RESUMEN RÁPIDO (Cards en grid):
   - Total de feligreses activos
   - Eventos este mes
   - Balance financiero del mes
   - Sacramentos este mes

2. PRÓXIMOS EVENTOS (Widget de calendario):
   - Lista de próximos 5 eventos
   - Fecha, nombre, tipo
   - Link para ver detalle

3. ALERTAS IMPORTANTES (Notificaciones):
   - Stock bajo en inventario (items bajo el mínimo)
   - Préstamos vencidos no devueltos
   - Eventos de mañana/hoy
   - Badge con número de alertas

4. RESUMEN FINANCIERO (Mini gráfica):
   - Ingresos vs egresos este mes
   - Gráfica de barras pequeña
   - Link a dashboard financiero completo

5. ACTIVIDAD RECIENTE (Timeline):
   - Últimos 5 sacramentos registrados
   - Últimas 5 transacciones
   - Timestamp relativo (hace 2 días, etc.)

6. CUMPLEAÑOS Y ANIVERSARIOS:
   - Cumpleaños de esta semana
   - Aniversarios de matrimonio este mes

LAYOUT:
- Grid responsivo 12 columnas
- Mobile: stack vertical
- Desktop: 3 columnas
- Usar cards de shadcn/ui

ENDPOINTS NECESARIOS:
- GET /api/dashboard/stats - Devuelve todos los números
- GET /api/dashboard/alertas - Devuelve alertas activas
- GET /api/dashboard/actividad-reciente - Timeline

Esta página debe ser la ruta "/" (actualmente va a login, cambiar eso).

Por favor implementa todo el dashboard completo con todos los widgets.
```

**Archivos a crear/modificar:**
- `server/routes.ts` - Endpoints de dashboard
- `client/src/pages/dashboard-general.tsx` - Nuevo dashboard principal
- `client/src/components/dashboard/stats-cards.tsx` - Cards de resumen
- `client/src/components/dashboard/proximos-eventos.tsx` - Widget de eventos
- `client/src/components/dashboard/alertas-widget.tsx` - Widget de alertas
- `client/src/components/dashboard/actividad-reciente.tsx` - Timeline
- `client/src/components/dashboard/cumpleanos-widget.tsx` - Cumpleaños
- `client/src/App.tsx` - Cambiar ruta "/" a dashboard

**Testing:**
- Todos los widgets renderizan correctamente
- Links funcionan
- Alertas se muestran
- Responsive funciona

---

### SESIÓN 2.3: Testing del Día 2 (1 hora)

**Prompt para Claude:**
```
Crear tests E2E para:
1. Reconexión automática tras pérdida de conexión
2. Cola de pendientes funciona
3. Dashboard general renderiza todos los widgets
4. Alertas se muestran correctamente
5. Links del dashboard funcionan

Usa Playwright.
```

**Entregables del Día 2:**
- ✅ Sistema de reconexión automática funcionando
- ✅ Dashboard general completo
- ✅ Tests E2E pasando

---

## 🗓️ DÍA 3: PRODUCTIVIDAD (Miércoles)

### Objetivos del Día
Mejorar la experiencia de usuario y productividad con búsqueda, notificaciones y modo oscuro.

---

### SESIÓN 3.1: Búsqueda Global (2-3 horas)

**Prompt para Claude:**
```
Necesito implementar un sistema de búsqueda global con command palette para navegar rápidamente por toda la aplicación.

REQUISITOS:
1. Command palette con shortcut Cmd+K / Ctrl+K
2. Buscar en todas las entidades principales
3. Navegación rápida entre páginas
4. Resultados en tiempo real

FUNCIONALIDADES:

1. Búsqueda en entidades:
   - Feligreses (por nombre completo)
   - Eventos (por título)
   - Transacciones (por descripción)
   - Grupos (por nombre)
   - Artículos de inventario (por nombre)
   - Sacramentos (por nombre de feligrés)

2. Navegación rápida:
   - Ir a Feligreses
   - Ir a Sacramentos
   - Ir a Contabilidad
   - etc. (todas las páginas)

3. Acciones rápidas:
   - Nuevo Feligrés
   - Nueva Transacción
   - Nuevo Evento
   - Exportar Respaldo

IMPLEMENTACIÓN:
- Usar librería cmdk (ya está instalada)
- Endpoint GET /api/search?q=query que busque en todas las tablas
- Límite de 50 resultados totales (10 por categoría)
- Debounce de 300ms en input
- Highlight del texto buscado
- Íconos por tipo de resultado
- Preview del resultado (nombre + info adicional)

UI:
- Modal centrado con fondo oscurecido
- Input grande en top
- Lista de resultados agrupados por categoría
- Navegación con flechas arriba/abajo
- Enter para seleccionar
- Esc para cerrar

Por favor implementa todo el sistema de búsqueda completo.
```

**Archivos a crear/modificar:**
- `server/routes.ts` - Endpoint /api/search
- `client/src/components/search/command-palette.tsx` - Modal de búsqueda
- `client/src/components/search/search-results.tsx` - Lista de resultados
- `client/src/App.tsx` - Integrar shortcut global
- `client/src/hooks/use-command-palette.tsx` - Hook para abrir/cerrar

**Testing:**
- Búsqueda encuentra resultados correctos
- Shortcuts funcionan
- Navegación con teclado funciona
- Acciones rápidas funcionan

---

### SESIÓN 3.2: Notificaciones y Recordatorios (2 horas)

**Prompt para Claude:**
```
Necesito implementar un sistema de notificaciones y recordatorios internos (no push, solo dentro de la app).

REQUISITOS:

1. TIPOS DE ALERTAS:
   - 📦 Stock bajo (artículos que llegaron al stock mínimo)
   - 🎂 Cumpleaños esta semana
   - 📅 Eventos próximos (en 3 días o menos)
   - 💸 Préstamos vencidos no devueltos
   - 💾 Recordatorio de respaldo semanal (si pasaron 7 días)

2. UI DE NOTIFICACIONES:
   - Icono de campana en header con badge de contador
   - Dropdown con lista de notificaciones al hacer click
   - Cada notificación tiene:
     - Icono según tipo
     - Título
     - Descripción corta
     - Timestamp relativo (hace 2 días)
     - Link a la acción relevante
   - Botón "Marcar todas como leídas"
   - Notificaciones se mantienen hasta ser leídas

3. BACKEND:
   - Endpoint GET /api/notificaciones que calcule alertas en tiempo real
   - Endpoint POST /api/notificaciones/marcar-leida/:id
   - Endpoint POST /api/notificaciones/marcar-todas-leidas

4. PERSISTENCIA:
   - Tabla nueva: notificaciones (id, tipo, titulo, descripcion, leida, feligresId/eventoId/etc, createdAt)
   - Generar automáticamente al detectar condiciones
   - No duplicar notificaciones del mismo tipo para la misma entidad

5. LÓGICA DE GENERACIÓN:
   - Correr al hacer GET /api/notificaciones
   - Revisar todas las condiciones
   - Crear notificaciones si no existen

Por favor implementa todo el sistema de notificaciones.
```

**Archivos a crear/modificar:**
- `shared/schema.ts` - Tabla notificaciones
- `server/routes.ts` - Endpoints de notificaciones
- `server/utils/notification-generator.ts` - Lógica de generación
- `client/src/components/notifications/notification-bell.tsx` - Icono en header
- `client/src/components/notifications/notification-dropdown.tsx` - Dropdown
- `client/src/components/notifications/notification-item.tsx` - Item individual
- `client/src/components/app-sidebar.tsx` - Integrar bell

**Testing:**
- Notificaciones se generan correctamente
- Badge muestra número correcto
- Marcar como leídas funciona
- Links llevan a lugar correcto

---

### SESIÓN 3.3: Modo Oscuro + Accesibilidad Básica (2 horas)

**Prompt para Claude:**
```
Necesito implementar modo oscuro y mejoras básicas de accesibilidad.

PARTE 1: MODO OSCURO

REQUISITOS:
1. Toggle de tema claro/oscuro en header
2. Persistir preferencia en localStorage
3. Respetar preferencia del sistema (prefers-color-scheme)
4. Transición suave entre temas
5. Todos los componentes deben verse bien en modo oscuro

IMPLEMENTACIÓN:
- Tailwind ya tiene soporte dark:
- Usar estrategia 'class'
- ThemeProvider con Context API
- Toggle sun/moon icon (lucide-react)
- Agregar clases dark: a todos los componentes que lo necesiten

PARTE 2: MEJORAS DE ACCESIBILIDAD

REQUISITOS:
1. Focus indicators visibles en todos los elementos interactivos
2. Navegación por teclado funcional en formularios
3. Labels apropiados en todos los inputs (si falta alguno)
4. Contraste de colores mejorado (WCAG AA mínimo)
5. ARIA labels donde sea necesario

IMPLEMENTACIÓN:
- Agregar outline visible en focus
- Revisar que todos los botones tengan aria-label si solo tienen ícono
- Revisar tabs/dialogs tengan aria correctos
- Mejorar contrastes de texto si es necesario

Por favor implementa modo oscuro completo y las mejoras de accesibilidad.
```

**Archivos a crear/modificar:**
- `client/src/contexts/theme-context.tsx` - Context de tema
- `client/src/components/theme-toggle.tsx` - Toggle button
- `client/src/App.tsx` - Wrap con ThemeProvider
- `client/src/components/app-sidebar.tsx` - Integrar toggle
- `client/src/index.css` - Estilos de focus y dark mode
- Revisar todos los componentes para dark mode

**Testing:**
- Modo oscuro funciona en toda la app
- Toggle persiste preferencia
- Focus visible en todos los elementos
- Navegación por teclado funciona

---

### SESIÓN 3.4: Testing del Día 3 (1 hora)

**Prompt para Claude:**
```
Crear tests E2E para:
1. Command palette abre con Cmd+K
2. Búsqueda encuentra resultados
3. Notificaciones se muestran y marcan como leídas
4. Modo oscuro cambia y persiste
5. Navegación por teclado funciona

Usa Playwright.
```

**Entregables del Día 3:**
- ✅ Búsqueda global funcionando
- ✅ Sistema de notificaciones activo
- ✅ Modo oscuro implementado
- ✅ Mejoras de accesibilidad
- ✅ Tests E2E pasando

---

## 🗓️ DÍA 4: REPORTES Y DATOS (Jueves)

### Objetivos del Día
Implementar reportes avanzados, importación de datos y calendario litúrgico.

---

### SESIÓN 4.1: Reportes Mejorados con PDF (3 horas)

**Prompt para Claude:**
```
Necesito implementar un sistema completo de reportes profesionales con exportación a PDF.

REQUISITOS:

1. TIPOS DE REPORTES:

   A) Reporte Financiero Mensual (PDF):
      - Período seleccionable (mes/año)
      - Logo de la parroquia
      - Resumen ejecutivo (ingresos, egresos, balance)
      - Tabla de ingresos por categoría
      - Tabla de egresos por categoría
      - Gráfica de pastel de distribución
      - Pie de página con firma del párroco

   B) Reporte de Sacramentos (PDF):
      - Período seleccionable
      - Estadísticas por tipo de sacramento
      - Lista detallada de sacramentos
      - Tabla con: fecha, tipo, feligrés, ministro
      - Total por tipo

   C) Reporte de Inventario (PDF):
      - Todos los artículos con stock actual
      - Alertas de stock bajo destacadas en rojo
      - Valor total del inventario
      - Agrupado por categoría

   D) Reporte Anual para Obispado (PDF):
      - Resumen completo del año
      - Total de feligreses activos
      - Sacramentos administrados (por tipo)
      - Resumen financiero anual
      - Eventos realizados
      - Grupos activos
      - Formato oficial de múltiples páginas

2. INTERFAZ:
   - Nueva página /reportes
   - Selector de tipo de reporte
   - Filtros según el reporte (fecha inicio/fin, categoría, etc.)
   - Botón "Generar PDF"
   - Preview opcional antes de descargar
   - También exportar a Excel (CSV) como alternativa

3. BACKEND:
   - Endpoint GET /api/reportes/financiero-pdf?inicio=YYYY-MM-DD&fin=YYYY-MM-DD
   - Endpoint GET /api/reportes/sacramentos-pdf?inicio=YYYY-MM-DD&fin=YYYY-MM-DD
   - Endpoint GET /api/reportes/inventario-pdf
   - Endpoint GET /api/reportes/anual-pdf?ano=2025
   - Usar PDFKit (ya instalado)
   - Incluir gráficas como imágenes (chart.js en backend o canvas)

Por favor implementa todos los reportes con PDFs profesionales.
```

**Archivos a crear/modificar:**
- `server/routes.ts` - Endpoints de reportes
- `server/utils/reportes/financiero-pdf.ts` - Generador PDF financiero
- `server/utils/reportes/sacramentos-pdf.ts` - Generador PDF sacramentos
- `server/utils/reportes/inventario-pdf.ts` - Generador PDF inventario
- `server/utils/reportes/anual-pdf.ts` - Generador PDF anual
- `client/src/pages/reportes.tsx` - Nueva página de reportes
- `client/src/components/reportes/reporte-selector.tsx` - Selector de tipo
- `client/src/components/reportes/filtros-reporte.tsx` - Filtros

**Testing:**
- PDFs se generan correctamente
- Filtros funcionan
- Datos correctos en reportes
- Formato profesional

---

### SESIÓN 4.2: Importación Masiva desde Excel (2-3 horas)

**Prompt para Claude:**
```
Necesito implementar un sistema de importación masiva desde archivos Excel/CSV para migración inicial.

REQUISITOS:

1. ENTIDADES A IMPORTAR:
   - Feligreses
   - Transacciones financieras
   - Artículos de inventario
   - Eventos

2. FLUJO DE IMPORTACIÓN:
   - Usuario descarga plantilla Excel vacía
   - Usuario llena plantilla con sus datos
   - Usuario sube archivo
   - Sistema valida datos fila por fila
   - Sistema muestra preview de lo que se va a importar
   - Usuario confirma
   - Sistema importa y muestra resumen (exitosos, omitidos, errores)

3. VALIDACIONES:
   - Tipos de datos correctos
   - Campos requeridos presentes
   - Fechas en formato válido
   - Referencias válidas (ej: categoría existe)
   - Duplicados (opcional skip)

4. PLANTILLAS:
   - Template para feligreses: nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, telefono, email, direccion
   - Template para transacciones: tipo, categoria, monto, fecha, descripcion, metodoPago
   - Template para inventario: nombre, categoria, stockActual, stockMinimo, unidadMedida, ubicacion
   - Template para eventos: nombre, tipo, fecha, hora, lugar, responsable

5. IMPLEMENTACIÓN:
   - Librería papaparse (ya instalada) para parsear CSV
   - Endpoint POST /api/importar/feligreses (recibe CSV)
   - Endpoint POST /api/importar/transacciones
   - Endpoint POST /api/importar/inventario
   - Endpoint POST /api/importar/eventos
   - Endpoint GET /api/importar/plantilla/:tipo (descarga CSV vacío)

6. UI:
   - Nueva página /importar
   - Selector de tipo de entidad
   - Botón "Descargar Plantilla"
   - Drag & drop para subir CSV
   - Tabla de preview con los datos parseados
   - Indicadores de validación (✓ válido, ✗ error)
   - Lista de errores con número de fila
   - Botón "Importar" (deshabilitado si hay errores)
   - Progress bar durante importación
   - Resumen final: X importados, Y omitidos, Z errores

Por favor implementa todo el sistema de importación completo.
```

**Archivos a crear/modificar:**
- `server/routes.ts` - Endpoints de importación
- `server/utils/import/csv-parser.ts` - Parser de CSV
- `server/utils/import/validators.ts` - Validadores
- `server/utils/import/feligreses-importer.ts` - Importador de feligreses
- `server/utils/import/transacciones-importer.ts` - Importador de transacciones
- `client/src/pages/importar.tsx` - Página de importación
- `client/src/components/import/plantilla-downloader.tsx` - Descarga plantillas
- `client/src/components/import/csv-uploader.tsx` - Upload de CSV
- `client/src/components/import/import-preview.tsx` - Preview de datos

**Testing:**
- Plantillas se descargan correctamente
- CSV se parsea correctamente
- Validaciones funcionan
- Importación exitosa
- Errores se manejan bien

---

### SESIÓN 4.3: Calendario Litúrgico Básico (1-2 horas)

**Prompt para Claude:**
```
Necesito agregar un widget de calendario litúrgico en el dashboard general.

REQUISITOS:

1. MOSTRAR:
   - Santo del día
   - Lectura del día (cita bíblica)
   - Tiempo litúrgico (Adviento, Navidad, Cuaresma, Pascua, Ordinario)
   - Color litúrgico
   - Festividades especiales del día

2. FUENTE DE DATOS:
   - Crear archivo JSON con festividades del año 2025-2026
   - Incluir santos principales
   - Incluir tiempos litúrgicos con fechas
   - Referencias a lecturas (solo citas, no texto completo)

3. IMPLEMENTACIÓN:
   - Archivo estático client/src/data/calendario-liturgico.json
   - Función getCalendarioDelDia(fecha) que devuelve info del día
   - Widget en dashboard general que muestra el día actual
   - No requiere API externa (para funcionar offline)

4. DATOS A INCLUIR:
   - Fiestas de guardar
   - Santos patronos de México
   - Solemnidades
   - Tiempo ordinario
   - Colores litúrgicos por domingo

5. UI:
   - Card en dashboard con:
     - Fecha actual
     - Santo del día
     - Color litúrgico (como badge de color)
     - Lectura del día (cita)
     - Tiempo litúrgico actual

Por favor implementa el calendario litúrgico básico.
```

**Archivos a crear/modificar:**
- `client/src/data/calendario-liturgico.json` - Datos del calendario
- `client/src/lib/calendario-liturgico.ts` - Función de búsqueda
- `client/src/components/dashboard/calendario-liturgico-widget.tsx` - Widget
- `client/src/pages/dashboard-general.tsx` - Integrar widget

**Testing:**
- Widget renderiza correctamente
- Datos del día actual son correctos
- Colores litúrgicos se muestran

---

### SESIÓN 4.4: Testing del Día 4 (1 hora)

**Prompt para Claude:**
```
Crear tests E2E para:
1. Generación de reportes PDF
2. Importación de CSV
3. Validación de datos en importación
4. Calendario litúrgico muestra datos correctos

Usa Playwright.
```

**Entregables del Día 4:**
- ✅ Reportes profesionales con PDF
- ✅ Sistema de importación completo
- ✅ Calendario litúrgico funcionando
- ✅ Tests E2E pasando

---

## 🗓️ DÍA 5: OPTIMIZACIÓN Y CIERRE (Viernes)

### Objetivos del Día
Optimizar rendimiento, completar testing, gestión de usuarios y documentación final.

---

### SESIÓN 5.1: Optimizaciones de Rendimiento (2-3 horas)

**Prompt para Claude:**
```
Necesito optimizar el rendimiento de la aplicación para dispositivos de gama baja y conexiones lentas.

OPTIMIZACIONES A IMPLEMENTAR:

1. CODE SPLITTING Y LAZY LOADING:
   - Lazy load de todas las páginas (React.lazy)
   - Lazy load de componentes pesados (charts, PDFs)
   - Suspense con fallback de loading
   - Prefetch de rutas al hover

2. VIRTUALIZACIÓN DE LISTAS:
   - Implementar react-window en:
     - Lista de feligreses (puede tener cientos)
     - Lista de transacciones
     - Lista de eventos
     - Lista de inventario
   - Renderizar solo elementos visibles

3. OPTIMIZACIÓN DE IMÁGENES:
   - Comprimir logo de parroquia
   - Lazy loading de imágenes
   - Usar formato WebP si es posible

4. BUNDLE SIZE:
   - Analizar bundle con vite-plugin-bundle-visualizer
   - Identificar dependencias pesadas
   - Reemplazar o tree-shake si es posible
   - Meta: bundle < 200KB gzipped

5. CACHÉ AGRESIVO:
   - TanStack Query con staleTime más largo
   - Service Worker para assets estáticos (PWA básica)
   - Cache API para requests frecuentes

6. PERFORMANCE METRICS:
   - Implementar React.memo en componentes pesados
   - useMemo y useCallback donde sea necesario
   - Reducir re-renders innecesarios
   - Profiling con React DevTools

7. BASE DE DATOS:
   - Agregar índices a columnas frecuentemente buscadas
   - EXPLAIN ANALYZE en queries lentas
   - Optimizar queries N+1 si existen

Por favor implementa todas las optimizaciones y dame un reporte de mejora (antes/después).
```

**Archivos a crear/modificar:**
- `client/src/App.tsx` - Lazy loading de rutas
- `client/src/pages/*.tsx` - Implementar virtualización
- `client/src/lib/queryClient.ts` - Optimizar configuración
- `vite.config.ts` - Bundle analyzer
- `shared/schema.ts` - Agregar índices DB
- `public/sw.js` - Service worker básico (opcional)

**Testing:**
- Lighthouse scores mejorados
- Bundle size reducido
- Time to Interactive < 3s en 3G

---

### SESIÓN 5.2: Gestión de Usuarios Mejorada (2 horas)

**Prompt para Claude:**
```
Necesito implementar una interfaz completa de gestión de usuarios con permisos granulares.

REQUISITOS:

1. PÁGINA DE ADMINISTRACIÓN DE USUARIOS:
   - Solo accesible por rol "parroco"
   - Lista de todos los usuarios del sistema
   - Columnas: nombre, username, rol, fecha creación, último login, estado
   - Botones: Crear, Editar, Desactivar/Activar, Cambiar contraseña

2. CREAR/EDITAR USUARIO:
   - Modal con formulario
   - Campos: nombre, username, password, confirmar password, rol
   - Validación en frontend y backend
   - Solo párroco puede crear otros párrocos

3. CAMBIO DE CONTRASEÑA:
   - Los usuarios pueden cambiar su propia contraseña
   - Formulario: contraseña actual, nueva contraseña, confirmar
   - Validación de complejidad (mínimo 8 caracteres, 1 mayúscula, 1 número)

4. LOGS DE AUDITORÍA:
   - Tabla nueva: audit_logs
   - Registrar: login, logout, cambios importantes (crear/editar/eliminar)
   - Campos: usuario, acción, entidad afectada, timestamp, IP
   - Página para ver logs (solo párroco)

5. SESIONES ACTIVAS:
   - Ver quién está conectado actualmente
   - Opción de revocar sesión (forzar logout)
   - Solo párroco puede revocar sesiones

6. PERMISOS GRANULARES:
   - Definir qué puede hacer cada rol:
     - parroco: todo
     - coordinador: crear/editar (no eliminar)
     - voluntario: solo lectura
   - Aplicar en frontend (deshabilitar botones) y backend (middleware)

Por favor implementa toda la gestión de usuarios completa.
```

**Archivos a crear/modificar:**
- `shared/schema.ts` - Tabla audit_logs
- `server/routes.ts` - Endpoints de gestión de usuarios
- `server/middleware/audit.ts` - Middleware de auditoría
- `client/src/pages/admin/usuarios.tsx` - Gestión de usuarios
- `client/src/pages/admin/auditoria.tsx` - Logs de auditoría
- `client/src/pages/perfil.tsx` - Cambio de contraseña personal
- `client/src/components/admin/user-form.tsx` - Formulario de usuario

**Testing:**
- Solo párroco puede acceder a admin
- CRUD de usuarios funciona
- Cambio de contraseña funciona
- Logs se registran correctamente

---

### SESIÓN 5.3: Testing E2E Completo (2 horas)

**Prompt para Claude:**
```
Necesito una suite completa de tests E2E que cubra todos los flujos críticos de la aplicación.

TESTS A CREAR:

1. AUTENTICACIÓN:
   - Login exitoso y fallido
   - Logout
   - Acceso denegado a rutas protegidas
   - Redirección tras login

2. FELIGRESES:
   - Crear, editar, eliminar feligrés
   - Búsqueda de feligreses
   - Validación de formularios

3. SACRAMENTOS:
   - Crear sacramento
   - Generar y descargar certificado PDF
   - Buscar sacramentos

4. CONTABILIDAD:
   - Crear transacción de ingreso
   - Crear transacción de egreso
   - Dashboard financiero muestra datos correctos
   - Exportar a CSV

5. INVENTARIO:
   - Crear artículo
   - Crear movimiento (entrada/salida)
   - Verificar que stock se actualiza
   - Alertas de stock bajo
   - Crear préstamo
   - Devolver préstamo

6. FUNCIONALIDADES NUEVAS:
   - Exportar respaldo
   - Importar respaldo
   - Búsqueda global (Cmd+K)
   - Notificaciones se generan
   - Modo oscuro cambia
   - Reportes PDF se generan
   - Importar CSV

7. PERFORMANCE:
   - Lighthouse CI
   - Time to Interactive < 3s
   - First Contentful Paint < 1.5s

Organiza los tests en suites lógicas y proporciona scripts para ejecutarlos.
```

**Archivos a crear:**
- `tests/e2e/auth.spec.ts`
- `tests/e2e/feligreses.spec.ts`
- `tests/e2e/sacramentos.spec.ts`
- `tests/e2e/contabilidad.spec.ts`
- `tests/e2e/inventario.spec.ts`
- `tests/e2e/nuevas-features.spec.ts`
- `tests/e2e/performance.spec.ts`

**Testing:**
- Todos los tests pasan
- Cobertura > 80% de flujos críticos

---

### SESIÓN 5.4: Documentación Final (1-2 horas)

**Prompt para Claude:**
```
Necesito actualizar y completar toda la documentación del proyecto.

DOCUMENTOS A ACTUALIZAR/CREAR:

1. README.md:
   - Agregar todas las nuevas funcionalidades
   - Screenshots de las nuevas páginas
   - Instrucciones de instalación actualizadas
   - Sección de "Nuevas Características"

2. ARQUITECTURA.md:
   - Actualizar con nuevas decisiones técnicas
   - Diagrama de arquitectura actualizado
   - Optimizaciones implementadas
   - Estrategias de caché y offline

3. API-ENDPOINTS.md:
   - Documentar todos los nuevos endpoints
   - Formato consistente con ejemplos
   - Códigos de error

4. ESTADO-ACTUAL.md:
   - Actualizar estado a 100% completado
   - Marcar Fase 4 como completa
   - Nuevas métricas de performance

5. MANUAL-USUARIO.md (NUEVO):
   - Guía paso a paso para usuarios finales
   - Screenshots de cada módulo
   - Casos de uso comunes
   - Preguntas frecuentes
   - Troubleshooting

6. GUIA-DESPLIEGUE-REPLIT.md (NUEVO):
   - Cómo configurar proyecto en Replit
   - Variables de entorno necesarias
   - Configuración de Neon DB
   - UptimeRobot setup
   - Custom domain (opcional)
   - Troubleshooting común

7. CHANGELOG.md (NUEVO):
   - Historial de versiones
   - Versión 2.0.0 con todas las nuevas features

Por favor actualiza/crea toda la documentación de forma profesional y completa.
```

**Archivos a crear/modificar:**
- `README.md`
- `docs/ARQUITECTURA.md`
- `docs/API-ENDPOINTS.md`
- `docs/ESTADO-ACTUAL.md`
- `docs/MANUAL-USUARIO.md` (nuevo)
- `docs/GUIA-DESPLIEGUE-REPLIT.md` (nuevo)
- `CHANGELOG.md` (nuevo)

---

### SESIÓN 5.5: Revisión Final y Deployment (1 hora)

**Prompt para Claude:**
```
Necesito hacer una revisión final completa antes de considerar el proyecto terminado.

CHECKLIST FINAL:

1. CODE QUALITY:
   - TypeScript strict mode sin errores
   - ESLint sin warnings
   - Formateo consistente
   - Comentarios en código complejo
   - TODO/FIXME resueltos

2. TESTING:
   - Todos los tests E2E pasan
   - Cobertura adecuada
   - No hay tests flaky

3. PERFORMANCE:
   - Lighthouse score > 90 en todas las categorías
   - Bundle size optimizado
   - No memory leaks

4. SECURITY:
   - Variables de entorno no expuestas
   - Inputs sanitizados
   - CSRF protección
   - SQL injection prevención
   - XSS prevención

5. UX:
   - Todas las páginas responsive
   - Loading states en todas las operaciones async
   - Error messages claros
   - Success feedback
   - No dead links

6. DEPLOYMENT:
   - Build de producción funciona
   - Environment variables configuradas
   - Database migrada
   - Seed data opcional funciona

7. DOCUMENTACIÓN:
   - README completo
   - API documentada
   - Comentarios en código
   - Manual de usuario

Revisa cada punto y dame un reporte final. Si encuentras problemas, arréglalo.
```

**Entregables del Día 5:**
- ✅ Aplicación completamente optimizada
- ✅ Suite de tests completa y pasando
- ✅ Gestión de usuarios implementada
- ✅ Documentación completa y profesional
- ✅ Proyecto listo para producción

---

## 📊 RESUMEN DE ENTREGABLES

### Funcionalidades Implementadas (Total)

**Día 1:**
- ✅ Sistema de respaldo USB completo
- ✅ Health check y keep-alive
- ✅ Documentación de Replit

**Día 2:**
- ✅ Reconexión automática
- ✅ Manejo de conexión intermitente
- ✅ Dashboard general parroquial

**Día 3:**
- ✅ Búsqueda global (Cmd+K)
- ✅ Notificaciones internas
- ✅ Modo oscuro
- ✅ Mejoras de accesibilidad

**Día 4:**
- ✅ Reportes profesionales con PDF
- ✅ Importación masiva desde Excel
- ✅ Calendario litúrgico

**Día 5:**
- ✅ Optimizaciones de rendimiento
- ✅ Gestión de usuarios completa
- ✅ Suite de tests E2E
- ✅ Documentación completa

---

## 🎯 MÉTRICAS DE ÉXITO

Al final de los 5 días, el proyecto debe cumplir:

**Performance:**
- ✅ Lighthouse Performance > 90
- ✅ Time to Interactive < 3s en 3G
- ✅ Bundle size < 200KB gzipped

**Funcionalidad:**
- ✅ 100% de features críticas implementadas
- ✅ Sistema offline-resistant
- ✅ Respaldo completo de datos
- ✅ Reportes profesionales

**Calidad:**
- ✅ Tests E2E > 80% cobertura
- ✅ 0 errores TypeScript
- ✅ 0 warnings ESLint críticos

**Documentación:**
- ✅ README completo
- ✅ Manual de usuario
- ✅ Guía de deployment
- ✅ API documentada

---

## 📝 NOTAS IMPORTANTES

### Estrategia de Trabajo

1. **Seguir el orden:** Los días están organizados por dependencias
2. **Commit frecuente:** Hacer commit después de cada sesión
3. **Testing continuo:** No dejar tests para el final
4. **Pedir ayuda:** Si algo toma > 1 hora extra, pedir ayuda
5. **Documentar:** Ir documentando mientras desarrollas

### Contingencias

Si algo toma más tiempo:

**Día 1:** Respaldo USB es CRÍTICO, no negociable
**Día 2:** Dashboard puede simplificarse si es necesario
**Día 3:** Modo oscuro es opcional si falta tiempo
**Día 4:** Calendario litúrgico es opcional
**Día 5:** Priorizar testing sobre documentación

---

## ✅ CHECKLIST DIARIO

Copiar al inicio de cada día:

```markdown
## DÍA X - [Fecha]

### Sesión 1: [Nombre]
- [ ] Implementación completa
- [ ] Tests escritos
- [ ] Commit realizado

### Sesión 2: [Nombre]
- [ ] Implementación completa
- [ ] Tests escritos
- [ ] Commit realizado

### Sesión 3: [Nombre]
- [ ] Implementación completa
- [ ] Tests escritos
- [ ] Commit realizado

### Final del día:
- [ ] Todos los tests del día pasan
- [ ] Build funciona
- [ ] Documentación actualizada
- [ ] Push a repositorio
```

---

## 🚀 COMENZAR

Para iniciar el día 1, usa el primer prompt de la Sesión 1.1.

**¡Éxito en el desarrollo intensivo!** 💪

---

**Última actualización:** Noviembre 11, 2025
**Autor:** Plan generado por Claude
**Duración estimada:** 5 días (40-50 horas)
**Prioridad:** MÁXIMA
