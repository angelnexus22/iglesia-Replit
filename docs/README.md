# Sistema Parroquial - Documentación del Proyecto

## 📋 Descripción General

Sistema de gestión parroquial diseñado para parroquias católicas en zonas rurales de México. Permite administrar feligreses, sacramentos, grupos pastorales, eventos, voluntarios, contabilidad e inventario.

**Estado actual:** Aplicación web funcional con base de datos PostgreSQL. **Funcionalidades offline en desarrollo** (PWA, sincronización, respaldos USB pendientes - ver [PENDIENTES.md](./PENDIENTES.md)).

## 🎯 Objetivo del Proyecto

Crear una herramienta digital accesible para párrocos y personal administrativo que:
- Funcione en dispositivos básicos (computadoras antiguas y teléfonos sencillos)
- Sea fácil de usar para personas con poca experiencia técnica
- Genere certificados sacramentales en PDF ✅
- Gestione contabilidad e inventario parroquial ✅
- **Meta futura:** Funcionar sin internet constante, sincronización entre parroquias, y respaldos USB (ver roadmap en [PENDIENTES.md](./PENDIENTES.md))

## 🚀 Estado del Proyecto

**Versión actual:** Fase 3 Completada

- ✅ **Fase 1:** Sistema base completado (autenticación, feligreses, sacramentos, grupos, eventos, voluntarios, generación de PDFs)
- ✅ **Fase 2:** Módulos financieros y de inventario completados
- ✅ **Fase 3:** Dashboard financiero y exportaciones CSV completados
- ⏳ **Pendiente:** Sistema de respaldo USB, sincronización offline, optimizaciones de rendimiento

Ver [ESTADO-ACTUAL.md](./ESTADO-ACTUAL.md) para detalles completos.

## 📚 Índice de Documentación

### Para Desarrolladores

1. **[Guía de Desarrollo](./GUIA-DESARROLLO.md)** - Cómo configurar el entorno y comenzar a trabajar
2. **[Arquitectura Técnica](./ARQUITECTURA.md)** - Estructura del código y decisiones de diseño
3. **[API Endpoints](./API-ENDPOINTS.md)** - Documentación completa de la API REST
4. **[Estado Actual](./ESTADO-ACTUAL.md)** - Funcionalidades implementadas y probadas
5. **[Funcionalidades Pendientes](./PENDIENTES.md)** - Roadmap y próximos pasos

### Información Rápida

**Stack Tecnológico:**
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- Backend: Express.js + TypeScript
- Base de datos: PostgreSQL (Neon) + Drizzle ORM
- Autenticación: express-session con bcrypt
- PDFs: PDFKit
- Gráficas: Recharts

**Credenciales de prueba:**
- Usuario: `admin`
- Contraseña: `Admin123!`
- Rol: `parroco` (acceso completo)

## 🏃‍♂️ Inicio Rápido

```bash
# 1. Instalar dependencias (ya instaladas en Replit)
npm install

# 2. Configurar variables de entorno
# DATABASE_URL y SESSION_SECRET ya están configuradas

# 3. Ejecutar migraciones de base de datos
npm run db:push

# 4. Iniciar servidor de desarrollo
npm run dev

# 5. (Opcional) Cargar datos de ejemplo
# Acceder a la app, login como admin, luego:
curl -X POST http://localhost:5000/api/seed \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

## 🔑 Características Principales Implementadas

### Gestión de Personas
- ✅ Directorio de feligreses con información completa
- ✅ Relaciones familiares
- ✅ Historial sacramental por persona

### Sacramentos
- ✅ Registro de bautismos, confirmaciones, comuniones, matrimonios
- ✅ Generación automática de certificados PDF
- ✅ Búsqueda y filtrado avanzado

### Grupos y Eventos
- ✅ Gestión de grupos pastorales y ministerios
- ✅ Asignación de miembros a grupos
- ✅ Calendario de eventos parroquiales
- ✅ Coordinación de voluntarios por evento

### Contabilidad e Inventario
- ✅ Registro de ingresos y egresos
- ✅ Categorización financiera
- ✅ Dashboard con gráficas interactivas
- ✅ Exportación a CSV/Excel
- ✅ Control de inventario litúrgico y de oficina
- ✅ Movimientos de entrada/salida con actualización automática de stock
- ✅ Sistema de préstamos de artículos

### Administración
- ✅ Sistema de autenticación con roles (párroco, coordinador, voluntario)
- ✅ Sesiones persistentes en base de datos
- ✅ Datos de ejemplo (seed data) para demostración

### ⚠️ Características NO Implementadas (Pendientes Fase 4)
- ❌ Modo offline sin internet (requiere PWA con service workers)
- ❌ Sistema de respaldo y restauración USB
- ❌ Sincronización entre múltiples parroquias
- ❌ Almacenamiento local con IndexedDB

**Nota:** El sistema actualmente requiere conexión a internet para acceder a la base de datos PostgreSQL. La funcionalidad offline completa está planificada para una fase futura. Ver [PENDIENTES.md](./PENDIENTES.md) para detalles.

## 📞 Soporte y Contacto

Este proyecto fue desarrollado como una herramienta para apoyar la gestión administrativa de parroquias católicas.

Para preguntas técnicas, revisar:
1. [GUIA-DESARROLLO.md](./GUIA-DESARROLLO.md) - Solución de problemas comunes
2. [ARQUITECTURA.md](./ARQUITECTURA.md) - Detalles técnicos del sistema

## 📝 Licencia

Sistema desarrollado para uso interno parroquial.

---

**Última actualización:** Noviembre 2025  
**Estado:** En desarrollo activo - Fase 3 completada
