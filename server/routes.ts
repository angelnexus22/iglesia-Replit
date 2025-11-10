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
  insertCategoriaFinancieraSchema,
  insertTransaccionSchema,
  insertPresupuestoSchema,
  insertArticuloInventarioSchema,
  insertMovimientoInventarioSchema,
  insertPrestamoSchema,
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
  // CATEGORÍAS FINANCIERAS
  // ============================================
  app.get("/api/categorias-financieras", async (req, res) => {
    try {
      const categorias = await storage.getAllCategoriasFinancieras();
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener categorías financieras" });
    }
  });

  app.get("/api/categorias-financieras/:id", async (req, res) => {
    try {
      const categoria = await storage.getCategoriaFinanciera(req.params.id);
      if (!categoria) {
        return res.status(404).json({ error: "Categoría financiera no encontrada" });
      }
      res.json(categoria);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener categoría financiera" });
    }
  });

  app.post("/api/categorias-financieras", async (req, res) => {
    try {
      const data = insertCategoriaFinancieraSchema.parse(req.body);
      const categoria = await storage.createCategoriaFinanciera(data);
      res.status(201).json(categoria);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Datos inválidos" });
    }
  });

  app.patch("/api/categorias-financieras/:id", async (req, res) => {
    try {
      const data = insertCategoriaFinancieraSchema.parse(req.body);
      const categoria = await storage.updateCategoriaFinanciera(req.params.id, data);
      if (!categoria) {
        return res.status(404).json({ error: "Categoría financiera no encontrada" });
      }
      res.json(categoria);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Datos inválidos" });
    }
  });

  app.delete("/api/categorias-financieras/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCategoriaFinanciera(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Categoría financiera no encontrada" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar categoría financiera" });
    }
  });

  // ============================================
  // TRANSACCIONES
  // ============================================
  app.get("/api/transacciones", async (req, res) => {
    try {
      const transacciones = await storage.getAllTransacciones();
      res.json(transacciones);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener transacciones" });
    }
  });

  app.get("/api/transacciones/:id", async (req, res) => {
    try {
      const transaccion = await storage.getTransaccion(req.params.id);
      if (!transaccion) {
        return res.status(404).json({ error: "Transacción no encontrada" });
      }
      res.json(transaccion);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener transacción" });
    }
  });

  app.post("/api/transacciones", async (req, res) => {
    try {
      const data = insertTransaccionSchema.parse(req.body);
      const transaccion = await storage.createTransaccion(data);
      res.status(201).json(transaccion);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Datos inválidos" });
    }
  });

  app.patch("/api/transacciones/:id", async (req, res) => {
    try {
      const data = insertTransaccionSchema.parse(req.body);
      const transaccion = await storage.updateTransaccion(req.params.id, data);
      if (!transaccion) {
        return res.status(404).json({ error: "Transacción no encontrada" });
      }
      res.json(transaccion);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Datos inválidos" });
    }
  });

  app.delete("/api/transacciones/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteTransaccion(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Transacción no encontrada" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar transacción" });
    }
  });

  // ============================================
  // PRESUPUESTOS
  // ============================================
  app.get("/api/presupuestos", async (req, res) => {
    try {
      const presupuestos = await storage.getAllPresupuestos();
      res.json(presupuestos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener presupuestos" });
    }
  });

  app.get("/api/presupuestos/:id", async (req, res) => {
    try {
      const presupuesto = await storage.getPresupuesto(req.params.id);
      if (!presupuesto) {
        return res.status(404).json({ error: "Presupuesto no encontrado" });
      }
      res.json(presupuesto);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener presupuesto" });
    }
  });

  app.get("/api/presupuestos/mes/:mes", async (req, res) => {
    try {
      const presupuestos = await storage.getPresupuestosPorMes(req.params.mes);
      res.json(presupuestos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener presupuestos por mes" });
    }
  });

  app.post("/api/presupuestos", async (req, res) => {
    try {
      const data = insertPresupuestoSchema.parse(req.body);
      const presupuesto = await storage.createPresupuesto(data);
      res.status(201).json(presupuesto);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Datos inválidos" });
    }
  });

  app.patch("/api/presupuestos/:id", async (req, res) => {
    try {
      const data = insertPresupuestoSchema.parse(req.body);
      const presupuesto = await storage.updatePresupuesto(req.params.id, data);
      if (!presupuesto) {
        return res.status(404).json({ error: "Presupuesto no encontrado" });
      }
      res.json(presupuesto);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Datos inválidos" });
    }
  });

  app.delete("/api/presupuestos/:id", async (req, res) => {
    try {
      const deleted = await storage.deletePresupuesto(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Presupuesto no encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar presupuesto" });
    }
  });

  // ============================================
  // ARTÍCULOS INVENTARIO
  // ============================================
  app.get("/api/articulos-inventario", async (req, res) => {
    try {
      const articulos = await storage.getAllArticulosInventario();
      res.json(articulos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener artículos de inventario" });
    }
  });

  app.get("/api/articulos-inventario/:id", async (req, res) => {
    try {
      const articulo = await storage.getArticuloInventario(req.params.id);
      if (!articulo) {
        return res.status(404).json({ error: "Artículo de inventario no encontrado" });
      }
      res.json(articulo);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener artículo de inventario" });
    }
  });

  app.post("/api/articulos-inventario", async (req, res) => {
    try {
      const data = insertArticuloInventarioSchema.parse(req.body);
      const articulo = await storage.createArticuloInventario(data);
      res.status(201).json(articulo);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Datos inválidos" });
    }
  });

  app.patch("/api/articulos-inventario/:id", async (req, res) => {
    try {
      const data = insertArticuloInventarioSchema.parse(req.body);
      const articulo = await storage.updateArticuloInventario(req.params.id, data);
      if (!articulo) {
        return res.status(404).json({ error: "Artículo de inventario no encontrado" });
      }
      res.json(articulo);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Datos inválidos" });
    }
  });

  app.delete("/api/articulos-inventario/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteArticuloInventario(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Artículo de inventario no encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar artículo de inventario" });
    }
  });

  // ============================================
  // MOVIMIENTOS INVENTARIO
  // ============================================
  app.get("/api/movimientos-inventario", async (req, res) => {
    try {
      const movimientos = await storage.getAllMovimientosInventario();
      res.json(movimientos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener movimientos de inventario" });
    }
  });

  app.get("/api/movimientos-inventario/:id", async (req, res) => {
    try {
      const movimiento = await storage.getMovimientoInventario(req.params.id);
      if (!movimiento) {
        return res.status(404).json({ error: "Movimiento de inventario no encontrado" });
      }
      res.json(movimiento);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener movimiento de inventario" });
    }
  });

  app.get("/api/movimientos-inventario/articulo/:articuloId", async (req, res) => {
    try {
      const movimientos = await storage.getMovimientosPorArticulo(req.params.articuloId);
      res.json(movimientos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener movimientos por artículo" });
    }
  });

  app.post("/api/movimientos-inventario", async (req, res) => {
    try {
      const data = insertMovimientoInventarioSchema.parse(req.body);
      const movimiento = await storage.createMovimientoInventario(data);
      
      // Actualizar stock del artículo
      const articulo = await storage.getArticuloInventario(data.articuloId);
      if (articulo) {
        const stockActual = parseInt(articulo.stockActual || "0");
        const cantidad = parseInt(data.cantidad);
        const nuevoStock = data.tipo === "entrada" 
          ? stockActual + cantidad 
          : stockActual - cantidad;
        
        await storage.updateArticuloInventario(data.articuloId, {
          stockActual: nuevoStock.toString()
        });
      }
      
      res.status(201).json(movimiento);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Datos inválidos" });
    }
  });

  // ============================================
  // PRÉSTAMOS
  // ============================================
  app.get("/api/prestamos", async (req, res) => {
    try {
      const prestamos = await storage.getAllPrestamos();
      res.json(prestamos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener préstamos" });
    }
  });

  app.get("/api/prestamos/:id", async (req, res) => {
    try {
      const prestamo = await storage.getPrestamo(req.params.id);
      if (!prestamo) {
        return res.status(404).json({ error: "Préstamo no encontrado" });
      }
      res.json(prestamo);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener préstamo" });
    }
  });

  app.get("/api/prestamos/estado/:estado", async (req, res) => {
    try {
      const prestamos = await storage.getPrestamosPorEstado(req.params.estado);
      res.json(prestamos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener préstamos por estado" });
    }
  });

  app.post("/api/prestamos", async (req, res) => {
    try {
      const data = insertPrestamoSchema.parse(req.body);
      const prestamo = await storage.createPrestamo(data);
      res.status(201).json(prestamo);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Datos inválidos" });
    }
  });

  app.patch("/api/prestamos/:id", async (req, res) => {
    try {
      const data = insertPrestamoSchema.parse(req.body);
      const prestamo = await storage.updatePrestamo(req.params.id, data);
      if (!prestamo) {
        return res.status(404).json({ error: "Préstamo no encontrado" });
      }
      res.json(prestamo);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Datos inválidos" });
    }
  });

  app.delete("/api/prestamos/:id", async (req, res) => {
    try {
      const deleted = await storage.deletePrestamo(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Préstamo no encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar préstamo" });
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
