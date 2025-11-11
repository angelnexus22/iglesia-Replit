# Funcionalidades Pendientes y Roadmap

**Última actualización:** Noviembre 10, 2025

Este documento detalla todas las funcionalidades planificadas pero aún no implementadas, organizadas por prioridad y fase de desarrollo.

---

## 🚨 CRÍTICO - Alta Prioridad

### 1. Sistema de Respaldo de Datos USB
**Estado:** ⏳ No iniciado  
**Prioridad:** CRÍTICA  
**Estimación:** 5-7 días

**Descripción:**
Sistema para exportar e importar toda la base de datos en formato JSON a través de dispositivos USB, permitiendo respaldos offline y transferencia de datos entre dispositivos.

**Funcionalidades requeridas:**
- Exportación completa de base de datos a archivo JSON
- Importación de datos con validación de integridad
- Interfaz de usuario simple en `/respaldo`
- Manejo de conflictos en importación
- Compresión de archivos (opcional)
- Cifrado de respaldos (opcional pero recomendado)

**Consideraciones técnicas:**
- Usar File System Access API para guardar/leer archivos
- Validar estructura JSON antes de importar
- Estrategia de merge para datos existentes (sobrescribir, merge, ignorar duplicados)
- Progress bar para exportación/importación
- Logs de cambios aplicados

**Endpoints necesarios:**
```
POST /api/respaldo/exportar
  Response: JSON con toda la base de datos

POST /api/respaldo/importar
  Body: { data: {...} }
  Response: { importados: 123, omitidos: 5, errores: [] }
```

**Archivo a crear:**
- `client/src/pages/respaldo.tsx` - Ya existe placeholder
- `server/routes.ts` - Agregar endpoints de respaldo
- `server/utils/backup.ts` - Lógica de exportación/importación

**Pruebas necesarias:**
- Exportar datos y verificar integridad del JSON
- Importar en base de datos vacía
- Importar con datos existentes (merge)
- Manejo de errores (JSON corrupto, estructura inválida)

---

### 2. Modo Totalmente Offline (Progressive Web App)
**Estado:** ⏳ No iniciado  
**Prioridad:** ALTA  
**Estimación:** 7-10 días

**Descripción:**
Convertir la aplicación en PWA para que funcione completamente sin internet, almacenando datos localmente y sincronizando cuando haya conexión.

**Funcionalidades requeridas:**
- Service Worker para cache de assets
- IndexedDB como almacenamiento local
- Detección de estado online/offline
- Cola de sincronización para operaciones pendientes
- Indicador visual de estado de conexión
- Conflict resolution en sincronización

**Tecnologías a usar:**
- Workbox para service worker
- Dexie.js para IndexedDB
- Background Sync API
- Cache API para assets estáticos

**Implementación sugerida:**
1. Configurar Vite PWA plugin
2. Implementar service worker con estrategia cache-first
3. Crear capa de abstracción de storage (online vs offline)
4. Implementar cola de sincronización
5. UI para gestionar conflictos de sincronización

**Archivos a crear/modificar:**
- `vite.config.ts` - Agregar vite-plugin-pwa
- `client/src/lib/offline-storage.ts` - Capa de abstracción
- `client/src/lib/sync-queue.ts` - Cola de sincronización
- `public/manifest.json` - PWA manifest
- `client/src/hooks/use-online-status.tsx` - Hook de conectividad

**Desafíos técnicos:**
- Sincronización bidireccional sin pérdida de datos
- Resolución de conflictos (¿qué versión gana?)
- Manejo de relaciones entre tablas en offline
- Performance con grandes volúmenes de datos

---

### 3. Sincronización entre Parroquias
**Estado:** ⏳ No iniciado  
**Prioridad:** MEDIA-ALTA  
**Estimación:** 10-14 días

**Descripción:**
Permitir sincronización de datos entre múltiples instalaciones del sistema en diferentes parroquias, útil para compartir información de feligreses que se mueven entre parroquias.

**Funcionalidades requeridas:**
- Identificador único de parroquia
- Protocolo de sincronización (manual o automática)
- Selección de qué datos sincronizar
- Historial de sincronizaciones
- Logs de cambios aplicados/recibidos

**Arquitectura propuesta:**
- Modelo de datos CRDT (Conflict-free Replicated Data Type) o
- Vector clocks para trackear versiones
- Sync server centralizado (opcional) o P2P

**Consideraciones:**
- ¿Sincronizar todo o solo ciertos módulos?
- ¿Cómo manejar eliminaciones?
- ¿Merge automático o manual?
- Seguridad y autorización entre parroquias

---

## 📊 Reportes y Analytics

### 4. Reportes Financieros Avanzados
**Estado:** ⏳ No iniciado  
**Prioridad:** MEDIA  
**Estimación:** 3-5 días

**Funcionalidades requeridas:**
- Reporte de flujo de caja mensual/anual
- Proyecciones financieras
- Comparativas año vs año
- Reportes por categoría detallados
- Gráficas de evolución temporal
- Exportación a PDF de reportes

**Reportes específicos:**
1. Estado de resultados (ingresos - egresos por período)
2. Presupuesto vs real
3. Top 10 gastos del mes
4. Evolución de diezmos
5. Análisis de eventos rentables

**Páginas a crear:**
- `/reportes/financiero`
- `/reportes/comparativo`

---

### 5. Reportes Sacramentales
**Estado:** ⏳ No iniciado  
**Prioridad:** BAJA-MEDIA  
**Estimación:** 2-3 días

**Funcionalidades requeridas:**
- Estadísticas de sacramentos por mes/año
- Gráficas de tendencias
- Reportes por ministro
- Listados de próximos aniversarios sacramentales
- Certificados masivos

**Reportes específicos:**
1. Bautismos por mes
2. Confirmaciones pendientes (niños por edad)
3. Aniversarios de matrimonio
4. Ministros más activos

---

### 6. Dashboard General Parroquial
**Estado:** ⏳ No iniciado  
**Prioridad:** BAJA  
**Estimación:** 2-3 días

**Descripción:**
Dashboard principal (actualmente `/`) que muestre resumen de toda la actividad parroquial.

**Widgets sugeridos:**
- Total de feligreses activos
- Próximos eventos (calendario)
- Alertas de stock bajo en inventario
- Resumen financiero del mes
- Sacramentos del mes
- Grupos más activos

---

## 🎨 UX y Optimizaciones

### 7. Optimización para Dispositivos de Gama Baja
**Estado:** ⏳ No iniciado  
**Prioridad:** MEDIA  
**Estimación:** 5-7 días

**Mejoras necesarias:**
- Lazy loading de componentes pesados
- Virtualización de listas largas (react-window)
- Reducción de bundle size
- Optimización de imágenes
- Paginación en lugar de scroll infinito
- Reducir re-renders innecesarios

**Métricas objetivo:**
- Time to Interactive < 3s en conexión 3G
- First Contentful Paint < 1.5s
- Bundle size < 200KB (gzipped)

**Herramientas:**
- Lighthouse para auditorías
- Bundle analyzer para optimizar imports
- React DevTools Profiler

---

### 8. Modo Oscuro (Dark Mode)
**Estado:** ⏳ No iniciado  
**Prioridad:** BAJA  
**Estimación:** 1-2 días

**Descripción:**
Implementar tema oscuro para reducir fatiga visual.

**Implementación:**
- Ya hay soporte de Tailwind dark mode (class-based)
- Crear ThemeProvider con localStorage
- Toggle en header
- Respetar preferencia del sistema

**Archivos a crear:**
- `client/src/contexts/theme-context.tsx`
- `client/src/components/theme-toggle.tsx`

---

### 9. Mejoras de Accesibilidad
**Estado:** ⏳ Parcial (Radix UI ayuda)  
**Prioridad:** MEDIA  
**Estimación:** 3-4 días

**Mejoras pendientes:**
- Navegación completa por teclado
- Screen reader testing
- Contraste de colores WCAG AA
- Focus indicators visibles
- Labels apropiados en todos los inputs
- ARIA landmarks

**Herramientas:**
- axe DevTools
- WAVE browser extension
- NVDA/JAWS testing

---

## 🔐 Seguridad y Administración

### 10. Gestión de Usuarios y Permisos
**Estado:** ⏳ Básico implementado  
**Prioridad:** MEDIA  
**Estimación:** 3-4 días

**Mejoras necesarias:**
- Interfaz para crear/editar usuarios
- Cambio de contraseña
- Recuperación de contraseña
- Permisos granulares por módulo
- Logs de auditoría (quién hizo qué)
- Sesiones activas y revocación

**Roles actuales:**
- `parroco`: acceso completo (implementado)
- `coordinador`: acceso limitado (pendiente definir límites)
- `voluntario`: solo lectura (pendiente implementar)

**Páginas a crear:**
- `/admin/usuarios`
- `/admin/permisos`
- `/admin/auditoria`

---

### 11. Copias de Seguridad Automáticas
**Estado:** ⏳ No iniciado  
**Prioridad:** ALTA (para producción)  
**Estimación:** 2-3 días

**Funcionalidades:**
- Backup automático diario/semanal
- Rotación de backups (mantener últimos 7/30 días)
- Notificaciones de backup exitoso/fallido
- Restauración desde backup
- Almacenamiento en múltiples ubicaciones

---

## 📱 Características Adicionales

### 12. Notificaciones y Recordatorios
**Estado:** ⏳ No iniciado  
**Prioridad:** BAJA-MEDIA  
**Estimación:** 4-5 días

**Funcionalidades:**
- Recordatorios de eventos próximos
- Alertas de stock bajo
- Notificaciones de vencimiento de préstamos
- Cumpleaños de feligreses
- Aniversarios sacramentales

**Implementación:**
- Web Push API (requiere HTTPS)
- Email notifications (requiere SMTP)
- SMS (requiere servicio externo)

---

### 13. Importación Masiva de Datos
**Estado:** ⏳ No iniciado  
**Prioridad:** BAJA  
**Estimación:** 3-4 días

**Descripción:**
Importar datos desde Excel/CSV para migración inicial de parroquias que ya tienen registros.

**Funcionalidades:**
- Template de Excel para cada módulo
- Validación de datos antes de importar
- Preview de cambios
- Manejo de errores por fila
- Mapeo de columnas flexible

---

### 14. Búsqueda Global
**Estado:** ⏳ No iniciado  
**Prioridad:** BAJA  
**Estimación:** 2-3 días

**Descripción:**
Barra de búsqueda global (Cmd+K) para buscar en todos los módulos.

**Implementación:**
- Command palette (cmdk library ya instalada)
- Búsqueda en feligreses, eventos, grupos, transacciones
- Navegación rápida entre páginas
- Shortcuts de teclado

---

### 15. Calendario Litúrgico
**Estado:** ⏳ No iniciado  
**Prioridad:** BAJA  
**Estimación:** 3-4 días

**Descripción:**
Integrar calendario litúrgico católico con festividades y lecturas del día.

**Funcionalidades:**
- Festividades del año litúrgico
- Lecturas diarias
- Santos del día
- Tiempos litúrgicos (Adviento, Cuaresma, etc.)
- Integración con módulo de eventos

**Fuente de datos:**
- API pública de calendario litúrgico o
- Base de datos local con fechas móviles calculadas

---

## 🧪 Testing y Calidad

### 16. Suite Completa de Tests E2E
**Estado:** ⏳ Parcialmente iniciado  
**Prioridad:** MEDIA  
**Estimación:** 5-7 días

**Cobertura necesaria:**
- Tests de todos los flujos críticos
- Tests de regresión para bugs corregidos
- Tests de performance
- Tests de accesibilidad automatizados
- CI/CD con ejecución automática

**Herramientas:**
- Playwright (ya en uso)
- GitHub Actions para CI

---

### 17. Monitoreo y Logging
**Estado:** ⏳ No iniciado  
**Prioridad:** BAJA (para producción: ALTA)  
**Estimación:** 2-3 días

**Funcionalidades:**
- Logging estructurado (Winston o Pino)
- Error tracking (Sentry)
- Performance monitoring
- User analytics (opcional)
- Health checks

---

## 📚 Documentación y Capacitación

### 18. Manual de Usuario
**Estado:** ⏳ No iniciado  
**Prioridad:** MEDIA  
**Estimación:** 4-5 días

**Contenido necesario:**
- Guía de inicio rápido
- Tutoriales por módulo (con screenshots)
- Preguntas frecuentes
- Glosario de términos
- Videos explicativos (opcional)

**Formato:**
- PDF descargable
- Página web `/ayuda`
- Tooltips contextuales en la app

---

### 19. Tooltips y Onboarding
**Estado:** ⏳ No iniciado  
**Prioridad:** BAJA  
**Estimación:** 2-3 días

**Descripción:**
Tour guiado para nuevos usuarios explicando cada módulo.

**Implementación:**
- Intro.js o similar
- Tour opcional al primer login
- Tooltips en funcionalidades complejas
- Hints contextuales

---

## 🔄 Mejoras de Arquitectura

### 20. Migración a Bases de Datos Locales (SQLite)
**Estado:** ⏳ No iniciado (evaluar necesidad)  
**Prioridad:** BAJA-MEDIA  
**Estimación:** 7-10 días

**Descripción:**
Para verdadero offline-first, considerar SQLite local en lugar de PostgreSQL en la nube.

**Pros:**
- Sin dependencia de internet
- Más rápido (local)
- Sin costos de hosting

**Cons:**
- Requiere electron o Tauri para desktop
- Sincronización más compleja
- Backup requiere acceso al filesystem

**Alternativa:** Mantener PostgreSQL + implementar offline con IndexedDB

---

## 📋 Resumen de Prioridades

### Sprint 1 (Crítico - 2-3 semanas)
1. Sistema de respaldo USB
2. Modo offline con PWA
3. Optimizaciones de performance

### Sprint 2 (Alta prioridad - 2-3 semanas)
4. Reportes financieros avanzados
5. Gestión completa de usuarios
6. Backups automáticos
7. Suite completa de tests

### Sprint 3 (Media prioridad - 2-3 semanas)
8. Sincronización entre parroquias
9. Reportes sacramentales
10. Dashboard general
11. Mejoras de accesibilidad

### Sprint 4 (Baja prioridad - según necesidad)
12. Notificaciones y recordatorios
13. Importación masiva
14. Búsqueda global
15. Calendario litúrgico
16. Dark mode
17. Manual de usuario
18. Onboarding

---

## 💡 Ideas Futuras (Backlog)

Funcionalidades que podrían agregarse en el futuro:

- App móvil nativa (React Native)
- Integración con redes sociales
- Sistema de donaciones online
- Transmisión de misas en vivo
- Chat interno entre coordinadores
- Gestión de formación y catequesis
- Biblioteca de recursos (documentos, videos)
- Sistema de permisos para uso de instalaciones
- Gestión de cementerio parroquial
- Registro de bienes patrimoniales

---

**Nota:** Las estimaciones son aproximadas y pueden variar según la complejidad encontrada durante la implementación.

**Última actualización:** Noviembre 10, 2025  
**Próxima revisión:** Inicio de Fase 4
