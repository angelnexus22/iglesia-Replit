import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertFeligresSchema,
  insertSacramentoSchema,
  insertGrupoSchema,
  insertMiembroGrupoSchema,
  insertEventoSchema,
  insertVoluntarioSchema,
  insertUserSchema,
} from "@shared/schema";
import bcrypt from "bcrypt";
import { generateCertificadoPDF } from "./utils/certificadoPDF";
import { seedDatabase } from "./seed-data";

export async function registerRoutes(app: Express): Promise<Server> {
  // ============================================
  // AUTENTICACIÓN
  // ============================================
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password, nombre, rol } = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "El nombre de usuario ya está en uso" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        nombre,
        rol,
      });

      req.session!.userId = user.id;
      req.session!.userRole = user.rol;
      req.session!.userName = user.nombre;

      res.status(201).json({
        id: user.id,
        username: user.username,
        nombre: user.nombre,
        rol: user.rol,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Error al registrar usuario" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const loginSchema = insertUserSchema.pick({ username: true, password: true });
      const { username, password } = loginSchema.parse(req.body);

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
      }

      req.session!.userId = user.id;
      req.session!.userRole = user.rol;
      req.session!.userName = user.nombre;

      res.json({
        id: user.id,
        username: user.username,
        nombre: user.nombre,
        rol: user.rol,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Datos inválidos" });
      }
      res.status(500).json({ error: "Error al iniciar sesión" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Error al cerrar sesión" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Sesión cerrada exitosamente" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "No autenticado" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.json({
        id: user.id,
        username: user.username,
        nombre: user.nombre,
        rol: user.rol,
      });
    } catch (error) {
      res.status(500).json({ error: "Error al obtener información del usuario" });
    }
  });

  // ============================================
  // FELIGRESES
  // ============================================
  app.get("/api/feligreses", async (req, res) => {
    try {
      const feligreses = await storage.getAllFeligreses();
      res.json(feligreses);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener feligreses" });
    }
  });

  app.get("/api/feligreses/:id", async (req, res) => {
    try {
      const feligres = await storage.getFeligres(req.params.id);
      if (!feligres) {
        return res.status(404).json({ error: "Feligrés no encontrado" });
      }
      res.json(feligres);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener feligrés" });
    }
  });

  app.post("/api/feligreses", async (req, res) => {
    try {
      const data = insertFeligresSchema.parse(req.body);
      const feligres = await storage.createFeligres(data);
      res.status(201).json(feligres);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Datos inválidos" });
    }
  });

  app.patch("/api/feligreses/:id", async (req, res) => {
    try {
      const data = insertFeligresSchema.parse(req.body);
      const feligres = await storage.updateFeligres(req.params.id, data);
      if (!feligres) {
        return res.status(404).json({ error: "Feligrés no encontrado" });
      }
      res.json(feligres);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Datos inválidos" });
    }
  });

  app.delete("/api/feligreses/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteFeligres(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Feligrés no encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar feligrés" });
    }
  });

  // ============================================
  // SACRAMENTOS
  // ============================================
  app.get("/api/sacramentos", async (req, res) => {
    try {
      const sacramentos = await storage.getAllSacramentos();
      res.json(sacramentos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener sacramentos" });
    }
  });

  app.get("/api/sacramentos/:id", async (req, res) => {
    try {
      const sacramento = await storage.getSacramento(req.params.id);
      if (!sacramento) {
        return res.status(404).json({ error: "Sacramento no encontrado" });
      }
      res.json(sacramento);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener sacramento" });
    }
  });

  app.post("/api/sacramentos", async (req, res) => {
    try {
      const data = insertSacramentoSchema.parse(req.body);
      const sacramento = await storage.createSacramento(data);
      res.status(201).json(sacramento);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Datos inválidos" });
    }
  });

  app.patch("/api/sacramentos/:id", async (req, res) => {
    try {
      const data = insertSacramentoSchema.parse(req.body);
      const sacramento = await storage.updateSacramento(req.params.id, data);
      if (!sacramento) {
        return res.status(404).json({ error: "Sacramento no encontrado" });
      }
      res.json(sacramento);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Datos inválidos" });
    }
  });

  app.delete("/api/sacramentos/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteSacramento(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Sacramento no encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar sacramento" });
    }
  });

  // Generar certificado PDF de sacramento
  app.get("/api/sacramentos/:id/certificado", async (req, res) => {
    try {
      const sacramento = await storage.getSacramento(req.params.id);
      if (!sacramento) {
        return res.status(404).json({ error: "Sacramento no encontrado" });
      }

      const { generarCertificadoPDF } = await import("./utils/certificadoPDF");
      const doc = generarCertificadoPDF(sacramento);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="certificado-${sacramento.tipo}-${sacramento.nombreFeligres.replace(/\s+/g, "_")}.pdf"`
      );

      doc.pipe(res);
      doc.end();
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Error al generar certificado" });
    }
  });

  // ============================================
  // GRUPOS
  // ============================================
  app.get("/api/grupos", async (req, res) => {
    try {
      const grupos = await storage.getAllGrupos();
      res.json(grupos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener grupos" });
    }
  });

  app.get("/api/grupos/:id", async (req, res) => {
    try {
      const grupo = await storage.getGrupo(req.params.id);
      if (!grupo) {
        return res.status(404).json({ error: "Grupo no encontrado" });
      }
      res.json(grupo);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener grupo" });
    }
  });

  app.post("/api/grupos", async (req, res) => {
    try {
      const data = insertGrupoSchema.parse(req.body);
      const grupo = await storage.createGrupo(data);
      res.status(201).json(grupo);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Datos inválidos" });
    }
  });

  app.patch("/api/grupos/:id", async (req, res) => {
    try {
      const data = insertGrupoSchema.parse(req.body);
      const grupo = await storage.updateGrupo(req.params.id, data);
      if (!grupo) {
        return res.status(404).json({ error: "Grupo no encontrado" });
      }
      res.json(grupo);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Datos inválidos" });
    }
  });

  app.delete("/api/grupos/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteGrupo(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Grupo no encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar grupo" });
    }
  });

  // ============================================
  // MIEMBROS DE GRUPO
  // ============================================
  app.get("/api/miembros-grupo", async (req, res) => {
    try {
      const grupoId = req.query.grupoId as string | undefined;
      if (grupoId) {
        const miembros = await storage.getMiembrosGrupoPorGrupo(grupoId);
        res.json(miembros);
      } else {
        const miembros = await storage.getAllMiembrosGrupo();
        res.json(miembros);
      }
    } catch (error) {
      res.status(500).json({ error: "Error al obtener miembros" });
    }
  });

  app.post("/api/miembros-grupo", async (req, res) => {
    try {
      const data = insertMiembroGrupoSchema.parse(req.body);
      const miembro = await storage.createMiembroGrupo(data);
      res.status(201).json(miembro);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Datos inválidos" });
    }
  });

  app.delete("/api/miembros-grupo/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteMiembroGrupo(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Miembro no encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar miembro" });
    }
  });

  // ============================================
  // EVENTOS
  // ============================================
  app.get("/api/eventos", async (req, res) => {
    try {
      const eventos = await storage.getAllEventos();
      res.json(eventos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener eventos" });
    }
  });

  app.get("/api/eventos/:id", async (req, res) => {
    try {
      const evento = await storage.getEvento(req.params.id);
      if (!evento) {
        return res.status(404).json({ error: "Evento no encontrado" });
      }
      res.json(evento);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener evento" });
    }
  });

  app.post("/api/eventos", async (req, res) => {
    try {
      const data = insertEventoSchema.parse(req.body);
      const evento = await storage.createEvento(data);
      res.status(201).json(evento);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Datos inválidos" });
    }
  });

  app.patch("/api/eventos/:id", async (req, res) => {
    try {
      const data = insertEventoSchema.parse(req.body);
      const evento = await storage.updateEvento(req.params.id, data);
      if (!evento) {
        return res.status(404).json({ error: "Evento no encontrado" });
      }
      res.json(evento);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Datos inválidos" });
    }
  });

  app.delete("/api/eventos/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteEvento(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Evento no encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar evento" });
    }
  });

  // ============================================
  // VOLUNTARIOS
  // ============================================
  app.get("/api/voluntarios", async (req, res) => {
    try {
      const eventoId = req.query.eventoId as string | undefined;
      if (eventoId) {
        const voluntarios = await storage.getVoluntariosPorEvento(eventoId);
        res.json(voluntarios);
      } else {
        const voluntarios = await storage.getAllVoluntarios();
        res.json(voluntarios);
      }
    } catch (error) {
      res.status(500).json({ error: "Error al obtener voluntarios" });
    }
  });

  app.get("/api/voluntarios/:id", async (req, res) => {
    try {
      const voluntario = await storage.getVoluntario(req.params.id);
      if (!voluntario) {
        return res.status(404).json({ error: "Voluntario no encontrado" });
      }
      res.json(voluntario);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener voluntario" });
    }
  });

  app.post("/api/voluntarios", async (req, res) => {
    try {
      const data = insertVoluntarioSchema.parse(req.body);
      const voluntario = await storage.createVoluntario(data);
      res.status(201).json(voluntario);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Datos inválidos" });
    }
  });

  app.patch("/api/voluntarios/:id", async (req, res) => {
    try {
      const data = insertVoluntarioSchema.parse(req.body);
      const voluntario = await storage.updateVoluntario(req.params.id, data);
      if (!voluntario) {
        return res.status(404).json({ error: "Voluntario no encontrado" });
      }
      res.json(voluntario);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Datos inválidos" });
    }
  });

  app.delete("/api/voluntarios/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteVoluntario(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Voluntario no encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar voluntario" });
    }
  });

  // ============================================
  // EXPORT / IMPORT
  // ============================================
  app.get("/api/export", async (req, res) => {
    try {
      const data = await storage.exportAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Error al exportar datos" });
    }
  });

  app.post("/api/import", async (req, res) => {
    try {
      await storage.importAll(req.body);
      res.json({ success: true, message: "Datos importados exitosamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al importar datos" });
    }
  });

  // ============================================
  // UTILIDADES Y DESARROLLO
  // ============================================
  // NOTA: Este endpoint solo está habilitado en desarrollo y requiere autenticación de párroco
  app.post("/api/seed", async (req, res) => {
    try {
      // Solo permitir en desarrollo
      if (process.env.NODE_ENV === "production") {
        return res.status(403).json({ error: "Endpoint no disponible en producción" });
      }

      // Requerir autenticación de párroco
      if (!req.session?.userId || req.session?.userRole !== "parroco") {
        return res.status(401).json({ error: "Se requiere autenticación de párroco" });
      }

      await seedDatabase();
      res.json({ message: "Base de datos llenada con datos de ejemplo exitosamente" });
    } catch (error: any) {
      console.error("Error al ejecutar seed:", error);
      res.status(500).json({ error: "Error al llenar la base de datos" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
