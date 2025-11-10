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
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}
