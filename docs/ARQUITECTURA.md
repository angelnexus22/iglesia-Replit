# Arquitectura Técnica - Sistema Parroquial

**Última actualización:** Noviembre 10, 2025

Este documento describe las decisiones arquitectónicas, patrones de diseño y estructura técnica del sistema.

---

## 🏗️ Arquitectura General

### Stack Tecnológico

**Frontend:**
- React 18.3+ con TypeScript
- Vite 6 (build tool y dev server)
- Tailwind CSS 3 + shadcn/ui (componentes)
- TanStack Query v5 (gestión de estado del servidor)
- Wouter (routing ligero)
- React Hook Form + Zod (formularios y validación)
- Recharts (visualizaciones)
- Lucide React (iconos)

**Backend:**
- Node.js 20+ con Express.js
- TypeScript (compilado con tsx en dev, esbuild en prod)
- Drizzle ORM (type-safe ORM)
- PostgreSQL 14+ (Neon serverless)
- express-session + connect-pg-simple (sesiones)
- bcrypt (hashing de contraseñas)
- PDFKit (generación de PDFs)
- Zod (validación compartida)

**Infraestructura:**
- Replit como plataforma de desarrollo y hosting
- Neon PostgreSQL (base de datos serverless)
- Single server que sirve frontend y backend (Vite middleware)

---

## 📊 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              React Application (SPA)                  │  │
│  │                                                        │  │
│  │  ┌────────────┐  ┌────────────┐  ┌───────────────┐  │  │
│  │  │   Pages    │  │ Components │  │  TanStack     │  │  │
│  │  │ (wouter)   │──│  (shadcn)  │──│  Query        │  │  │
│  │  └────────────┘  └────────────┘  │  (cache)      │  │  │
│  │                                   └───────┬───────┘  │  │
│  └───────────────────────────────────────────┼──────────┘  │
└────────────────────────────────────────────────┼───────────┘
                                                │
                                        HTTP Requests
                                                │
┌───────────────────────────────────────────────┼───────────┐
│                      BACKEND                  ▼            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              Express.js Server                        │ │
│  │                                                        │ │
│  │  ┌────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │  Routes    │──│  Middleware  │──│   Storage    │ │ │
│  │  │  (REST)    │  │  (auth,      │  │   Layer      │ │ │
│  │  │            │  │   session)   │  │ (Drizzle ORM)│ │ │
│  │  └────────────┘  └──────────────┘  └──────┬───────┘ │ │
│  └────────────────────────────────────────────┼─────────┘ │
└────────────────────────────────────────────────┼──────────┘
                                                │
                                        SQL Queries
                                                │
┌───────────────────────────────────────────────┼───────────┐
│                     DATABASE                  ▼            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │         PostgreSQL (Neon Serverless)                  │ │
│  │                                                        │ │
│  │  12 Tables: users, feligreses, sacramentos, grupos,  │ │
│  │  eventos, voluntarios, categorias, transacciones,    │ │
│  │  articulos, movimientos, prestamos, session          │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Estructura de Carpetas Detallada

### `/client` - Frontend

```
client/
├── public/                 # Assets estáticos
│   ├── favicon.png
│   └── logo-parroquia.png # Logo para PDFs
│
├── src/
│   ├── components/        # Componentes React
│   │   ├── ui/           # shadcn/ui components (35+)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── ...
│   │   └── app-sidebar.tsx # Sidebar de navegación
│   │
│   ├── hooks/            # Custom React hooks
│   │   ├── use-auth.tsx  # Hook de autenticación
│   │   ├── use-toast.ts  # Notificaciones toast
│   │   └── use-mobile.tsx
│   │
│   ├── lib/              # Utilidades y helpers
│   │   ├── queryClient.ts  # Config TanStack Query + apiRequest
│   │   ├── export-utils.ts # Exportación CSV
│   │   └── utils.ts        # cn() y otras utilidades
│   │
│   ├── pages/            # Páginas de la aplicación
│   │   ├── dashboard.tsx          # Dashboard principal (WIP)
│   │   ├── login.tsx              # Página de login
│   │   ├── feligreses.tsx         # Gestión de feligreses
│   │   ├── sacramentos.tsx        # Registro sacramental
│   │   ├── grupos.tsx             # Grupos pastorales
│   │   ├── eventos.tsx            # Calendario de eventos
│   │   ├── voluntarios.tsx        # Coordinación voluntarios
│   │   ├── contabilidad.tsx       # Finanzas parroquiales
│   │   ├── dashboard-financiero.tsx # Dashboard con gráficas
│   │   ├── inventario.tsx         # Control de inventario
│   │   ├── respaldo.tsx           # Respaldos USB (WIP)
│   │   └── not-found.tsx          # 404
│   │
│   ├── App.tsx           # Componente raíz + router + auth
│   ├── main.tsx          # Entry point (ReactDOM.createRoot)
│   └── index.css         # Estilos globales + Tailwind directives
│
└── index.html            # HTML template

```

### `/server` - Backend

```
server/
├── index.ts              # Entry point del servidor Express
│                        # - Configuración de sesiones
│                        # - Middleware de seguridad
│                        # - Integración con Vite
│                        # - Start server en puerto 5000
│
├── routes.ts             # Todos los endpoints REST (900+ líneas)
│                        # - Auth: login, logout, register, me
│                        # - Feligreses: CRUD completo
│                        # - Sacramentos: CRUD + PDF
│                        # - Grupos: CRUD + miembros
│                        # - Eventos: CRUD + voluntarios
│                        # - Finanzas: categorías + transacciones + resumen
│                        # - Inventario: artículos + movimientos + préstamos
│                        # - Seed: POST /api/seed
│
├── storage.ts            # Capa de acceso a datos (PostgreSQL)
│                        # - Interface IStorage (contrato)
│                        # - Class PostgresStorage (implementación)
│                        # - 70+ métodos CRUD
│                        # - Uso de Drizzle ORM query builder
│
├── seed-data.ts          # Generador de datos de ejemplo
│                        # - seedDatabase() función principal
│                        # - 1000+ líneas de datos realistas
│                        # - 10 feligreses, 7 sacramentos, etc.
│
├── utils/
│   └── certificadoPDF.ts # Generación de certificados
│                        # - generateCertificadoPDF()
│                        # - Usa PDFKit
│                        # - Retorna Buffer
│
└── vite.ts               # Middleware Vite en Express
                         # - Configuración de HMR en dev
                         # - Sirve assets compilados en prod
```

### `/shared` - Código Compartido

```
shared/
└── schema.ts            # Source of truth para tipos y validación
                         # - Drizzle table definitions
                         # - Zod insert schemas
                         # - TypeScript types (inferidos)
                         # - Usado tanto en frontend como backend
```

---

## 🔄 Flujo de Datos

### Lectura de Datos (Query)

```
1. Componente React
   ↓ useQuery({ queryKey: ["/api/feligreses"] })
2. TanStack Query
   ↓ fetch GET /api/feligreses (con cookie de sesión)
3. Express Routes (server/routes.ts)
   ↓ requireAuth middleware
   ↓ storage.getAllFeligreses()
4. PostgresStorage (server/storage.ts)
   ↓ db.query.feligreses.findMany()
5. Drizzle ORM
   ↓ SQL: SELECT * FROM feligreses
6. PostgreSQL
   ↓ Retorna rows
7. Response JSON
   ↓ TanStack Query cachea
8. Componente re-renderiza con data
```

### Escritura de Datos (Mutation)

```
1. Usuario llena formulario
   ↓ form.handleSubmit(onSubmit)
2. Validación Zod en cliente
   ↓ insertFeligresSchema.parse(data)
3. useMutation
   ↓ apiRequest("POST", "/api/feligreses", data)
4. Express Routes
   ↓ requireAuth middleware
   ↓ insertFeligresSchema.parse(req.body) - Validación en servidor
   ↓ storage.createFeligres(data)
5. PostgresStorage
   ↓ db.insert(feligreses).values(data).returning()
6. Drizzle ORM
   ↓ SQL: INSERT INTO feligreses (...) RETURNING *
7. PostgreSQL
   ↓ Retorna nuevo registro
8. Response JSON
   ↓ onSuccess: queryClient.invalidateQueries(["/api/feligreses"])
9. TanStack Query refetch automático
10. UI actualizada
```

---

## 🔐 Autenticación y Seguridad

### Sistema de Sesiones

**Implementación:**
- express-session como middleware
- connect-pg-simple para almacenar sesiones en PostgreSQL
- Cookies httpOnly con sameSite: "lax"
- SESSION_SECRET desde variables de entorno
- Duración de sesión: 24 horas

**Tabla de sesiones (automática):**
```sql
CREATE TABLE session (
  sid varchar NOT NULL PRIMARY KEY,
  sess json NOT NULL,
  expire timestamp(6) NOT NULL
);
```

**Flujo de autenticación:**
```
1. POST /api/auth/login
   ↓ Validar username/password
   ↓ bcrypt.compare(password, hashedPassword)
   ↓ Si válido: req.session.userId = user.id
   ↓            req.session.userRole = user.rol
   ↓ Cookie establecida automáticamente
   
2. Requests subsecuentes
   ↓ Cookie enviada automáticamente
   ↓ express-session deserializa sesión
   ↓ req.session.userId disponible
   
3. requireAuth middleware
   ↓ if (!req.session?.userId) return 401
   ↓ else next()
   
4. requireRole(rol) middleware
   ↓ requireAuth primero
   ↓ if (req.session.userRole !== rol) return 403
   ↓ else next()
```

### Hash de Contraseñas

```typescript
// Registro
const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

// Login
const isValid = await bcrypt.compare(password, user.hashedPassword);
```

### Protección de Rutas en Frontend

```typescript
function ProtectedRoute({ component: Component }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return null;
  
  return <Component />;
}
```

---

## 🗄️ Esquema de Base de Datos

### Diagrama ER (Entidad-Relación)

```
┌─────────────┐
│    users    │
└──────┬──────┘
       │
       │ 1
       │
       ├──────────────────────────────┐
       │                              │
       │ N                            │ N
┌──────▼──────────┐           ┌───────▼────────┐
│   feligreses    │◄──────────│   sacramentos  │
│                 │ 1        N │                │
│  - id           │           │  - feligresId   │
│  - nombre       │           │  - tipo         │
│  - apellidos    │           │  - fecha        │
│  - ...          │           └─────────────────┘
└────────┬────────┘
         │ N
         │
         │
  ┌──────▼──────────┐
  │ miembros_grupo  │ (junction table)
  │                 │
  │  - feligresId   │
  │  - grupoId      │
  └────────┬────────┘
           │ N
           │
  ┌────────▼────────┐
  │     grupos      │
  └─────────────────┘

  ┌─────────────────┐
  │    eventos      │
  └────────┬────────┘
           │ 1
           │
           │ N
  ┌────────▼────────┐
  │  voluntarios    │
  │                 │
  │  - eventoId     │
  │  - feligresId   │
  └─────────────────┘

  ┌──────────────────────┐
  │ categorias_          │
  │ financieras          │
  └────────┬─────────────┘
           │ 1
           │
           │ N
  ┌────────▼────────────┐
  │   transacciones     │
  │                     │
  │  - categoriaId      │
  │  - tipo             │
  │  - monto            │
  └─────────────────────┘

  ┌────────────────────┐
  │ articulos_         │
  │ inventario         │
  └────────┬───────────┘
           │ 1
           │
           ├─────────────┬─────────────┐
           │ N           │ N           │ N
  ┌────────▼────────┐   │   ┌─────────▼─────────┐
  │  movimientos_   │   │   │    prestamos      │
  │  inventario     │   │   │                   │
  │                 │   │   │  - articuloId     │
  │  - articuloId   │   │   │  - cantidad       │
  │  - tipo         │   │   │  - prestatario    │
  │  - cantidad     │   │   └───────────────────┘
  └─────────────────┘   │
```

### Tablas y Relaciones

**users** (autenticación)
- PK: id (varchar UUID)
- username (unique)
- hashedPassword
- nombre, rol

**feligreses** (directorio)
- PK: id
- nombre, apellidos, fechaNacimiento
- telefono, email, direccion
- estadoCivil, activo

**sacramentos** (registro sacramental)
- PK: id
- FK: feligresId → feligreses.id
- tipo (bautismo, primera_comunion, confirmacion, matrimonio)
- fecha, lugarCelebracion
- ministro, padrinos, notas

**grupos** (grupos pastorales)
- PK: id
- nombre, descripcion
- coordinador, tipo
- horario, lugarReunion

**miembros_grupo** (many-to-many)
- PK: id
- FK: feligresId → feligreses.id
- FK: grupoId → grupos.id
- fechaIngreso, activo

**eventos** (calendario)
- PK: id
- nombre, descripcion, tipo
- fechaInicio, fechaFin
- lugar, responsable

**voluntarios** (coordinación)
- PK: id
- FK: eventoId → eventos.id
- FK: feligresId → feligreses.id
- rol, confirmado

**categorias_financieras**
- PK: id
- nombre, tipo (ingreso/egreso)
- descripcion, activa

**transacciones** (contabilidad)
- PK: id
- FK: categoriaId → categorias_financieras.id
- tipo (ingreso/egreso)
- monto, fecha, descripcion
- metodoPago, referencia, notas

**articulos_inventario**
- PK: id
- nombre, categoria, descripcion
- unidadMedida, stockActual, stockMinimo
- ubicacion, valorUnitario, activo

**movimientos_inventario**
- PK: id
- FK: articuloId → articulos_inventario.id
- tipo (entrada/salida)
- cantidad, fecha, motivo
- registradoPorId, notas

**prestamos**
- PK: id
- FK: articuloId → articulos_inventario.id
- cantidad, prestatarioNombre
- fechaPrestamo, fechaDevolucionProgramada
- fechaDevolucionReal, estado, motivo

---

## 🎯 Patrones de Diseño Utilizados

### 1. Repository Pattern (Storage Layer)

**Propósito:** Abstraer acceso a datos, permitir cambio de BD sin afectar lógica de negocio.

```typescript
interface IStorage {
  getFeligres(id: string): Promise<Feligres | undefined>;
  getAllFeligreses(): Promise<Feligres[]>;
  createFeligres(data: InsertFeligres): Promise<Feligres>;
  // ...
}

class PostgresStorage implements IStorage {
  // Implementación con Drizzle ORM
}

// En routes.ts
const storage: IStorage = new PostgresStorage();
```

### 2. Schema-Driven Development

**Propósito:** Single source of truth para tipos y validación.

```typescript
// shared/schema.ts
export const feligreses = pgTable("feligreses", { ... });
export const insertFeligresSchema = createInsertSchema(feligreses);
export type Feligres = typeof feligreses.$inferSelect;
export type InsertFeligres = z.infer<typeof insertFeligresSchema>;

// Backend valida
const data = insertFeligresSchema.parse(req.body);

// Frontend valida
const form = useForm({ resolver: zodResolver(insertFeligresSchema) });

// Ambos usan el mismo schema ✅
```

### 3. Query/Mutation Separation (CQRS Light)

**Propósito:** Separar lecturas (queries) de escrituras (mutations).

```typescript
// Queries - solo lectura, cacheables
const { data } = useQuery({ queryKey: ["/api/feligreses"] });

// Mutations - escritura, invalida cache
const mutation = useMutation({
  mutationFn: (data) => apiRequest("POST", "/api/feligreses", data),
  onSuccess: () => queryClient.invalidateQueries(["/api/feligreses"]),
});
```

### 4. Optimistic Updates

**Propósito:** UI instantánea, rollback si falla.

```typescript
const mutation = useMutation({
  mutationFn: updateFeligres,
  onMutate: async (newData) => {
    // Cancelar queries en curso
    await queryClient.cancelQueries(["/api/feligreses"]);
    
    // Guardar snapshot
    const previous = queryClient.getQueryData(["/api/feligreses"]);
    
    // Actualizar cache optimistamente
    queryClient.setQueryData(["/api/feligreses"], (old) => {
      return old.map(f => f.id === newData.id ? { ...f, ...newData } : f);
    });
    
    return { previous };
  },
  onError: (err, newData, context) => {
    // Rollback en error
    queryClient.setQueryData(["/api/feligreses"], context.previous);
  },
});
```

### 5. Factory Pattern (PDF Generation)

```typescript
export function generateCertificadoPDF(sacramento: Tipo): Buffer {
  const doc = new PDFDocument();
  // Configuración común
  
  switch (sacramento.tipo) {
    case "bautismo":
      // Específico de bautismo
      break;
    case "matrimonio":
      // Específico de matrimonio
      break;
  }
  
  return doc;
}
```

---

## 🚀 Decisiones Técnicas Importantes

### 1. ¿Por qué Vite en lugar de Create React App?

- **Más rápido:** HMR instantáneo con ES modules nativos
- **Mejor DX:** Errores más claros, menos configuración
- **Moderno:** Soporta TypeScript out-of-the-box
- **Bundle size:** Tree-shaking superior

### 2. ¿Por qué Drizzle ORM en lugar de Prisma?

- **Más ligero:** Sin generación de código pesada
- **Type-safe:** IntelliSense completo
- **Flexible:** Queries SQL cuando sea necesario
- **Migrations:** db:push sin archivos de migración manual

### 3. ¿Por qué TanStack Query en lugar de Redux?

- **Enfoque correcto:** Server state ≠ Client state
- **Cache inteligente:** Invalidación automática
- **Menos boilerplate:** No actions/reducers
- **Optimistic updates:** Built-in

### 4. ¿Por qué express-session en lugar de JWT?

- **Seguridad:** Tokens revocables (logout real)
- **Simplicidad:** No necesitamos stateless (monolito)
- **Persistencia:** Sesiones sobreviven restart
- **Mejores cookies:** httpOnly previene XSS

### 5. ¿Por qué shadcn/ui en lugar de Material-UI?

- **Sin runtime:** Copias el código, no dependencia
- **Customizable:** Tailwind classes directamente
- **Accesible:** Radix UI primitives (WAI-ARIA)
- **Ligero:** Solo incluyes lo que usas

### 6. ¿Por qué Wouter en lugar de React Router?

- **Tamaño:** 1.5KB vs 12KB
- **Suficiente:** No necesitamos nested routes complejas
- **Hooks API:** Similar a React Router v6

---

## ⚡ Optimizaciones de Performance

### Frontend

1. **Code splitting (Lazy loading)**
```typescript
const Dashboard = lazy(() => import("@/pages/dashboard"));
```

2. **Memoización de cálculos pesados**
```typescript
const totales = useMemo(() => {
  return calcularTotales(transacciones);
}, [transacciones]);
```

3. **Debouncing de búsqueda**
```typescript
const debouncedSearch = useMemo(
  () => debounce((value) => setSearch(value), 300),
  []
);
```

4. **Virtual scrolling** (pendiente - para listas largas)

### Backend

1. **Indexes en BD**
```sql
CREATE INDEX idx_feligreses_nombre ON feligreses(nombre);
CREATE INDEX idx_transacciones_fecha ON transacciones(fecha DESC);
```

2. **Conexión pool** (Neon maneja automáticamente)

3. **Compresión de responses**
```typescript
app.use(compression());
```

---

## 📝 Convenciones y Standards

### Naming Conventions

- **Tablas DB:** snake_case (ej: `miembros_grupo`)
- **Campos DB:** snake_case (ej: `fecha_nacimiento`)
- **TypeScript types:** PascalCase (ej: `InsertFeligres`)
- **Variables:** camelCase (ej: `feligresList`)
- **Componentes:** PascalCase (ej: `FeligresList.tsx`)
- **Archivos:** kebab-case (ej: `dashboard-financiero.tsx`)

### API Conventions

- **REST endpoints:** `/api/recurso` (plural)
- **Métodos:** GET (listar/obtener), POST (crear), PATCH (actualizar), DELETE (eliminar)
- **Status codes:** 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Server Error)
- **Responses:** Siempre JSON

### Git Conventions

- **Commits:** Conventional Commits (feat:, fix:, docs:, refactor:)
- **Branches:** feature/nombre, bugfix/nombre
- **PRs:** Descriptivos con contexto

---

## 🔮 Arquitectura Futura (Roadmap Técnico)

### Offline-First con Service Workers

```
┌────────────────────────────────────┐
│         React App                  │
├────────────────────────────────────┤
│      IndexedDB (local cache)       │
├────────────────────────────────────┤
│  Service Worker (sync queue)       │
└─────────┬──────────────────────────┘
          │
          ├─ Online: → Express API → PostgreSQL
          │
          └─ Offline: → IndexedDB → Sync cuando vuelva conexión
```

### Sincronización Multi-Dispositivo

- CRDT (Conflict-free Replicated Data Types)
- Vector clocks para versioning
- Merge strategies configurables

---

**Última actualización:** Noviembre 10, 2025
**Próxima revisión:** Antes de implementar cambios arquitectónicos mayores
