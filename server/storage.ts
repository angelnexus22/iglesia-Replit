import { randomUUID } from "crypto";
import type {
  User, InsertUser,
  Feligres, InsertFeligres,
  Sacramento, InsertSacramento,
  Grupo, InsertGrupo,
  MiembroGrupo, InsertMiembroGrupo,
  Evento, InsertEvento,
  Voluntario, InsertVoluntario
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Feligreses
  getAllFeligreses(): Promise<Feligres[]>;
  getFeligres(id: string): Promise<Feligres | undefined>;
  createFeligres(feligres: InsertFeligres): Promise<Feligres>;
  updateFeligres(id: string, feligres: InsertFeligres): Promise<Feligres | undefined>;
  deleteFeligres(id: string): Promise<boolean>;

  // Sacramentos
  getAllSacramentos(): Promise<Sacramento[]>;
  getSacramento(id: string): Promise<Sacramento | undefined>;
  createSacramento(sacramento: InsertSacramento): Promise<Sacramento>;
  updateSacramento(id: string, sacramento: InsertSacramento): Promise<Sacramento | undefined>;
  deleteSacramento(id: string): Promise<boolean>;

  // Grupos
  getAllGrupos(): Promise<Grupo[]>;
  getGrupo(id: string): Promise<Grupo | undefined>;
  createGrupo(grupo: InsertGrupo): Promise<Grupo>;
  updateGrupo(id: string, grupo: InsertGrupo): Promise<Grupo | undefined>;
  deleteGrupo(id: string): Promise<boolean>;

  // Miembros de Grupo
  getAllMiembrosGrupo(): Promise<MiembroGrupo[]>;
  getMiembrosGrupoPorGrupo(grupoId: string): Promise<MiembroGrupo[]>;
  createMiembroGrupo(miembro: InsertMiembroGrupo): Promise<MiembroGrupo>;
  deleteMiembroGrupo(id: string): Promise<boolean>;

  // Eventos
  getAllEventos(): Promise<Evento[]>;
  getEvento(id: string): Promise<Evento | undefined>;
  createEvento(evento: InsertEvento): Promise<Evento>;
  updateEvento(id: string, evento: InsertEvento): Promise<Evento | undefined>;
  deleteEvento(id: string): Promise<boolean>;

  // Voluntarios
  getAllVoluntarios(): Promise<Voluntario[]>;
  getVoluntario(id: string): Promise<Voluntario | undefined>;
  getVoluntariosPorEvento(eventoId: string): Promise<Voluntario[]>;
  createVoluntario(voluntario: InsertVoluntario): Promise<Voluntario>;
  updateVoluntario(id: string, voluntario: InsertVoluntario): Promise<Voluntario | undefined>;
  deleteVoluntario(id: string): Promise<boolean>;

  // Export/Import
  exportAll(): Promise<{
    feligreses: Feligres[];
    sacramentos: Sacramento[];
    grupos: Grupo[];
    miembrosGrupo: MiembroGrupo[];
    eventos: Evento[];
    voluntarios: Voluntario[];
  }>;
  importAll(data: {
    feligreses?: Feligres[];
    sacramentos?: Sacramento[];
    grupos?: Grupo[];
    miembrosGrupo?: MiembroGrupo[];
    eventos?: Evento[];
    voluntarios?: Voluntario[];
  }): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private feligreses: Map<string, Feligres>;
  private sacramentos: Map<string, Sacramento>;
  private grupos: Map<string, Grupo>;
  private miembrosGrupo: Map<string, MiembroGrupo>;
  private eventos: Map<string, Evento>;
  private voluntarios: Map<string, Voluntario>;

  constructor() {
    this.users = new Map();
    this.feligreses = new Map();
    this.sacramentos = new Map();
    this.grupos = new Map();
    this.miembrosGrupo = new Map();
    this.eventos = new Map();
    this.voluntarios = new Map();
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  // Feligreses
  async getAllFeligreses(): Promise<Feligres[]> {
    return Array.from(this.feligreses.values());
  }

  async getFeligres(id: string): Promise<Feligres | undefined> {
    return this.feligreses.get(id);
  }

  async createFeligres(insertFeligres: InsertFeligres): Promise<Feligres> {
    const id = randomUUID();
    const now = new Date();
    const feligres: Feligres = {
      ...insertFeligres,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.feligreses.set(id, feligres);
    return feligres;
  }

  async updateFeligres(id: string, insertFeligres: InsertFeligres): Promise<Feligres | undefined> {
    const existing = this.feligreses.get(id);
    if (!existing) return undefined;

    const updated: Feligres = {
      ...insertFeligres,
      id,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    };
    this.feligreses.set(id, updated);
    return updated;
  }

  async deleteFeligres(id: string): Promise<boolean> {
    return this.feligreses.delete(id);
  }

  // Sacramentos
  async getAllSacramentos(): Promise<Sacramento[]> {
    return Array.from(this.sacramentos.values());
  }

  async getSacramento(id: string): Promise<Sacramento | undefined> {
    return this.sacramentos.get(id);
  }

  async createSacramento(insertSacramento: InsertSacramento): Promise<Sacramento> {
    const id = randomUUID();
    const sacramento: Sacramento = {
      ...insertSacramento,
      id,
      createdAt: new Date(),
    };
    this.sacramentos.set(id, sacramento);
    return sacramento;
  }

  async updateSacramento(id: string, insertSacramento: InsertSacramento): Promise<Sacramento | undefined> {
    const existing = this.sacramentos.get(id);
    if (!existing) return undefined;

    const updated: Sacramento = {
      ...insertSacramento,
      id,
      createdAt: existing.createdAt,
    };
    this.sacramentos.set(id, updated);
    return updated;
  }

  async deleteSacramento(id: string): Promise<boolean> {
    return this.sacramentos.delete(id);
  }

  // Grupos
  async getAllGrupos(): Promise<Grupo[]> {
    return Array.from(this.grupos.values());
  }

  async getGrupo(id: string): Promise<Grupo | undefined> {
    return this.grupos.get(id);
  }

  async createGrupo(insertGrupo: InsertGrupo): Promise<Grupo> {
    const id = randomUUID();
    const grupo: Grupo = {
      ...insertGrupo,
      id,
      createdAt: new Date(),
    };
    this.grupos.set(id, grupo);
    return grupo;
  }

  async updateGrupo(id: string, insertGrupo: InsertGrupo): Promise<Grupo | undefined> {
    const existing = this.grupos.get(id);
    if (!existing) return undefined;

    const updated: Grupo = {
      ...insertGrupo,
      id,
      createdAt: existing.createdAt,
    };
    this.grupos.set(id, updated);
    return updated;
  }

  async deleteGrupo(id: string): Promise<boolean> {
    return this.grupos.delete(id);
  }

  // Miembros de Grupo
  async getAllMiembrosGrupo(): Promise<MiembroGrupo[]> {
    return Array.from(this.miembrosGrupo.values());
  }

  async getMiembrosGrupoPorGrupo(grupoId: string): Promise<MiembroGrupo[]> {
    return Array.from(this.miembrosGrupo.values()).filter(
      (miembro) => miembro.grupoId === grupoId
    );
  }

  async createMiembroGrupo(insertMiembro: InsertMiembroGrupo): Promise<MiembroGrupo> {
    const id = randomUUID();
    const miembro: MiembroGrupo = {
      ...insertMiembro,
      id,
    };
    this.miembrosGrupo.set(id, miembro);
    return miembro;
  }

  async deleteMiembroGrupo(id: string): Promise<boolean> {
    return this.miembrosGrupo.delete(id);
  }

  // Eventos
  async getAllEventos(): Promise<Evento[]> {
    return Array.from(this.eventos.values());
  }

  async getEvento(id: string): Promise<Evento | undefined> {
    return this.eventos.get(id);
  }

  async createEvento(insertEvento: InsertEvento): Promise<Evento> {
    const id = randomUUID();
    const evento: Evento = {
      ...insertEvento,
      id,
      createdAt: new Date(),
    };
    this.eventos.set(id, evento);
    return evento;
  }

  async updateEvento(id: string, insertEvento: InsertEvento): Promise<Evento | undefined> {
    const existing = this.eventos.get(id);
    if (!existing) return undefined;

    const updated: Evento = {
      ...insertEvento,
      id,
      createdAt: existing.createdAt,
    };
    this.eventos.set(id, updated);
    return updated;
  }

  async deleteEvento(id: string): Promise<boolean> {
    return this.eventos.delete(id);
  }

  // Voluntarios
  async getAllVoluntarios(): Promise<Voluntario[]> {
    return Array.from(this.voluntarios.values());
  }

  async getVoluntario(id: string): Promise<Voluntario | undefined> {
    return this.voluntarios.get(id);
  }

  async getVoluntariosPorEvento(eventoId: string): Promise<Voluntario[]> {
    return Array.from(this.voluntarios.values()).filter(
      (voluntario) => voluntario.eventoId === eventoId
    );
  }

  async createVoluntario(insertVoluntario: InsertVoluntario): Promise<Voluntario> {
    const id = randomUUID();
    const voluntario: Voluntario = {
      ...insertVoluntario,
      id,
      fechaInscripcion: new Date(),
    };
    this.voluntarios.set(id, voluntario);
    return voluntario;
  }

  async updateVoluntario(id: string, insertVoluntario: InsertVoluntario): Promise<Voluntario | undefined> {
    const existing = this.voluntarios.get(id);
    if (!existing) return undefined;

    const updated: Voluntario = {
      ...insertVoluntario,
      id,
      fechaInscripcion: existing.fechaInscripcion,
    };
    this.voluntarios.set(id, updated);
    return updated;
  }

  async deleteVoluntario(id: string): Promise<boolean> {
    return this.voluntarios.delete(id);
  }

  // Export/Import
  async exportAll() {
    return {
      feligreses: Array.from(this.feligreses.values()),
      sacramentos: Array.from(this.sacramentos.values()),
      grupos: Array.from(this.grupos.values()),
      miembrosGrupo: Array.from(this.miembrosGrupo.values()),
      eventos: Array.from(this.eventos.values()),
      voluntarios: Array.from(this.voluntarios.values()),
    };
  }

  async importAll(data: {
    feligreses?: Feligres[];
    sacramentos?: Sacramento[];
    grupos?: Grupo[];
    miembrosGrupo?: MiembroGrupo[];
    eventos?: Evento[];
    voluntarios?: Voluntario[];
  }) {
    // Clear existing data
    this.feligreses.clear();
    this.sacramentos.clear();
    this.grupos.clear();
    this.miembrosGrupo.clear();
    this.eventos.clear();
    this.voluntarios.clear();

    // Import new data
    if (data.feligreses) {
      data.feligreses.forEach(f => this.feligreses.set(f.id, f));
    }
    if (data.sacramentos) {
      data.sacramentos.forEach(s => this.sacramentos.set(s.id, s));
    }
    if (data.grupos) {
      data.grupos.forEach(g => this.grupos.set(g.id, g));
    }
    if (data.miembrosGrupo) {
      data.miembrosGrupo.forEach(m => this.miembrosGrupo.set(m.id, m));
    }
    if (data.eventos) {
      data.eventos.forEach(e => this.eventos.set(e.id, e));
    }
    if (data.voluntarios) {
      data.voluntarios.forEach(v => this.voluntarios.set(v.id, v));
    }
  }
}

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import * as schema from "@shared/schema";

export class PostgresStorage implements IStorage {
  private db;

  constructor(databaseUrl: string) {
    const sql = neon(databaseUrl);
    this.db = drizzle(sql, { schema });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(schema.users).where(eq(schema.users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(schema.users).where(eq(schema.users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(schema.users).values(insertUser).returning();
    return result[0];
  }

  // Feligreses
  async getAllFeligreses(): Promise<Feligres[]> {
    return await this.db.select().from(schema.feligreses);
  }

  async getFeligres(id: string): Promise<Feligres | undefined> {
    const result = await this.db.select().from(schema.feligreses).where(eq(schema.feligreses.id, id));
    return result[0];
  }

  async createFeligres(insertFeligres: InsertFeligres): Promise<Feligres> {
    const result = await this.db.insert(schema.feligreses).values(insertFeligres).returning();
    return result[0];
  }

  async updateFeligres(id: string, insertFeligres: InsertFeligres): Promise<Feligres | undefined> {
    const result = await this.db.update(schema.feligreses)
      .set({ ...insertFeligres, updatedAt: new Date() })
      .where(eq(schema.feligreses.id, id))
      .returning();
    return result[0];
  }

  async deleteFeligres(id: string): Promise<boolean> {
    const result = await this.db.delete(schema.feligreses).where(eq(schema.feligreses.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Sacramentos
  async getAllSacramentos(): Promise<Sacramento[]> {
    return await this.db.select().from(schema.sacramentos);
  }

  async getSacramento(id: string): Promise<Sacramento | undefined> {
    const result = await this.db.select().from(schema.sacramentos).where(eq(schema.sacramentos.id, id));
    return result[0];
  }

  async createSacramento(insertSacramento: InsertSacramento): Promise<Sacramento> {
    const result = await this.db.insert(schema.sacramentos).values(insertSacramento).returning();
    return result[0];
  }

  async updateSacramento(id: string, insertSacramento: InsertSacramento): Promise<Sacramento | undefined> {
    const result = await this.db.update(schema.sacramentos)
      .set(insertSacramento)
      .where(eq(schema.sacramentos.id, id))
      .returning();
    return result[0];
  }

  async deleteSacramento(id: string): Promise<boolean> {
    const result = await this.db.delete(schema.sacramentos).where(eq(schema.sacramentos.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Grupos
  async getAllGrupos(): Promise<Grupo[]> {
    return await this.db.select().from(schema.grupos);
  }

  async getGrupo(id: string): Promise<Grupo | undefined> {
    const result = await this.db.select().from(schema.grupos).where(eq(schema.grupos.id, id));
    return result[0];
  }

  async createGrupo(insertGrupo: InsertGrupo): Promise<Grupo> {
    const result = await this.db.insert(schema.grupos).values(insertGrupo).returning();
    return result[0];
  }

  async updateGrupo(id: string, insertGrupo: InsertGrupo): Promise<Grupo | undefined> {
    const result = await this.db.update(schema.grupos)
      .set(insertGrupo)
      .where(eq(schema.grupos.id, id))
      .returning();
    return result[0];
  }

  async deleteGrupo(id: string): Promise<boolean> {
    const result = await this.db.delete(schema.grupos).where(eq(schema.grupos.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Miembros de Grupo
  async getAllMiembrosGrupo(): Promise<MiembroGrupo[]> {
    return await this.db.select().from(schema.miembrosGrupo);
  }

  async getMiembrosGrupoPorGrupo(grupoId: string): Promise<MiembroGrupo[]> {
    return await this.db.select().from(schema.miembrosGrupo).where(eq(schema.miembrosGrupo.grupoId, grupoId));
  }

  async createMiembroGrupo(insertMiembro: InsertMiembroGrupo): Promise<MiembroGrupo> {
    const result = await this.db.insert(schema.miembrosGrupo).values(insertMiembro).returning();
    return result[0];
  }

  async deleteMiembroGrupo(id: string): Promise<boolean> {
    const result = await this.db.delete(schema.miembrosGrupo).where(eq(schema.miembrosGrupo.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Eventos
  async getAllEventos(): Promise<Evento[]> {
    return await this.db.select().from(schema.eventos);
  }

  async getEvento(id: string): Promise<Evento | undefined> {
    const result = await this.db.select().from(schema.eventos).where(eq(schema.eventos.id, id));
    return result[0];
  }

  async createEvento(insertEvento: InsertEvento): Promise<Evento> {
    const result = await this.db.insert(schema.eventos).values(insertEvento).returning();
    return result[0];
  }

  async updateEvento(id: string, insertEvento: InsertEvento): Promise<Evento | undefined> {
    const result = await this.db.update(schema.eventos)
      .set(insertEvento)
      .where(eq(schema.eventos.id, id))
      .returning();
    return result[0];
  }

  async deleteEvento(id: string): Promise<boolean> {
    const result = await this.db.delete(schema.eventos).where(eq(schema.eventos.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Voluntarios
  async getAllVoluntarios(): Promise<Voluntario[]> {
    return await this.db.select().from(schema.voluntarios);
  }

  async getVoluntario(id: string): Promise<Voluntario | undefined> {
    const result = await this.db.select().from(schema.voluntarios).where(eq(schema.voluntarios.id, id));
    return result[0];
  }

  async getVoluntariosPorEvento(eventoId: string): Promise<Voluntario[]> {
    return await this.db.select().from(schema.voluntarios).where(eq(schema.voluntarios.eventoId, eventoId));
  }

  async createVoluntario(insertVoluntario: InsertVoluntario): Promise<Voluntario> {
    const result = await this.db.insert(schema.voluntarios).values(insertVoluntario).returning();
    return result[0];
  }

  async updateVoluntario(id: string, insertVoluntario: InsertVoluntario): Promise<Voluntario | undefined> {
    const result = await this.db.update(schema.voluntarios)
      .set(insertVoluntario)
      .where(eq(schema.voluntarios.id, id))
      .returning();
    return result[0];
  }

  async deleteVoluntario(id: string): Promise<boolean> {
    const result = await this.db.delete(schema.voluntarios).where(eq(schema.voluntarios.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Export/Import
  async exportAll() {
    const [feligreses, sacramentos, grupos, miembrosGrupo, eventos, voluntarios] = await Promise.all([
      this.db.select().from(schema.feligreses),
      this.db.select().from(schema.sacramentos),
      this.db.select().from(schema.grupos),
      this.db.select().from(schema.miembrosGrupo),
      this.db.select().from(schema.eventos),
      this.db.select().from(schema.voluntarios),
    ]);

    return { feligreses, sacramentos, grupos, miembrosGrupo, eventos, voluntarios };
  }

  async importAll(data: {
    feligreses?: Feligres[];
    sacramentos?: Sacramento[];
    grupos?: Grupo[];
    miembrosGrupo?: MiembroGrupo[];
    eventos?: Evento[];
    voluntarios?: Voluntario[];
  }) {
    // Delete existing data
    await Promise.all([
      this.db.delete(schema.voluntarios),
      this.db.delete(schema.miembrosGrupo),
      this.db.delete(schema.eventos),
      this.db.delete(schema.sacramentos),
      this.db.delete(schema.grupos),
      this.db.delete(schema.feligreses),
    ]);

    // Insert new data
    if (data.feligreses && data.feligreses.length > 0) {
      await this.db.insert(schema.feligreses).values(data.feligreses);
    }
    if (data.sacramentos && data.sacramentos.length > 0) {
      await this.db.insert(schema.sacramentos).values(data.sacramentos);
    }
    if (data.grupos && data.grupos.length > 0) {
      await this.db.insert(schema.grupos).values(data.grupos);
    }
    if (data.miembrosGrupo && data.miembrosGrupo.length > 0) {
      await this.db.insert(schema.miembrosGrupo).values(data.miembrosGrupo);
    }
    if (data.eventos && data.eventos.length > 0) {
      await this.db.insert(schema.eventos).values(data.eventos);
    }
    if (data.voluntarios && data.voluntarios.length > 0) {
      await this.db.insert(schema.voluntarios).values(data.voluntarios);
    }
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

export const storage = new PostgresStorage(process.env.DATABASE_URL);
