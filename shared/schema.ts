import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, date, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================
// USUARIOS Y ROLES
// ============================================
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  nombre: text("nombre").notNull(),
  rol: text("rol").notNull(), // "parroco", "coordinador", "voluntario"
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ============================================
// FELIGRESES
// ============================================
export const feligreses = pgTable("feligreses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull(),
  apellidoPaterno: text("apellido_paterno").notNull(),
  apellidoMaterno: text("apellido_materno"),
  fechaNacimiento: date("fecha_nacimiento"),
  telefono: text("telefono"),
  email: text("email"),
  direccion: text("direccion"),
  barrio: text("barrio"),
  
  // Estado sacramental
  bautizado: boolean("bautizado").default(false),
  confirmado: boolean("confirmado").default(false),
  casado: boolean("casado").default(false),
  
  // Familia
  nombrePadre: text("nombre_padre"),
  nombreMadre: text("nombre_madre"),
  nombrePareja: text("nombre_pareja"),
  
  notas: text("notas"),
  activo: boolean("activo").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertFeligresSchema = createInsertSchema(feligreses).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type InsertFeligres = z.infer<typeof insertFeligresSchema>;
export type Feligres = typeof feligreses.$inferSelect;

// ============================================
// SACRAMENTOS
// ============================================
export const sacramentos = pgTable("sacramentos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tipo: text("tipo").notNull(), // "bautismo", "comunion", "confirmacion", "matrimonio"
  
  // Información del feligrés principal
  feligresId: varchar("feligres_id").notNull(),
  nombreFeligres: text("nombre_feligres").notNull(),
  
  // Detalles del sacramento
  fecha: date("fecha").notNull(),
  lugarCelebracion: text("lugar_celebracion").notNull(),
  ministro: text("ministro").notNull(),
  
  // Padrinos/testigos
  nombrePadrino: text("nombre_padrino"),
  nombreMadrina: text("nombre_madrina"),
  
  // Para matrimonios
  nombreConyuge: text("nombre_conyuge"),
  testigo1: text("testigo_1"),
  testigo2: text("testigo_2"),
  
  // Registro oficial
  libroNumero: text("libro_numero"),
  folioNumero: text("folio_numero"),
  partida: text("partida"),
  
  notas: text("notas"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSacramentoSchema = createInsertSchema(sacramentos).omit({ 
  id: true, 
  createdAt: true 
});

export type InsertSacramento = z.infer<typeof insertSacramentoSchema>;
export type Sacramento = typeof sacramentos.$inferSelect;

// ============================================
// GRUPOS PASTORALES
// ============================================
export const grupos = pgTable("grupos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion"),
  coordinadorId: varchar("coordinador_id"),
  coordinadorNombre: text("coordinador_nombre"),
  tipo: text("tipo"), // "jovenes", "coro", "catequesis", "liturgia", etc.
  activo: boolean("activo").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGrupoSchema = createInsertSchema(grupos).omit({ 
  id: true, 
  createdAt: true 
});

export type InsertGrupo = z.infer<typeof insertGrupoSchema>;
export type Grupo = typeof grupos.$inferSelect;

// ============================================
// MIEMBROS DE GRUPOS
// ============================================
export const miembrosGrupo = pgTable("miembros_grupo", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  grupoId: varchar("grupo_id").notNull(),
  feligresId: varchar("feligres_id").notNull(),
  nombreFeligres: text("nombre_feligres").notNull(),
  rol: text("rol"), // "miembro", "coordinador", "secretario", etc.
  fechaIngreso: date("fecha_ingreso").defaultNow(),
  activo: boolean("activo").default(true),
});

export const insertMiembroGrupoSchema = createInsertSchema(miembrosGrupo).omit({ 
  id: true 
});

export type InsertMiembroGrupo = z.infer<typeof insertMiembroGrupoSchema>;
export type MiembroGrupo = typeof miembrosGrupo.$inferSelect;

// ============================================
// EVENTOS
// ============================================
export const eventos = pgTable("eventos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  titulo: text("titulo").notNull(),
  descripcion: text("descripcion"),
  tipo: text("tipo").notNull(), // "misa", "retiro", "kermesse", "reunion", "fiesta", etc.
  fecha: date("fecha").notNull(),
  horaInicio: text("hora_inicio"),
  horaFin: text("hora_fin"),
  lugar: text("lugar"),
  organizadorId: varchar("organizador_id"),
  organizadorNombre: text("organizador_nombre"),
  requiereVoluntarios: boolean("requiere_voluntarios").default(false),
  activo: boolean("activo").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEventoSchema = createInsertSchema(eventos).omit({ 
  id: true, 
  createdAt: true 
});

export type InsertEvento = z.infer<typeof insertEventoSchema>;
export type Evento = typeof eventos.$inferSelect;

// ============================================
// VOLUNTARIOS EN EVENTOS
// ============================================
export const voluntarios = pgTable("voluntarios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventoId: varchar("evento_id").notNull(),
  feligresId: varchar("feligres_id").notNull(),
  nombreFeligres: text("nombre_feligres").notNull(),
  area: text("area"), // "decoracion", "cocina", "ujieres", "liturgia", etc.
  confirmado: boolean("confirmado").default(true),
  fechaInscripcion: timestamp("fecha_inscripcion").defaultNow(),
});

export const insertVoluntarioSchema = createInsertSchema(voluntarios).omit({ 
  id: true, 
  fechaInscripcion: true 
});

export type InsertVoluntario = z.infer<typeof insertVoluntarioSchema>;
export type Voluntario = typeof voluntarios.$inferSelect;
