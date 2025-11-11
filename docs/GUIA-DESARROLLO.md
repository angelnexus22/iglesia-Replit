# Guía de Desarrollo - Sistema Parroquial

**Última actualización:** Noviembre 10, 2025

Esta guía te ayudará a configurar tu entorno de desarrollo y comenzar a trabajar en el proyecto.

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 20+ (recomendado: 20.x LTS)
- PostgreSQL 14+ (ya configurado en Replit)
- Git (para control de versiones)
- Editor de código (recomendado: VSCode)

### Configuración Inicial en Replit

El proyecto ya está configurado en Replit. Solo necesitas:

```bash
# 1. Las dependencias ya están instaladas
# Si necesitas reinstalar:
npm install

# 2. Variables de entorno ya configuradas:
# - DATABASE_URL (PostgreSQL connection string)
# - SESSION_SECRET (para express-session)
# - NODE_ENV (development)

# 3. Ejecutar migraciones de base de datos
npm run db:push

# 4. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `https://<tu-repl>.replit.dev`

---

## 📁 Estructura del Proyecto

```
.
├── client/                 # Frontend React + TypeScript
│   ├── public/            # Assets estáticos
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   │   ├── ui/       # Componentes shadcn/ui
│   │   │   └── app-sidebar.tsx
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # Utilidades y helpers
│   │   ├── pages/        # Páginas de la aplicación
│   │   ├── App.tsx       # Componente raíz + routing
│   │   ├── main.tsx      # Entry point
│   │   └── index.css     # Estilos globales + Tailwind
│   └── index.html        # HTML template
│
├── server/                # Backend Express + TypeScript
│   ├── index.ts          # Entry point del servidor
│   ├── routes.ts         # Definición de todos los endpoints
│   ├── storage.ts        # Capa de acceso a datos (PostgreSQL)
│   ├── seed-data.ts      # Datos de ejemplo
│   ├── utils/
│   │   └── certificadoPDF.ts  # Generación de PDFs
│   └── vite.ts           # Integración Vite + Express
│
├── shared/                # Código compartido frontend/backend
│   └── schema.ts         # Schemas Drizzle + Zod
│
├── docs/                  # Documentación del proyecto
│   ├── README.md
│   ├── ESTADO-ACTUAL.md
│   ├── PENDIENTES.md
│   ├── GUIA-DESARROLLO.md (este archivo)
│   ├── ARQUITECTURA.md
│   └── API-ENDPOINTS.md
│
├── drizzle.config.ts     # Configuración Drizzle ORM
├── package.json          # Dependencias y scripts
├── tsconfig.json         # Configuración TypeScript
├── tailwind.config.ts    # Configuración Tailwind
├── vite.config.ts        # Configuración Vite
└── replit.md             # Documentación técnica principal
```

---

## 🛠️ Comandos Disponibles

### Desarrollo

```bash
# Iniciar servidor de desarrollo (Vite + Express)
npm run dev

# El servidor estará disponible en:
# - Frontend: http://localhost:5000 (Vite HMR)
# - Backend: http://localhost:5000/api/*
# - Ambos en el mismo puerto gracias a Vite middleware
```

### Base de Datos

```bash
# Sincronizar schema con base de datos (sin migraciones SQL)
npm run db:push

# Forzar sincronización (útil cuando hay advertencias de pérdida de datos)
npm run db:push --force

# Abrir Drizzle Studio (explorador visual de BD)
npm run db:studio

# NUNCA uses migraciones manuales SQL
# Drizzle maneja todo automáticamente con db:push
```

### Build y Producción

```bash
# Build del frontend (React + Vite)
npm run build

# Build del backend (TypeScript → JavaScript con esbuild)
# (Actualmente no configurado, se ejecuta con tsx en dev)
```

---

## 🗄️ Trabajando con la Base de Datos

### Modificar el Schema

1. **Editar `shared/schema.ts`**

```typescript
import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";

// Ejemplo: Agregar nueva tabla
export const nuevaTabla = pgTable("nueva_tabla", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Crear schema de inserción Zod
export const insertNuevaTablaSchema = createInsertSchema(nuevaTabla).omit({
  id: true,
  createdAt: true,
});

// Tipos TypeScript
export type NuevaTabla = typeof nuevaTabla.$inferSelect;
export type InsertNuevaTabla = z.infer<typeof insertNuevaTablaSchema>;
```

2. **Sincronizar con la base de datos**

```bash
npm run db:push
```

3. **Actualizar `server/storage.ts`** con métodos CRUD

```typescript
// En interface IStorage
async getNuevaTabla(id: string): Promise<NuevaTabla | undefined>;
async getAllNuevaTablas(): Promise<NuevaTabla[]>;
async createNuevaTabla(data: InsertNuevaTabla): Promise<NuevaTabla>;
async updateNuevaTabla(id: string, data: Partial<InsertNuevaTabla>): Promise<NuevaTabla | undefined>;
async deleteNuevaTabla(id: string): Promise<boolean>;

// En clase PostgresStorage
async getNuevaTabla(id: string) {
  return await this.db.query.nuevaTabla.findFirst({
    where: eq(nuevaTabla.id, id)
  });
}

async getAllNuevaTablas() {
  return await this.db.query.nuevaTabla.findMany();
}

async createNuevaTabla(data: InsertNuevaTabla) {
  const [result] = await this.db.insert(nuevaTabla)
    .values(data)
    .returning();
  return result;
}
// ... etc
```

4. **Agregar endpoints en `server/routes.ts`**

```typescript
app.get("/api/nueva-tabla", async (req, res) => {
  try {
    const items = await storage.getAllNuevaTablas();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

app.post("/api/nueva-tabla", async (req, res) => {
  try {
    const data = insertNuevaTablaSchema.parse(req.body);
    const item = await storage.createNuevaTabla(data);
    res.status(201).json(item);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});
```

5. **Crear página frontend en `client/src/pages/`**

Ver páginas existentes como ejemplo (contabilidad.tsx, inventario.tsx)

---

## 🎨 Trabajando con el Frontend

### Agregar Nueva Página

1. **Crear archivo en `client/src/pages/mi-pagina.tsx`**

```typescript
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MiPagina() {
  const { data, isLoading } = useQuery<MiTipo[]>({
    queryKey: ["/api/mi-endpoint"],
  });

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mi Página</h1>
      {/* Contenido */}
    </div>
  );
}
```

2. **Registrar ruta en `client/src/App.tsx`**

```typescript
import MiPagina from "@/pages/mi-pagina";

// En el Router:
<Route path="/mi-pagina">
  {() => <ProtectedRoute component={MiPagina} />}
</Route>
```

3. **Agregar al sidebar en `client/src/components/app-sidebar.tsx`**

```typescript
const items = [
  // ... otros items
  {
    title: "Mi Página",
    url: "/mi-pagina",
    icon: IconoLucide,
  },
];
```

### Usar Componentes shadcn/ui

Todos los componentes están en `client/src/components/ui/`. Importar así:

```typescript
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
```

Documentación: https://ui.shadcn.com/

### Hacer Peticiones API con TanStack Query

**Queries (GET):**
```typescript
const { data, isLoading, error } = useQuery<TipoRespuesta[]>({
  queryKey: ["/api/endpoint"],
});
```

**Mutations (POST/PATCH/DELETE):**
```typescript
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@lib/queryClient";

const createMutation = useMutation({
  mutationFn: async (data: MiTipo) => {
    return await apiRequest("POST", "/api/endpoint", data);
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["/api/endpoint"] });
    toast({ title: "Éxito", description: "Creado correctamente" });
  },
});

// Usar:
createMutation.mutate(misDatos);
```

### Formularios con React Hook Form + Zod

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMiTipoSchema } from "@shared/schema";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";

const form = useForm({
  resolver: zodResolver(insertMiTipoSchema),
  defaultValues: {
    nombre: "",
    // ...
  },
});

function onSubmit(data: z.infer<typeof insertMiTipoSchema>) {
  createMutation.mutate(data);
}

// En el JSX:
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="nombre"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nombre</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
        </FormItem>
      )}
    />
    <Button type="submit">Guardar</Button>
  </form>
</Form>
```

---

## 🧪 Testing

### Cargar Datos de Ejemplo

```bash
# 1. Login en la app como admin/Admin123!

# 2. Ejecutar endpoint de seed (requiere autenticación de párroco):
curl -X POST http://localhost:5000/api/seed \
  -H "Content-Type: application/json" \
  -b cookies.txt

# Esto creará:
# - 10 feligreses
# - 7 sacramentos
# - 5 grupos con miembros
# - 6 eventos con voluntarios
# - 11 categorías financieras
# - 19 transacciones
# - 17 artículos de inventario
# - 8 movimientos
# - 4 préstamos
```

### Limpiar Base de Datos

```bash
# Eliminar todas las tablas y recrearlas:
npm run db:push --force

# Luego volver a ejecutar seed
```

---

## 🐛 Debugging y Solución de Problemas

### El servidor no inicia

**Error:** `Port 5000 already in use`
```bash
# Encontrar proceso usando el puerto
lsof -i :5000

# Matar proceso
kill -9 <PID>

# O usar otro puerto en .env
PORT=5001
```

**Error:** `Cannot find module '@shared/schema'`
```bash
# Verificar tsconfig paths
# Reiniciar TypeScript server en VSCode: Cmd+Shift+P > "TypeScript: Restart TS Server"
```

### La base de datos no se actualiza

```bash
# Forzar sincronización
npm run db:push --force

# Si persiste, verificar DATABASE_URL
echo $DATABASE_URL

# Verificar conexión a PostgreSQL
psql $DATABASE_URL -c "SELECT version();"
```

### HMR (Hot Module Replacement) no funciona

```bash
# Reiniciar servidor
# En Replit: Stop + Run

# Limpiar cache de Vite
rm -rf node_modules/.vite
npm run dev
```

### Errores de TypeScript

```bash
# Verificar errores sin compilar
npx tsc --noEmit

# Común: imports relativos vs absolutos
# Usar: import { X } from "@/components/ui/button"
# No: import { X } from "../../components/ui/button"
```

---

## 📝 Convenciones de Código

### Nombres de Archivos

- Componentes React: `PascalCase.tsx` (ej: `MiComponente.tsx`)
- Páginas: `kebab-case.tsx` (ej: `dashboard-financiero.tsx`)
- Utilidades: `camelCase.ts` (ej: `exportUtils.ts`)
- Tipos/Interfaces: `PascalCase.ts`

### Nombres de Variables

```typescript
// Componentes y clases: PascalCase
const MiComponente = () => {};
class MiClase {}

// Funciones y variables: camelCase
const miVariable = 123;
function miFuncion() {}

// Constantes globales: UPPER_SNAKE_CASE
const MAX_ITEMS = 100;

// Tipos e Interfaces: PascalCase
type MiTipo = {};
interface MiInterface {}
```

### Estructura de Componentes

```typescript
// 1. Imports
import { useState } from "react";
import { Button } from "@/components/ui/button";

// 2. Types (si son específicos del componente)
type MiComponenteProps = {
  titulo: string;
};

// 3. Componente
export default function MiComponente({ titulo }: MiComponenteProps) {
  // 3a. Hooks
  const [estado, setEstado] = useState();
  
  // 3b. Funciones helper
  const handleClick = () => {
    // ...
  };
  
  // 3c. Efectos
  useEffect(() => {
    // ...
  }, []);
  
  // 3d. Return
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Data Test IDs

Agregar `data-testid` a elementos interactuables y de información importante:

```typescript
// Botones
<Button data-testid="button-save">Guardar</Button>

// Inputs
<Input data-testid="input-email" />

// Cards con datos dinámicos
<Card data-testid={`card-articulo-${articulo.id}`}>

// Texto con información clave
<p data-testid="text-total-ingresos">{total}</p>
```

---

## 🔐 Seguridad

### Autenticación

- Siempre usar `requireAuth` middleware para rutas protegidas
- No exponer información sensible en respuestas de error
- Validar todos los inputs con Zod schemas

```typescript
// Backend
app.post("/api/protected", requireAuth, async (req, res) => {
  // req.session.userId disponible
});

// Con rol específico
app.post("/api/admin-only", requireRole("parroco"), async (req, res) => {
  // Solo párrocos
});
```

### Validación de Datos

```typescript
// Siempre validar en backend
try {
  const data = insertTransaccionSchema.parse(req.body);
  // data es type-safe ahora
} catch (error) {
  return res.status(400).json({ error: "Datos inválidos" });
}
```

---

## 📦 Agregar Nuevas Dependencias

```bash
# Frontend (React)
npm install nombre-paquete

# Backend (Node)
npm install nombre-paquete

# Dev dependencies
npm install --save-dev nombre-paquete

# IMPORTANTE: Las dependencias se instalan automáticamente en Replit
# No edites package.json manualmente
```

---

## 🚀 Deployment

### Publicar en Replit

El proyecto ya está configurado para deployment en Replit:

1. Click en "Deploy" en la interfaz de Replit
2. Configurar dominio personalizado (opcional)
3. Las variables de entorno production se configuran en Secrets
4. Auto-deploy al hacer push a main branch

### Variables de Entorno Necesarias

```bash
# Desarrollo (ya configuradas)
DATABASE_URL=postgresql://...
SESSION_SECRET=random-secret-key
NODE_ENV=development

# Producción (configurar en Replit Secrets)
DATABASE_URL=postgresql://production-url
SESSION_SECRET=production-random-secret
NODE_ENV=production
```

---

## 📚 Recursos Adicionales

### Documentación de Tecnologías

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Vite](https://vitejs.dev/)
- [Express](https://expressjs.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zod](https://zod.dev/)

### Documentación del Proyecto

- [ESTADO-ACTUAL.md](./ESTADO-ACTUAL.md) - Estado completo del proyecto
- [PENDIENTES.md](./PENDIENTES.md) - Roadmap y funcionalidades pendientes
- [ARQUITECTURA.md](./ARQUITECTURA.md) - Decisiones técnicas y arquitectura
- [API-ENDPOINTS.md](./API-ENDPOINTS.md) - Documentación de la API

---

## 💬 Soporte

Si encuentras problemas:

1. Revisa la consola del navegador (F12)
2. Revisa los logs del servidor en Replit
3. Verifica que la base de datos esté accesible
4. Consulta esta documentación
5. Revisa issues similares en el código

---

**¡Listo para desarrollar!** 🎉

Comienza explorando el código existente y haciendo pequeños cambios incrementales.

**Última actualización:** Noviembre 10, 2025
