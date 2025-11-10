import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { feligreses, sacramentos, grupos, miembrosGrupo, eventos, voluntarios } from "@shared/schema";
import * as schema from "@shared/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

export async function seedDatabase() {
  console.log("🌱 Iniciando seed de datos de ejemplo...");

  try {
    // Limpiar datos existentes (excepto usuarios)
    await db.delete(voluntarios);
    await db.delete(miembrosGrupo);
    await db.delete(eventos);
    await db.delete(grupos);
    await db.delete(sacramentos);
    await db.delete(feligreses);

    // 1. FELIGRESES
    console.log("📝 Creando feligreses...");
    const feligresesData = await db.insert(feligreses).values([
      {
        nombre: "María",
        apellidoPaterno: "García",
        apellidoMaterno: "López",
        fechaNacimiento: "1985-03-15",
        telefono: "477-123-4567",
        email: "maria.garcia@example.com",
        direccion: "Calle Hidalgo 123",
        barrio: "Centro",
        bautizado: true,
        confirmado: true,
        casado: true,
        nombrePadre: "José García Hernández",
        nombreMadre: "Rosa López Martínez",
        nombrePareja: "Pedro Ramírez Sánchez",
        activo: true,
      },
      {
        nombre: "Juan",
        apellidoPaterno: "Hernández",
        apellidoMaterno: "Ruiz",
        fechaNacimiento: "1990-07-22",
        telefono: "477-234-5678",
        email: "juan.hernandez@example.com",
        direccion: "Av. Juárez 456",
        barrio: "San Juan",
        bautizado: true,
        confirmado: true,
        casado: false,
        nombrePadre: "Carlos Hernández Pérez",
        nombreMadre: "Ana Ruiz González",
        activo: true,
      },
      {
        nombre: "Guadalupe",
        apellidoPaterno: "Martínez",
        apellidoMaterno: "Torres",
        fechaNacimiento: "1978-12-12",
        telefono: "477-345-6789",
        email: "lupe.martinez@example.com",
        direccion: "Calle Morelos 789",
        barrio: "La Luz",
        bautizado: true,
        confirmado: true,
        casado: true,
        nombrePadre: "Francisco Martínez Silva",
        nombreMadre: "Carmen Torres Ramírez",
        nombrePareja: "Roberto Flores Díaz",
        activo: true,
      },
      {
        nombre: "José Luis",
        apellidoPaterno: "Ramírez",
        apellidoMaterno: "Flores",
        fechaNacimiento: "1995-05-08",
        telefono: "477-456-7890",
        direccion: "Calle Allende 321",
        barrio: "El Refugio",
        bautizado: true,
        confirmado: false,
        casado: false,
        nombrePadre: "Luis Ramírez Castro",
        nombreMadre: "Patricia Flores Vega",
        activo: true,
      },
      {
        nombre: "Ana Laura",
        apellidoPaterno: "Sánchez",
        apellidoMaterno: "Gómez",
        fechaNacimiento: "2010-09-14",
        telefono: "477-567-8901",
        direccion: "Calle Independencia 654",
        barrio: "Centro",
        bautizado: true,
        confirmado: false,
        casado: false,
        nombrePadre: "Miguel Sánchez Ortiz",
        nombreMadre: "Laura Gómez Pérez",
        activo: true,
      },
      {
        nombre: "Carlos",
        apellidoPaterno: "Jiménez",
        apellidoMaterno: "Morales",
        fechaNacimiento: "1982-11-30",
        telefono: "477-678-9012",
        email: "carlos.jimenez@example.com",
        direccion: "Av. Revolución 987",
        barrio: "San Antonio",
        bautizado: true,
        confirmado: true,
        casado: true,
        nombrePadre: "Antonio Jiménez Cruz",
        nombreMadre: "Teresa Morales Luna",
        nombrePareja: "Sandra Reyes Navarro",
        activo: true,
      },
      {
        nombre: "Rosa Elena",
        apellidoPaterno: "Díaz",
        apellidoMaterno: "Castillo",
        fechaNacimiento: "1988-02-18",
        telefono: "477-789-0123",
        email: "rosa.diaz@example.com",
        direccion: "Calle Zaragoza 147",
        barrio: "La Purísima",
        bautizado: true,
        confirmado: true,
        casado: false,
        nombrePadre: "Raúl Díaz Mendoza",
        nombreMadre: "Elena Castillo Ramos",
        activo: true,
      },
      {
        nombre: "Francisco",
        apellidoPaterno: "Ortiz",
        apellidoMaterno: "Vargas",
        fechaNacimiento: "1975-08-25",
        telefono: "477-890-1234",
        email: "francisco.ortiz@example.com",
        direccion: "Calle Constitución 258",
        barrio: "El Calvario",
        bautizado: true,
        confirmado: true,
        casado: true,
        nombrePadre: "Fernando Ortiz Suárez",
        nombreMadre: "Josefina Vargas Delgado",
        nombrePareja: "Beatriz Núñez Silva",
        activo: true,
      },
      {
        nombre: "Daniela",
        apellidoPaterno: "Reyes",
        apellidoMaterno: "Mendoza",
        fechaNacimiento: "2005-06-10",
        telefono: "477-901-2345",
        direccion: "Av. Libertad 369",
        barrio: "San José",
        bautizado: true,
        confirmado: false,
        casado: false,
        nombrePadre: "Daniel Reyes Cordero",
        nombreMadre: "Silvia Mendoza León",
        activo: true,
      },
      {
        nombre: "Miguel Ángel",
        apellidoPaterno: "Castro",
        apellidoMaterno: "Rojas",
        fechaNacimiento: "1992-04-03",
        telefono: "477-012-3456",
        email: "miguel.castro@example.com",
        direccion: "Calle Victoria 741",
        barrio: "Santa Fe",
        bautizado: true,
        confirmado: true,
        casado: false,
        nombrePadre: "Ángel Castro Fuentes",
        nombreMadre: "Gloria Rojas Campos",
        activo: true,
      },
    ]).returning();

    console.log(`✅ Creados ${feligresesData.length} feligreses`);

    // 2. SACRAMENTOS
    console.log("⛪ Creando registros de sacramentos...");
    await db.insert(sacramentos).values([
      // Bautismos
      {
        tipo: "bautismo",
        feligresId: feligresesData[4].id,
        nombreFeligres: "Ana Laura Sánchez Gómez",
        fecha: "2010-10-15",
        lugarCelebracion: "Parroquia de Nuestra Señora de Guadalupe",
        ministro: "Pbro. José Antonio Ramírez",
        nombrePadrino: "Roberto Sánchez Ortiz",
        nombreMadrina: "María Teresa Gómez Castro",
        libroNumero: "15",
        folioNumero: "234",
        partida: "145",
      },
      {
        tipo: "bautismo",
        feligresId: feligresesData[8].id,
        nombreFeligres: "Daniela Reyes Mendoza",
        fecha: "2005-07-20",
        lugarCelebracion: "Parroquia de Nuestra Señora de Guadalupe",
        ministro: "Pbro. Carlos Hernández",
        nombrePadrino: "Luis Reyes Cordero",
        nombreMadrina: "Carmen Mendoza Ruiz",
        libroNumero: "14",
        folioNumero: "189",
        partida: "98",
      },
      // Primera Comunión
      {
        tipo: "comunion",
        feligresId: feligresesData[8].id,
        nombreFeligres: "Daniela Reyes Mendoza",
        fecha: "2013-05-12",
        lugarCelebracion: "Parroquia de Nuestra Señora de Guadalupe",
        ministro: "Pbro. José Antonio Ramírez",
        nombrePadrino: "Daniel Reyes Cordero",
        nombreMadrina: "Silvia Mendoza León",
        libroNumero: "8",
        folioNumero: "445",
        partida: "276",
      },
      // Confirmaciones
      {
        tipo: "confirmacion",
        feligresId: feligresesData[0].id,
        nombreFeligres: "María García López",
        fecha: "2000-04-23",
        lugarCelebracion: "Parroquia de Nuestra Señora de Guadalupe",
        ministro: "Mons. Rafael González Martínez",
        nombrePadrino: "Juan García López",
        nombreMadrina: "Carmen López Sánchez",
        libroNumero: "6",
        folioNumero: "78",
        partida: "45",
      },
      {
        tipo: "confirmacion",
        feligresId: feligresesData[1].id,
        nombreFeligres: "Juan Hernández Ruiz",
        fecha: "2005-06-18",
        lugarCelebracion: "Parroquia de Nuestra Señora de Guadalupe",
        ministro: "Mons. Rafael González Martínez",
        nombrePadrino: "Carlos Hernández Pérez",
        nombreMadrina: "Rosa Ruiz López",
        libroNumero: "7",
        folioNumero: "123",
        partida: "89",
      },
      // Matrimonios
      {
        tipo: "matrimonio",
        feligresId: feligresesData[0].id,
        nombreFeligres: "María García López",
        nombreConyuge: "Pedro Ramírez Sánchez",
        fecha: "2008-08-15",
        lugarCelebracion: "Parroquia de Nuestra Señora de Guadalupe",
        ministro: "Pbro. José Antonio Ramírez",
        testigo1: "José García Hernández",
        testigo2: "Ana Ramírez Torres",
        libroNumero: "4",
        folioNumero: "56",
        partida: "28",
      },
      {
        tipo: "matrimonio",
        feligresId: feligresesData[2].id,
        nombreFeligres: "Guadalupe Martínez Torres",
        nombreConyuge: "Roberto Flores Díaz",
        fecha: "2002-11-30",
        lugarCelebracion: "Parroquia de Nuestra Señora de Guadalupe",
        ministro: "Pbro. Carlos Hernández",
        testigo1: "Francisco Martínez Silva",
        testigo2: "José Flores Ramírez",
        libroNumero: "3",
        folioNumero: "234",
        partida: "156",
      },
    ]);

    console.log("✅ Creados registros de sacramentos");

    // 3. GRUPOS PASTORALES
    console.log("👥 Creando grupos pastorales...");
    const gruposData = await db.insert(grupos).values([
      {
        nombre: "Coro Parroquial",
        descripcion: "Coro que anima las celebraciones eucarísticas dominicales",
        coordinadorId: feligresesData[2].id,
        coordinadorNombre: "Guadalupe Martínez Torres",
        tipo: "coro",
        activo: true,
      },
      {
        nombre: "Catequesis de Primera Comunión",
        descripcion: "Preparación de niños para recibir su Primera Comunión",
        coordinadorId: feligresesData[0].id,
        coordinadorNombre: "María García López",
        tipo: "catequesis",
        activo: true,
      },
      {
        nombre: "Grupo Juvenil San Juan Pablo II",
        descripcion: "Grupo de jóvenes de 15 a 25 años",
        coordinadorId: feligresesData[1].id,
        coordinadorNombre: "Juan Hernández Ruiz",
        tipo: "jovenes",
        activo: true,
      },
      {
        nombre: "Ministros Extraordinarios de la Eucaristía",
        descripcion: "Ministros que ayudan en la distribución de la comunión",
        coordinadorId: feligresesData[5].id,
        coordinadorNombre: "Carlos Jiménez Morales",
        tipo: "liturgia",
        activo: true,
      },
      {
        nombre: "Legión de María",
        descripcion: "Grupo mariano dedicado a la oración y obras de caridad",
        coordinadorId: feligresesData[6].id,
        coordinadorNombre: "Rosa Elena Díaz Castillo",
        tipo: "apostolado",
        activo: true,
      },
    ]).returning();

    console.log(`✅ Creados ${gruposData.length} grupos`);

    // 4. MIEMBROS DE GRUPOS
    console.log("👤 Asignando miembros a grupos...");
    await db.insert(miembrosGrupo).values([
      // Coro
      { grupoId: gruposData[0].id, feligresId: feligresesData[2].id, nombreFeligres: "Guadalupe Martínez Torres", rol: "coordinador" },
      { grupoId: gruposData[0].id, feligresId: feligresesData[6].id, nombreFeligres: "Rosa Elena Díaz Castillo", rol: "miembro" },
      { grupoId: gruposData[0].id, feligresId: feligresesData[9].id, nombreFeligres: "Miguel Ángel Castro Rojas", rol: "miembro" },
      
      // Catequesis
      { grupoId: gruposData[1].id, feligresId: feligresesData[0].id, nombreFeligres: "María García López", rol: "coordinador" },
      { grupoId: gruposData[1].id, feligresId: feligresesData[6].id, nombreFeligres: "Rosa Elena Díaz Castillo", rol: "catequista" },
      
      // Jóvenes
      { grupoId: gruposData[2].id, feligresId: feligresesData[1].id, nombreFeligres: "Juan Hernández Ruiz", rol: "coordinador" },
      { grupoId: gruposData[2].id, feligresId: feligresesData[3].id, nombreFeligres: "José Luis Ramírez Flores", rol: "miembro" },
      { grupoId: gruposData[2].id, feligresId: feligresesData[9].id, nombreFeligres: "Miguel Ángel Castro Rojas", rol: "secretario" },
      
      // Ministros
      { grupoId: gruposData[3].id, feligresId: feligresesData[5].id, nombreFeligres: "Carlos Jiménez Morales", rol: "coordinador" },
      { grupoId: gruposData[3].id, feligresId: feligresesData[7].id, nombreFeligres: "Francisco Ortiz Vargas", rol: "miembro" },
      { grupoId: gruposData[3].id, feligresId: feligresesData[1].id, nombreFeligres: "Juan Hernández Ruiz", rol: "miembro" },
      
      // Legión de María
      { grupoId: gruposData[4].id, feligresId: feligresesData[6].id, nombreFeligres: "Rosa Elena Díaz Castillo", rol: "coordinador" },
      { grupoId: gruposData[4].id, feligresId: feligresesData[0].id, nombreFeligres: "María García López", rol: "miembro" },
      { grupoId: gruposData[4].id, feligresId: feligresesData[2].id, nombreFeligres: "Guadalupe Martínez Torres", rol: "miembro" },
    ]);

    console.log("✅ Creados miembros de grupos");

    // 5. EVENTOS
    console.log("📅 Creando eventos...");
    const eventosData = await db.insert(eventos).values([
      {
        titulo: "Misa Dominical",
        descripcion: "Eucaristía dominical de 12:00 pm",
        tipo: "misa",
        fecha: "2025-11-16",
        horaInicio: "12:00",
        horaFin: "13:00",
        lugar: "Parroquia de Nuestra Señora de Guadalupe",
        organizadorId: feligresesData[5].id,
        organizadorNombre: "Carlos Jiménez Morales",
        requiereVoluntarios: false,
        activo: true,
      },
      {
        titulo: "Retiro de Primera Comunión",
        descripcion: "Retiro espiritual para niños que harán su Primera Comunión",
        tipo: "retiro",
        fecha: "2025-11-22",
        horaInicio: "09:00",
        horaFin: "17:00",
        lugar: "Casa de Retiros San Francisco",
        organizadorId: feligresesData[0].id,
        organizadorNombre: "María García López",
        requiereVoluntarios: true,
        activo: true,
      },
      {
        titulo: "Fiesta Patronal - Nuestra Señora de Guadalupe",
        descripcion: "Celebración de la fiesta patronal con misa solemne, procesión y kermés",
        tipo: "fiesta",
        fecha: "2025-12-12",
        horaInicio: "08:00",
        horaFin: "22:00",
        lugar: "Parroquia y atrio",
        organizadorId: feligresesData[1].id,
        organizadorNombre: "Juan Hernández Ruiz",
        requiereVoluntarios: true,
        activo: true,
      },
      {
        titulo: "Reunión del Grupo Juvenil",
        descripcion: "Reunión semanal con reflexión del evangelio y actividades",
        tipo: "reunion",
        fecha: "2025-11-15",
        horaInicio: "18:00",
        horaFin: "20:00",
        lugar: "Salón parroquial",
        organizadorId: feligresesData[1].id,
        organizadorNombre: "Juan Hernández Ruiz",
        requiereVoluntarios: false,
        activo: true,
      },
      {
        titulo: "Rosario de la Aurora",
        descripcion: "Rezo del Santo Rosario",
        tipo: "rosario",
        fecha: "2025-11-17",
        horaInicio: "06:00",
        horaFin: "07:00",
        lugar: "Parroquia de Nuestra Señora de Guadalupe",
        organizadorId: feligresesData[6].id,
        organizadorNombre: "Rosa Elena Díaz Castillo",
        requiereVoluntarios: false,
        activo: true,
      },
      {
        titulo: "Kermés Dominical",
        descripcion: "Kermés para recaudar fondos para el mantenimiento del templo",
        tipo: "kermesse",
        fecha: "2025-11-23",
        horaInicio: "10:00",
        horaFin: "16:00",
        lugar: "Atrio de la parroquia",
        organizadorId: feligresesData[2].id,
        organizadorNombre: "Guadalupe Martínez Torres",
        requiereVoluntarios: true,
        activo: true,
      },
    ]).returning();

    console.log(`✅ Creados ${eventosData.length} eventos`);

    // 6. VOLUNTARIOS
    console.log("🙋 Asignando voluntarios a eventos...");
    await db.insert(voluntarios).values([
      // Retiro de Primera Comunión
      { eventoId: eventosData[1].id, feligresId: feligresesData[0].id, nombreFeligres: "María García López", area: "coordinacion", confirmado: true },
      { eventoId: eventosData[1].id, feligresId: feligresesData[6].id, nombreFeligres: "Rosa Elena Díaz Castillo", area: "catequesis", confirmado: true },
      { eventoId: eventosData[1].id, feligresId: feligresesData[9].id, nombreFeligres: "Miguel Ángel Castro Rojas", area: "logistica", confirmado: true },
      
      // Fiesta Patronal
      { eventoId: eventosData[2].id, feligresId: feligresesData[1].id, nombreFeligres: "Juan Hernández Ruiz", area: "coordinacion", confirmado: true },
      { eventoId: eventosData[2].id, feligresId: feligresesData[3].id, nombreFeligres: "José Luis Ramírez Flores", area: "decoracion", confirmado: true },
      { eventoId: eventosData[2].id, feligresId: feligresesData[2].id, nombreFeligres: "Guadalupe Martínez Torres", area: "cocina", confirmado: true },
      { eventoId: eventosData[2].id, feligresId: feligresesData[5].id, nombreFeligres: "Carlos Jiménez Morales", area: "liturgia", confirmado: true },
      { eventoId: eventosData[2].id, feligresId: feligresesData[7].id, nombreFeligres: "Francisco Ortiz Vargas", area: "seguridad", confirmado: true },
      { eventoId: eventosData[2].id, feligresId: feligresesData[9].id, nombreFeligres: "Miguel Ángel Castro Rojas", area: "sonido", confirmado: true },
      
      // Kermés
      { eventoId: eventosData[5].id, feligresId: feligresesData[2].id, nombreFeligres: "Guadalupe Martínez Torres", area: "coordinacion", confirmado: true },
      { eventoId: eventosData[5].id, feligresId: feligresesData[0].id, nombreFeligres: "María García López", area: "cocina", confirmado: true },
      { eventoId: eventosData[5].id, feligresId: feligresesData[6].id, nombreFeligres: "Rosa Elena Díaz Castillo", area: "ventas", confirmado: true },
      { eventoId: eventosData[5].id, feligresId: feligresesData[1].id, nombreFeligres: "Juan Hernández Ruiz", area: "logistica", confirmado: true },
    ]);

    console.log("✅ Creados voluntarios para eventos");

    console.log("\n🎉 ¡Seed completado exitosamente!");
    console.log("📊 Resumen:");
    console.log(`   - ${feligresesData.length} feligreses`);
    console.log(`   - 7 sacramentos registrados`);
    console.log(`   - ${gruposData.length} grupos pastorales`);
    console.log(`   - 14 miembros asignados a grupos`);
    console.log(`   - ${eventosData.length} eventos programados`);
    console.log(`   - 13 voluntarios registrados`);

  } catch (error) {
    console.error("❌ Error durante el seed:", error);
    throw error;
  }
}
