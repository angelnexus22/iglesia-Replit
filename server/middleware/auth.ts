import type { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    nombre: string;
    rol: "parroco" | "coordinador" | "voluntario";
  };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "No autorizado. Debe iniciar sesión." });
  }
  next();
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "No autorizado. Debe iniciar sesión." });
    }

    const userRole = req.session.userRole;
    if (!roles.includes(userRole)) {
      return res.status(403).json({ 
        error: "No tiene permisos suficientes para realizar esta acción." 
      });
    }

    next();
  };
}

declare module 'express-session' {
  interface SessionData {
    userId: string;
    userRole: string;
    userName: string;
  }
}
