import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { 
  feligreses, 
  sacramentos, 
  grupos, 
  miembrosGrupo, 
  eventos, 
  voluntarios,
  categoriasFinancieras,
  transacciones,
  articulosInventario,
  movimientosInventario,
  prestamos
} from "@shared/schema";
import * as schema from "@shared/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

export async function seedDatabase() {
  console.log("🌱 Iniciando seed de datos de ejemplo...");

  try {
    // Limpiar datos existentes (excepto usuarios)
    await db.delete(prestamos);
    await db.delete(movimientosInventario);
    await db.delete(transacciones);
    await db.delete(articulosInventario);
    await db.delete(categoriasFinancieras);
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

    // 7. CATEGORÍAS FINANCIERAS
    console.log("💰 Creando categorías financieras...");
    const categoriasData = await db.insert(categoriasFinancieras).values([
      // Ingresos
      { nombre: "Diezmos", tipo: "ingreso", descripcion: "Diezmos de feligreses" },
      { nombre: "Donativos", tipo: "ingreso", descripcion: "Donativos y ofrendas especiales" },
      { nombre: "Eventos", tipo: "ingreso", descripcion: "Ingresos por eventos (kermés, rifas, etc.)" },
      { nombre: "Sacramentos", tipo: "ingreso", descripcion: "Limosnas por sacramentos" },
      { nombre: "Misas", tipo: "ingreso", descripcion: "Limosnas por misas" },
      
      // Egresos
      { nombre: "Mantenimiento", tipo: "egreso", descripcion: "Mantenimiento del templo y edificios" },
      { nombre: "Servicios", tipo: "egreso", descripcion: "Agua, luz, teléfono, internet" },
      { nombre: "Suministros", tipo: "egreso", descripcion: "Suministros litúrgicos y de oficina" },
      { nombre: "Caridad", tipo: "egreso", descripcion: "Obras de caridad y ayuda social" },
      { nombre: "Catequesis", tipo: "egreso", descripcion: "Material para catequesis" },
      { nombre: "Personal", tipo: "egreso", descripcion: "Salarios y prestaciones" },
    ]).returning();

    console.log(`✅ Creadas ${categoriasData.length} categorías financieras`);

    // 8. TRANSACCIONES
    console.log("📝 Creando transacciones financieras...");
    const transaccionesData = await db.insert(transacciones).values([
      // Ingresos - Noviembre
      {
        tipo: "ingreso",
        monto: "8500.00",
        fecha: "2025-11-03",
        categoriaId: categoriasData[0].id,
        categoriaNombre: "Diezmos",
        metodoPago: "efectivo",
        descripcion: "Diezmos dominicales - 1er domingo noviembre",
      },
      {
        tipo: "ingreso",
        monto: "12000.00",
        fecha: "2025-11-10",
        categoriaId: categoriasData[0].id,
        categoriaNombre: "Diezmos",
        metodoPago: "efectivo",
        descripcion: "Diezmos dominicales - 2do domingo noviembre",
      },
      {
        tipo: "ingreso",
        monto: "15000.00",
        fecha: "2025-11-09",
        categoriaId: categoriasData[2].id,
        categoriaNombre: "Eventos",
        metodoPago: "efectivo",
        descripcion: "Kermés dominical - recaudación total",
      },
      {
        tipo: "ingreso",
        monto: "3500.00",
        fecha: "2025-11-05",
        categoriaId: categoriasData[1].id,
        categoriaNombre: "Donativos",
        metodoPago: "transferencia",
        descripcion: "Donativo familia García para restauración de imagen",
        referencia: "TRANS-2025-001",
      },
      {
        tipo: "ingreso",
        monto: "2000.00",
        fecha: "2025-11-07",
        categoriaId: categoriasData[3].id,
        categoriaNombre: "Sacramentos",
        metodoPago: "efectivo",
        descripcion: "Limosnas por bautismos (4 celebraciones)",
      },
      {
        tipo: "ingreso",
        monto: "1500.00",
        fecha: "2025-11-08",
        categoriaId: categoriasData[4].id,
        categoriaNombre: "Misas",
        metodoPago: "efectivo",
        descripcion: "Misas gregorianas solicitadas",
      },

      // Ingresos - Octubre
      {
        tipo: "ingreso",
        monto: "9200.00",
        fecha: "2025-10-06",
        categoriaId: categoriasData[0].id,
        categoriaNombre: "Diezmos",
        metodoPago: "efectivo",
        descripcion: "Diezmos dominicales - 1er domingo octubre",
      },
      {
        tipo: "ingreso",
        monto: "10500.00",
        fecha: "2025-10-13",
        categoriaId: categoriasData[0].id,
        categoriaNombre: "Diezmos",
        metodoPago: "efectivo",
        descripcion: "Diezmos dominicales - 2do domingo octubre",
      },
      {
        tipo: "ingreso",
        monto: "25000.00",
        fecha: "2025-10-20",
        categoriaId: categoriasData[2].id,
        categoriaNombre: "Eventos",
        metodoPago: "mixto",
        descripcion: "Gran kermés anual - Octubre Rosa",
      },

      // Egresos - Noviembre
      {
        tipo: "egreso",
        monto: "4200.00",
        fecha: "2025-11-01",
        categoriaId: categoriasData[6].id,
        categoriaNombre: "Servicios",
        metodoPago: "transferencia",
        descripcion: "Pago de luz - octubre 2025",
        referencia: "CFE-OCT-2025",
      },
      {
        tipo: "egreso",
        monto: "1800.00",
        fecha: "2025-11-01",
        categoriaId: categoriasData[6].id,
        categoriaNombre: "Servicios",
        metodoPago: "transferencia",
        descripcion: "Pago de agua - octubre 2025",
        referencia: "SAPAG-OCT-2025",
      },
      {
        tipo: "egreso",
        monto: "850.00",
        fecha: "2025-11-02",
        categoriaId: categoriasData[6].id,
        categoriaNombre: "Servicios",
        metodoPago: "efectivo",
        descripcion: "Teléfono e internet - octubre 2025",
      },
      {
        tipo: "egreso",
        monto: "12000.00",
        fecha: "2025-11-05",
        categoriaId: categoriasData[5].id,
        categoriaNombre: "Mantenimiento",
        metodoPago: "cheque",
        descripcion: "Reparación de goteras en techo del templo",
        referencia: "CHQ-456",
      },
      {
        tipo: "egreso",
        monto: "3500.00",
        fecha: "2025-11-04",
        categoriaId: categoriasData[7].id,
        categoriaNombre: "Suministros",
        metodoPago: "efectivo",
        descripcion: "Velas, incienso, vino y hostias para noviembre",
      },
      {
        tipo: "egreso",
        monto: "2000.00",
        fecha: "2025-11-06",
        categoriaId: categoriasData[8].id,
        categoriaNombre: "Caridad",
        metodoPago: "efectivo",
        descripcion: "Despensas para familias necesitadas - 15 despensas",
      },
      {
        tipo: "egreso",
        monto: "1200.00",
        fecha: "2025-11-07",
        categoriaId: categoriasData[9].id,
        categoriaNombre: "Catequesis",
        metodoPago: "efectivo",
        descripcion: "Libros y material didáctico para Primera Comunión",
      },

      // Egresos - Octubre
      {
        tipo: "egreso",
        monto: "15000.00",
        fecha: "2025-10-01",
        categoriaId: categoriasData[10].id,
        categoriaNombre: "Personal",
        metodoPago: "transferencia",
        descripcion: "Sueldo sacristán y personal de limpieza",
        referencia: "NOM-OCT-2025",
      },
      {
        tipo: "egreso",
        monto: "4100.00",
        fecha: "2025-10-02",
        categoriaId: categoriasData[6].id,
        categoriaNombre: "Servicios",
        metodoPago: "transferencia",
        descripcion: "Pago de luz - septiembre 2025",
        referencia: "CFE-SEP-2025",
      },
      {
        tipo: "egreso",
        monto: "8500.00",
        fecha: "2025-10-15",
        categoriaId: categoriasData[5].id,
        categoriaNombre: "Mantenimiento",
        metodoPago: "cheque",
        descripcion: "Pintura exterior del templo - anticipo",
        referencia: "CHQ-442",
      },
    ]).returning();

    console.log(`✅ Creadas ${transaccionesData.length} transacciones`);

    // 9. ARTÍCULOS DE INVENTARIO
    console.log("📦 Creando artículos de inventario...");
    const articulosData = await db.insert(articulosInventario).values([
      // Litúrgicos
      {
        nombre: "Velas blancas grandes",
        categoria: "liturgico",
        stockActual: "120",
        unidadMedida: "piezas",
        ubicacion: "Bodega principal - Estante A",
        stockMinimo: "50",
        descripcion: "Velas de 30cm para altar mayor",
      },
      {
        nombre: "Incienso en grano",
        categoria: "liturgico",
        stockActual: "15",
        unidadMedida: "kg",
        ubicacion: "Sacristía - Armario litúrgico",
        stockMinimo: "5",
        descripcion: "Incienso natural de alta calidad",
      },
      {
        nombre: "Vino para consagrar",
        categoria: "liturgico",
        stockActual: "8",
        unidadMedida: "litros",
        ubicacion: "Sacristía - Refrigerador",
        stockMinimo: "3",
        descripcion: "Vino tinto para eucaristía",
      },
      {
        nombre: "Hostias grandes",
        categoria: "liturgico",
        stockActual: "500",
        unidadMedida: "piezas",
        ubicacion: "Sacristía - Cajón especial",
        stockMinimo: "100",
        descripcion: "Hostias de 7.5cm para consagración",
      },
      {
        nombre: "Hostias pequeñas",
        categoria: "liturgico",
        stockActual: "3000",
        unidadMedida: "piezas",
        ubicacion: "Sacristía - Cajón especial",
        stockMinimo: "500",
        descripcion: "Hostias para comunión de fieles",
      },

      // Oficina
      {
        nombre: "Papel bond carta",
        categoria: "oficina",
        stockActual: "25",
        unidadMedida: "paquetes",
        ubicacion: "Oficina parroquial - Almacén",
        stockMinimo: "10",
        descripcion: "Paquetes de 500 hojas",
      },
      {
        nombre: "Tinta para impresora",
        categoria: "oficina",
        stockActual: "6",
        unidadMedida: "cartuchos",
        ubicacion: "Oficina parroquial - Escritorio",
        stockMinimo: "2",
        descripcion: "Cartuchos HP 664 negro y color",
      },
      {
        nombre: "Carpetas tamaño oficio",
        categoria: "oficina",
        stockActual: "50",
        unidadMedida: "piezas",
        ubicacion: "Oficina parroquial - Estante",
        stockMinimo: "20",
        descripcion: "Carpetas para archivo parroquial",
      },

      // Mantenimiento
      {
        nombre: "Focos LED 15W",
        categoria: "mantenimiento",
        stockActual: "30",
        unidadMedida: "piezas",
        ubicacion: "Bodega principal - Estante B",
        stockMinimo: "10",
        descripcion: "Focos para iluminación del templo",
      },
      {
        nombre: "Escobas",
        categoria: "mantenimiento",
        stockActual: "8",
        unidadMedida: "piezas",
        ubicacion: "Bodega de limpieza",
        stockMinimo: "3",
      },
      {
        nombre: "Trapeadores",
        categoria: "mantenimiento",
        stockActual: "6",
        unidadMedida: "piezas",
        ubicacion: "Bodega de limpieza",
        stockMinimo: "2",
      },
      {
        nombre: "Cloro",
        categoria: "mantenimiento",
        stockActual: "12",
        unidadMedida: "litros",
        ubicacion: "Bodega de limpieza",
        stockMinimo: "5",
        descripcion: "Cloro para limpieza de baños",
      },

      // Catequesis
      {
        nombre: "Libros de Primera Comunión",
        categoria: "catequesis",
        stockActual: "45",
        unidadMedida: "libros",
        ubicacion: "Salón de catequesis - Estante 1",
        stockMinimo: "20",
        descripcion: "Serie 'Encuentro con Jesús' para niños",
      },
      {
        nombre: "Biblias para niños",
        categoria: "catequesis",
        stockActual: "20",
        unidadMedida: "libros",
        ubicacion: "Salón de catequesis - Estante 1",
        stockMinimo: "10",
        descripcion: "Biblias ilustradas para catequesis infantil",
      },
      {
        nombre: "Lápices de colores",
        categoria: "catequesis",
        stockActual: "30",
        unidadMedida: "cajas",
        ubicacion: "Salón de catequesis - Armario",
        stockMinimo: "15",
        descripcion: "Cajas de 12 colores",
      },

      // Otros
      {
        nombre: "Sillas plegables",
        categoria: "mobiliario",
        stockActual: "150",
        unidadMedida: "piezas",
        ubicacion: "Bodega principal - Zona trasera",
        stockMinimo: "100",
        descripcion: "Para eventos especiales",
      },
      {
        nombre: "Mesas plegables",
        categoria: "mobiliario",
        stockActual: "25",
        unidadMedida: "piezas",
        ubicacion: "Bodega principal - Zona trasera",
        stockMinimo: "15",
        descripcion: "Mesas rectangulares 1.80m",
      },
    ]).returning();

    console.log(`✅ Creados ${articulosData.length} artículos`);

    // 10. MOVIMIENTOS DE INVENTARIO
    console.log("📊 Creando movimientos de inventario...");
    await db.insert(movimientosInventario).values([
      // Entradas
      {
        articuloId: articulosData[0].id,
        articuloNombre: "Velas blancas grandes",
        tipo: "entrada",
        cantidad: "100",
        fecha: "2025-10-15",
        motivo: "compra",
        registradoPorNombre: "Rosa Elena Díaz Castillo",
        notas: "Compra mayoreo - Proveeduría San José",
      },
      {
        articuloId: articulosData[1].id,
        articuloNombre: "Incienso en grano",
        tipo: "entrada",
        cantidad: "10",
        fecha: "2025-10-20",
        motivo: "compra",
        registradoPorNombre: "Carlos Jiménez Morales",
        notas: "Stock para temporada de Adviento",
      },
      {
        articuloId: articulosData[5].id,
        articuloNombre: "Papel bond carta",
        tipo: "entrada",
        cantidad: "20",
        fecha: "2025-11-01",
        motivo: "compra",
        registradoPorNombre: "María García López",
        notas: "Para oficina parroquial",
      },
      {
        articuloId: articulosData[12].id,
        articuloNombre: "Libros de Primera Comunión",
        tipo: "entrada",
        cantidad: "30",
        fecha: "2025-10-25",
        motivo: "donacion",
        registradoPorNombre: "María García López",
        notas: "Donación de editorial Arquidiócesis",
      },

      // Salidas
      {
        articuloId: articulosData[0].id,
        articuloNombre: "Velas blancas grandes",
        tipo: "salida",
        cantidad: "20",
        fecha: "2025-11-05",
        motivo: "uso_liturgico",
        registradoPorNombre: "Carlos Jiménez Morales",
        notas: "Consumo semanal para misas",
      },
      {
        articuloId: articulosData[4].id,
        articuloNombre: "Hostias pequeñas",
        tipo: "salida",
        cantidad: "500",
        fecha: "2025-11-03",
        motivo: "uso_liturgico",
        registradoPorNombre: "Carlos Jiménez Morales",
        notas: "Misas dominicales - noviembre semana 1",
      },
      {
        articuloId: articulosData[8].id,
        articuloNombre: "Focos LED 15W",
        tipo: "salida",
        cantidad: "5",
        fecha: "2025-11-02",
        motivo: "uso_liturgico",
        registradoPorNombre: "Francisco Ortiz Vargas",
        notas: "Reemplazo focos quemados en nave principal",
      },
      {
        articuloId: articulosData[12].id,
        articuloNombre: "Libros de Primera Comunión",
        tipo: "salida",
        cantidad: "25",
        fecha: "2025-11-04",
        motivo: "uso_liturgico",
        registradoPorNombre: "María García López",
        notas: "Entregados a catequistas para nuevo ciclo",
      },
    ]).returning();

    console.log("✅ Creados movimientos de inventario");

    // 11. PRÉSTAMOS
    console.log("🤝 Creando préstamos de artículos...");
    await db.insert(prestamos).values([
      {
        articuloId: articulosData[15].id,
        articuloNombre: "Sillas plegables",
        cantidad: "50",
        prestatarioNombre: "Juan Hernández Ruiz",
        prestatarioTelefono: "477-234-5678",
        fechaPrestamo: "2025-11-08",
        fechaDevolucionProgramada: "2025-11-10",
        motivo: "Retiro del Grupo Juvenil",
        estado: "prestado",
      },
      {
        articuloId: articulosData[16].id,
        articuloNombre: "Mesas plegables",
        cantidad: "10",
        prestatarioNombre: "Juan Hernández Ruiz",
        prestatarioTelefono: "477-234-5678",
        fechaPrestamo: "2025-11-08",
        fechaDevolucionProgramada: "2025-11-10",
        motivo: "Retiro del Grupo Juvenil",
        estado: "prestado",
      },
      {
        articuloId: articulosData[15].id,
        articuloNombre: "Sillas plegables",
        cantidad: "100",
        prestatarioNombre: "Guadalupe Martínez Torres",
        prestatarioTelefono: "477-345-6789",
        fechaPrestamo: "2025-10-28",
        fechaDevolucionProgramada: "2025-10-29",
        fechaDevolucionReal: "2025-10-29",
        motivo: "Kermés dominical",
        estado: "devuelto",
      },
      {
        articuloId: articulosData[16].id,
        articuloNombre: "Mesas plegables",
        cantidad: "20",
        prestatarioNombre: "Guadalupe Martínez Torres",
        prestatarioTelefono: "477-345-6789",
        fechaPrestamo: "2025-10-28",
        fechaDevolucionProgramada: "2025-10-29",
        fechaDevolucionReal: "2025-10-29",
        motivo: "Kermés dominical",
        estado: "devuelto",
      },
    ]).returning();

    console.log("✅ Creados préstamos de artículos");

    console.log("\n🎉 ¡Seed completado exitosamente!");
    console.log("📊 Resumen:");
    console.log(`   - ${feligresesData.length} feligreses`);
    console.log(`   - 7 sacramentos registrados`);
    console.log(`   - ${gruposData.length} grupos pastorales`);
    console.log(`   - 14 miembros asignados a grupos`);
    console.log(`   - ${eventosData.length} eventos programados`);
    console.log(`   - 13 voluntarios registrados`);
    console.log(`   - ${categoriasData.length} categorías financieras`);
    console.log(`   - ${transaccionesData.length} transacciones`);
    console.log(`   - ${articulosData.length} artículos de inventario`);
    console.log("   - 8 movimientos de inventario");
    console.log("   - 4 préstamos de artículos");

  } catch (error) {
    console.error("❌ Error durante el seed:", error);
    throw error;
  }
}
