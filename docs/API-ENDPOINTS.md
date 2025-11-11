# API Endpoints - Sistema Parroquial

**Última actualización:** Noviembre 10, 2025

Documentación completa de todos los endpoints REST del sistema.

**Base URL:** `http://localhost:5000/api` (desarrollo)  
**Formato:** Todas las respuestas y requests son JSON  
**Autenticación:** Cookie-based sessions (express-session)

---

## 📑 Índice

1. [Autenticación](#autenticación)
2. [Feligreses](#feligreses)
3. [Sacramentos](#sacramentos)
4. [Grupos Pastorales](#grupos-pastorales)
5. [Eventos](#eventos)
6. [Voluntarios](#voluntarios)
7. [Categorías Financieras](#categorías-financieras)
8. [Transacciones](#transacciones)
9. [Reportes Financieros](#reportes-financieros)
10. [Artículos de Inventario](#artículos-de-inventario)
11. [Movimientos de Inventario](#movimientos-de-inventario)
12. [Préstamos](#préstamos)
13. [Utilidades](#utilidades)

---

## 🔐 Autenticación

### POST /api/auth/register

Crear nueva cuenta de usuario.

**Request:**
```json
{
  "username": "juan.perez",
  "password": "Password123!",
  "nombre": "Juan Pérez",
  "rol": "coordinador"
}
```

**Roles válidos:** `parroco`, `coordinador`, `voluntario`

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "username": "juan.perez",
  "nombre": "Juan Pérez",
  "rol": "coordinador"
}
```

**Errores:**
- `400` - Username ya existe
- `400` - Datos inválidos (validación Zod)

---

### POST /api/auth/login

Iniciar sesión.

**Request:**
```json
{
  "username": "admin",
  "password": "Admin123!"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "username": "admin",
  "nombre": "Administrador",
  "rol": "parroco"
}
```

**Headers:** Establece cookie `connect.sid` con sesión

**Errores:**
- `401` - Credenciales inválidas
- `400` - Datos inválidos

---

### POST /api/auth/logout

Cerrar sesión.

**Auth:** Requerida

**Response:** `200 OK`
```json
{
  "message": "Sesión cerrada exitosamente"
}
```

**Side effects:** Destruye sesión y limpia cookie

---

### GET /api/auth/me

Obtener usuario actual.

**Auth:** Requerida

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "username": "admin",
  "nombre": "Administrador",
  "rol": "parroco"
}
```

**Errores:**
- `401` - No autenticado

---

## 👥 Feligreses

### GET /api/feligreses

Listar todos los feligreses.

**Auth:** Requerida

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "nombre": "María",
    "apellidos": "García López",
    "fechaNacimiento": "1985-03-15",
    "telefono": "477-123-4567",
    "email": "maria@example.com",
    "direccion": "Calle Principal #123",
    "estadoCivil": "casado",
    "activo": true,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
]
```

---

### GET /api/feligreses/:id

Obtener un feligrés por ID.

**Auth:** Requerida

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "nombre": "María",
  "apellidos": "García López",
  // ... resto de campos
}
```

**Errores:**
- `404` - Feligrés no encontrado

---

### POST /api/feligreses

Crear nuevo feligrés.

**Auth:** Requerida

**Request:**
```json
{
  "nombre": "Pedro",
  "apellidos": "Sánchez Martínez",
  "fechaNacimiento": "1990-05-20",
  "telefono": "477-234-5678",
  "email": "pedro@example.com",
  "direccion": "Av. Juárez #456",
  "estadoCivil": "soltero"
}
```

**Estados civiles válidos:** `soltero`, `casado`, `viudo`, `divorciado`, `union_libre`

**Response:** `201 Created`
```json
{
  "id": "uuid-generado",
  "nombre": "Pedro",
  // ... campos completos
  "activo": true,
  "createdAt": "2025-11-10T12:00:00Z"
}
```

**Errores:**
- `400` - Datos inválidos (email, fecha, etc.)

---

### PATCH /api/feligreses/:id

Actualizar feligrés existente.

**Auth:** Requerida

**Request:** (solo campos a actualizar)
```json
{
  "telefono": "477-999-8888",
  "activo": false
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  // ... campos actualizados
  "updatedAt": "2025-11-10T13:00:00Z"
}
```

**Errores:**
- `404` - Feligrés no encontrado
- `400` - Datos inválidos

---

### DELETE /api/feligreses/:id

Eliminar feligrés.

**Auth:** Requerida  
**⚠️ Warning:** Eliminación física, no reversible

**Response:** `204 No Content`

**Errores:**
- `404` - Feligrés no encontrado
- `500` - Error al eliminar (probablemente foreign keys)

---

## ⛪ Sacramentos

### GET /api/sacramentos

Listar todos los sacramentos.

**Auth:** Requerida

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "feligresId": "uuid",
    "feligresNombre": "María García López",
    "tipo": "bautismo",
    "fecha": "2025-01-15",
    "lugarCelebracion": "Parroquia San José",
    "ministro": "Pbro. José Luis Ramírez",
    "padrinos": "Juan García y Ana López",
    "notas": "Celebración familiar",
    "createdAt": "2025-01-15T10:00:00Z"
  }
]
```

**Tipos válidos:** `bautismo`, `primera_comunion`, `confirmacion`, `matrimonio`

---

### GET /api/sacramentos/:id

Obtener un sacramento por ID.

**Auth:** Requerida

**Response:** `200 OK` (mismo formato que arriba)

**Errores:**
- `404` - Sacramento no encontrado

---

### POST /api/sacramentos

Crear nuevo registro sacramental.

**Auth:** Requerida

**Request:**
```json
{
  "feligresId": "uuid",
  "feligresNombre": "María García López",
  "tipo": "bautismo",
  "fecha": "2025-01-15",
  "lugarCelebracion": "Parroquia San José",
  "ministro": "Pbro. José Luis Ramírez",
  "padrinos": "Juan García y Ana López",
  "notas": "Celebración familiar"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid-generado",
  // ... campos completos
}
```

**Errores:**
- `400` - Datos inválidos
- `400` - Tipo de sacramento inválido

---

### GET /api/sacramentos/:id/certificado

Descargar certificado sacramental en PDF.

**Auth:** Requerida

**Response:** `200 OK`
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="certificado-bautismo-maria-garcia.pdf"`
- Body: Binary PDF

**Errores:**
- `404` - Sacramento no encontrado

**Ejemplo de uso:**
```typescript
const response = await fetch(`/api/sacramentos/${id}/certificado`, {
  credentials: 'include'
});
const blob = await response.blob();
const url = URL.createObjectURL(blob);
window.open(url);
```

---

## 👥 Grupos Pastorales

### GET /api/grupos

Listar todos los grupos.

**Auth:** Requerida

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "nombre": "Grupo Juvenil",
    "descripcion": "Jóvenes de 15-25 años",
    "coordinador": "María García",
    "tipo": "juvenil",
    "horario": "Sábados 4:00 PM",
    "lugarReunion": "Salón parroquial",
    "activo": true,
    "createdAt": "2025-01-01T00:00:00Z"
  }
]
```

**Tipos válidos:** `catequesis`, `oracion`, `servicio`, `juvenil`, `adulto_mayor`, `otro`

---

### POST /api/grupos

Crear nuevo grupo pastoral.

**Auth:** Requerida

**Request:**
```json
{
  "nombre": "Legión de María",
  "descripcion": "Grupo mariano de oración",
  "coordinador": "Ana López",
  "tipo": "oracion",
  "horario": "Jueves 7:00 PM",
  "lugarReunion": "Capilla"
}
```

**Response:** `201 Created`

---

### PATCH /api/grupos/:id

Actualizar grupo.

**Auth:** Requerida

**Response:** `200 OK`

---

### DELETE /api/grupos/:id

Eliminar grupo.

**Auth:** Requerida

**Response:** `204 No Content`

---

### GET /api/grupos/:id/miembros

Obtener miembros de un grupo.

**Auth:** Requerida

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "grupoId": "uuid",
    "feligresId": "uuid",
    "feligresNombre": "Pedro Sánchez",
    "fechaIngreso": "2025-01-01",
    "activo": true
  }
]
```

---

## 📅 Eventos

### GET /api/eventos

Listar todos los eventos.

**Auth:** Requerida

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "nombre": "Retiro Espiritual",
    "descripcion": "Retiro de Cuaresma",
    "tipo": "retiro",
    "fechaInicio": "2025-03-15",
    "fechaFin": "2025-03-17",
    "horaInicio": "08:00",
    "horaFin": "18:00",
    "lugar": "Casa de retiros",
    "responsable": "Pbro. José Ramírez",
    "cupoMaximo": "50",
    "createdAt": "2025-02-01T00:00:00Z"
  }
]
```

**Tipos válidos:** `misa`, `retiro`, `catequesis`, `reunion`, `festividad`, `otro`

---

### POST /api/eventos

Crear nuevo evento.

**Auth:** Requerida

**Request:**
```json
{
  "nombre": "Kermés Dominical",
  "descripcion": "Kermés para recaudar fondos",
  "tipo": "festividad",
  "fechaInicio": "2025-12-01",
  "fechaFin": "2025-12-01",
  "horaInicio": "10:00",
  "horaFin": "18:00",
  "lugar": "Patio parroquial",
  "responsable": "María García",
  "cupoMaximo": "200"
}
```

**Response:** `201 Created`

---

### GET /api/eventos/:id/voluntarios

Obtener voluntarios de un evento.

**Auth:** Requerida

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "eventoId": "uuid",
    "feligresId": "uuid",
    "feligresNombre": "Juan Hernández",
    "rol": "coordinador",
    "confirmado": true,
    "notas": "Coordinador general"
  }
]
```

---

## 🤝 Voluntarios

### GET /api/voluntarios

Listar todos los voluntarios.

**Auth:** Requerida

**Response:** `200 OK`

---

### POST /api/voluntarios

Registrar nuevo voluntario.

**Auth:** Requerida

**Request:**
```json
{
  "eventoId": "uuid",
  "feligresId": "uuid",
  "feligresNombre": "Pedro Sánchez",
  "rol": "apoyo",
  "confirmado": true,
  "notas": "Ayuda en logística"
}
```

**Roles válidos:** `coordinador`, `apoyo`, `logistica`, `liturgia`

**Response:** `201 Created`

---

### GET /api/voluntarios/evento/:eventoId

Obtener voluntarios de un evento específico.

**Auth:** Requerida

**Response:** `200 OK`

---

## 💰 Categorías Financieras

### GET /api/categorias-financieras

Listar todas las categorías.

**Auth:** Requerida

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "nombre": "Diezmos",
    "tipo": "ingreso",
    "descripcion": "Contribuciones de feligreses",
    "activa": true,
    "createdAt": "2025-01-01T00:00:00Z"
  },
  {
    "id": "uuid",
    "nombre": "Mantenimiento",
    "tipo": "egreso",
    "descripcion": "Gastos de mantenimiento del templo",
    "activa": true,
    "createdAt": "2025-01-01T00:00:00Z"
  }
]
```

**Tipos:** `ingreso`, `egreso`

---

### POST /api/categorias-financieras

Crear nueva categoría.

**Auth:** Requerida (requiere rol párroco)

**Request:**
```json
{
  "nombre": "Eventos especiales",
  "tipo": "ingreso",
  "descripcion": "Ingresos por eventos parroquiales"
}
```

**Response:** `201 Created`

---

## 💵 Transacciones

### GET /api/transacciones

Listar todas las transacciones.

**Auth:** Requerida

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "tipo": "ingreso",
    "monto": "5000.00",
    "categoriaId": "uuid",
    "categoriaNombre": "Diezmos",
    "fecha": "2025-11-01",
    "descripcion": "Diezmos dominicales",
    "metodoPago": "efectivo",
    "referencia": null,
    "notas": "Colecta del domingo",
    "createdAt": "2025-11-01T10:00:00Z"
  },
  {
    "id": "uuid",
    "tipo": "egreso",
    "monto": "1500.00",
    "categoriaId": "uuid",
    "categoriaNombre": "Servicios públicos",
    "fecha": "2025-11-03",
    "descripcion": "Pago de luz",
    "metodoPago": "transferencia",
    "referencia": "TRF-20251103-001",
    "notas": "Bimestre Oct-Nov",
    "createdAt": "2025-11-03T14:00:00Z"
  }
]
```

**Tipos:** `ingreso`, `egreso`  
**Métodos de pago:** `efectivo`, `transferencia`, `cheque`, `tarjeta`, `mixto`

---

### POST /api/transacciones

Crear nueva transacción.

**Auth:** Requerida

**Request:**
```json
{
  "tipo": "ingreso",
  "monto": "2500.00",
  "categoriaId": "uuid",
  "categoriaNombre": "Donativos",
  "fecha": "2025-11-10",
  "descripcion": "Donativo anónimo para obras",
  "metodoPago": "efectivo",
  "notas": "Entregado en sobre cerrado"
}
```

**Response:** `201 Created`

**Validaciones:**
- `monto` debe ser > 0
- `categoriaId` debe existir
- `fecha` debe ser válida (YYYY-MM-DD)
- Si `metodoPago` es `transferencia` o `cheque`, `referencia` es obligatoria

---

### PATCH /api/transacciones/:id

Actualizar transacción.

**Auth:** Requerida

**Response:** `200 OK`

---

### DELETE /api/transacciones/:id

Eliminar transacción.

**Auth:** Requerida

**Response:** `204 No Content`

---

## 📊 Reportes Financieros

### GET /api/resumen-financiero

Obtener resumen financiero por período.

**Auth:** Requerida

**Query Parameters:**
- `inicio` (opcional): Fecha inicio (YYYY-MM-DD)
- `fin` (opcional): Fecha fin (YYYY-MM-DD)

Si no se proporcionan fechas, retorna resumen de todo el tiempo.

**Ejemplo:** `/api/resumen-financiero?inicio=2025-11-01&fin=2025-11-30`

**Response:** `200 OK`
```json
{
  "totalIngresos": "45000.00",
  "totalEgresos": "32000.00",
  "balance": "13000.00",
  "transacciones": 42,
  "categorias": [
    {
      "id": "uuid",
      "nombre": "Diezmos",
      "tipo": "ingreso",
      "total": "25000.00"
    },
    {
      "id": "uuid",
      "nombre": "Servicios públicos",
      "tipo": "egreso",
      "total": "8000.00"
    }
  ],
  "meses": [
    {
      "mes": "2025-11",
      "ingresos": "20000.00",
      "egresos": "15000.00",
      "balance": "5000.00"
    }
  ]
}
```

---

## 📦 Artículos de Inventario

### GET /api/articulos-inventario

Listar todos los artículos.

**Auth:** Requerida

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "nombre": "Velas blancas grandes",
    "categoria": "liturgico",
    "descripcion": "Velas de 30cm para altar mayor",
    "unidadMedida": "piezas",
    "stockActual": "120",
    "stockMinimo": "50",
    "ubicacion": "Bodega principal - Estante A",
    "valorUnitario": "15.50",
    "activo": true,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-11-10T12:00:00Z"
  }
]
```

**Categorías válidas:** `liturgico`, `oficina`, `mantenimiento`, `catequesis`, `mobiliario`

---

### POST /api/articulos-inventario

Crear nuevo artículo.

**Auth:** Requerida

**Request:**
```json
{
  "nombre": "Incienso en grano",
  "categoria": "liturgico",
  "descripcion": "Incienso natural importado",
  "unidadMedida": "kg",
  "stockActual": "10",
  "stockMinimo": "3",
  "ubicacion": "Sacristía - Armario litúrgico",
  "valorUnitario": "450.00"
}
```

**Response:** `201 Created`

---

### PATCH /api/articulos-inventario/:id

Actualizar artículo.

**Auth:** Requerida

**Request:** (solo campos a actualizar)
```json
{
  "stockActual": "95",
  "valorUnitario": "16.00"
}
```

**Response:** `200 OK`

---

### DELETE /api/articulos-inventario/:id

Eliminar artículo (soft delete).

**Auth:** Requerida

**Response:** `204 No Content`

**Nota:** Marca `activo = false` en lugar de eliminar físicamente

---

## 📋 Movimientos de Inventario

### GET /api/movimientos-inventario

Listar todos los movimientos.

**Auth:** Requerida

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "articuloId": "uuid",
    "articuloNombre": "Velas blancas grandes",
    "tipo": "entrada",
    "cantidad": "100",
    "fecha": "2025-10-15",
    "motivo": "compra",
    "referencia": "FACT-2025-1015",
    "registradoPorId": "uuid",
    "registradoPorNombre": "María García",
    "notas": "Compra mayoreo - Proveeduría San José",
    "createdAt": "2025-10-15T10:00:00Z"
  },
  {
    "id": "uuid",
    "articuloId": "uuid",
    "articuloNombre": "Velas blancas grandes",
    "tipo": "salida",
    "cantidad": "20",
    "fecha": "2025-11-05",
    "motivo": "uso_liturgico",
    "referencia": null,
    "registradoPorId": "uuid",
    "registradoPorNombre": "Carlos Jiménez",
    "notas": "Consumo semanal para misas",
    "createdAt": "2025-11-05T14:00:00Z"
  }
]
```

**Tipos:** `entrada`, `salida`  
**Motivos válidos:** `compra`, `donacion`, `uso_liturgico`, `evento`, `prestamo`, `deterioro`, `ajuste`

---

### POST /api/movimientos-inventario

Registrar nuevo movimiento.

**Auth:** Requerida

**Request:**
```json
{
  "articuloId": "uuid",
  "articuloNombre": "Velas blancas grandes",
  "tipo": "entrada",
  "cantidad": "50",
  "fecha": "2025-11-10",
  "motivo": "compra",
  "referencia": "FACT-2025-1110",
  "registradoPorNombre": "María García",
  "notas": "Compra de emergencia - stock bajo"
}
```

**Response:** `201 Created`

**⚡ Side Effect:** El `stockActual` del artículo se actualiza automáticamente:
- `entrada`: suma la cantidad
- `salida`: resta la cantidad

**Ejemplo:**
- Stock actual antes: 95 piezas
- Movimiento: entrada de 50 piezas
- Stock actual después: 145 piezas

**Errores:**
- `400` - Cantidad inválida (no número o negativa)
- `400` - Stock insuficiente para salida
- `404` - Artículo no encontrado

---

### GET /api/movimientos-inventario/:id

Obtener un movimiento específico.

**Auth:** Requerida

**Response:** `200 OK`

---

### GET /api/movimientos-inventario/articulo/:articuloId

Obtener historial de movimientos de un artículo.

**Auth:** Requerida

**Response:** `200 OK` (array de movimientos)

---

## 🤲 Préstamos

### GET /api/prestamos

Listar todos los préstamos.

**Auth:** Requerida

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "articuloId": "uuid",
    "articuloNombre": "Sillas plegables",
    "cantidad": "50",
    "prestatarioNombre": "Juan Hernández",
    "prestatarioTelefono": "477-234-5678",
    "fechaPrestamo": "2025-11-08",
    "fechaDevolucionProgramada": "2025-11-10",
    "fechaDevolucionReal": null,
    "motivo": "Retiro del Grupo Juvenil",
    "estado": "prestado",
    "registradoPorId": "uuid",
    "registradoPorNombre": "María García",
    "notas": "Evento en casa de retiros",
    "createdAt": "2025-11-08T09:00:00Z"
  },
  {
    "id": "uuid",
    "articuloId": "uuid",
    "articuloNombre": "Mesas plegables",
    "cantidad": "20",
    "prestatarioNombre": "Ana López",
    "prestatarioTelefono": "477-345-6789",
    "fechaPrestamo": "2025-10-28",
    "fechaDevolucionProgramada": "2025-10-29",
    "fechaDevolucionReal": "2025-10-29",
    "motivo": "Kermés dominical",
    "estado": "devuelto",
    "registradoPorId": "uuid",
    "registradoPorNombre": "Carlos Jiménez",
    "notas": "Todo en buen estado",
    "createdAt": "2025-10-28T08:00:00Z"
  }
]
```

**Estados válidos:** `prestado`, `devuelto`, `vencido`

---

### POST /api/prestamos

Registrar nuevo préstamo.

**Auth:** Requerida

**Request:**
```json
{
  "articuloId": "uuid",
  "articuloNombre": "Sillas plegables",
  "cantidad": "30",
  "prestatarioNombre": "Pedro Sánchez",
  "prestatarioTelefono": "477-456-7890",
  "fechaPrestamo": "2025-11-15",
  "fechaDevolucionProgramada": "2025-11-17",
  "motivo": "Posada navideña",
  "registradoPorNombre": "María García",
  "notas": "Llevar a domicilio"
}
```

**Response:** `201 Created`

**Validaciones:**
- `cantidad` debe ser > 0
- `fechaDevolucionProgramada` debe ser >= `fechaPrestamo`
- Stock del artículo debe ser suficiente (opcional - depende de política)

---

### PATCH /api/prestamos/:id

Actualizar préstamo (principalmente para marcar como devuelto).

**Auth:** Requerida

**Request:**
```json
{
  "fechaDevolucionReal": "2025-11-17",
  "estado": "devuelto",
  "notas": "Devuelto en buen estado - 2 sillas con rayones menores"
}
```

**Response:** `200 OK`

---

### GET /api/prestamos/estado/:estado

Obtener préstamos por estado.

**Auth:** Requerida

**Ejemplo:** `/api/prestamos/estado/prestado`

**Response:** `200 OK` (array de préstamos)

---

## 🛠️ Utilidades

### POST /api/seed

Cargar datos de ejemplo en la base de datos.

**Auth:** Requerida (requiere rol `parroco`)  
**Environment:** Solo disponible en desarrollo (`NODE_ENV !== "production"`)

**Request:**
```json
{}
```

**Response:** `200 OK`
```json
{
  "message": "Base de datos llenada con datos de ejemplo exitosamente"
}
```

**Datos creados:**
- 10 feligreses
- 7 sacramentos
- 5 grupos pastorales con 14 miembros
- 6 eventos con 13 voluntarios
- 11 categorías financieras
- 19 transacciones
- 17 artículos de inventario
- 8 movimientos de inventario
- 4 préstamos

**Errores:**
- `403` - Endpoint no disponible en producción
- `401` - Se requiere autenticación de párroco
- `500` - Error durante seed (revisar logs)

**Uso típico:**
```bash
# 1. Login primero
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}' \
  -c cookies.txt

# 2. Ejecutar seed con cookie
curl -X POST http://localhost:5000/api/seed \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

---

## 🔄 Códigos de Estado HTTP

**Éxito:**
- `200 OK` - Operación exitosa
- `201 Created` - Recurso creado exitosamente
- `204 No Content` - Operación exitosa sin contenido (ej: DELETE)

**Errores del Cliente:**
- `400 Bad Request` - Datos inválidos (validación Zod falló)
- `401 Unauthorized` - No autenticado (falta cookie de sesión)
- `403 Forbidden` - No autorizado (rol insuficiente)
- `404 Not Found` - Recurso no encontrado

**Errores del Servidor:**
- `500 Internal Server Error` - Error inesperado en el servidor

---

## 🔐 Autenticación y Autorización

### Headers de Request

Todas las rutas protegidas requieren cookie de sesión:

```http
GET /api/feligreses HTTP/1.1
Host: localhost:5000
Cookie: connect.sid=s%3A...
```

### Middleware de Autenticación

**`requireAuth`**: Verifica que el usuario esté autenticado
- Usado en: Todos los endpoints excepto `/api/auth/login` y `/api/auth/register`
- Error si falta: `401 Unauthorized`

**`requireRole(rol)`**: Verifica rol específico
- Usado en: Endpoints administrativos
- Error si rol incorrecto: `403 Forbidden`

**Ejemplo:**
```typescript
// Solo párrocos pueden crear categorías
app.post("/api/categorias-financieras", requireRole("parroco"), handler);

// Cualquier usuario autenticado puede leer
app.get("/api/feligreses", requireAuth, handler);
```

---

## 📝 Formato de Fechas y Datos

### Fechas

Todas las fechas usan formato ISO 8601:
- **Solo fecha:** `YYYY-MM-DD` (ej: `2025-11-10`)
- **Con hora:** `YYYY-MM-DDTHH:mm:ssZ` (ej: `2025-11-10T12:30:00Z`)

### Números Monetarios

Todos los montos son strings para evitar problemas de precisión:
```json
{
  "monto": "1234.50"  // ✅ Correcto
  "monto": 1234.50    // ❌ Incorrecto
}
```

### IDs

Todos los IDs son UUIDs v4 generados por PostgreSQL:
```
"id": "550e8400-e29b-41d4-a716-446655440000"
```

---

## 🧪 Testing con cURL

### Ejemplos Completos

**1. Registro + Login + Consulta:**
```bash
# Registrar usuario
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test",
    "password": "Test123!",
    "nombre": "Usuario Test",
    "rol": "coordinador"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"Test123!"}' \
  -c cookies.txt

# Listar feligreses (usa cookie)
curl -X GET http://localhost:5000/api/feligreses \
  -b cookies.txt
```

**2. Crear transacción:**
```bash
curl -X POST http://localhost:5000/api/transacciones \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "tipo": "ingreso",
    "monto": "5000.00",
    "categoriaId": "<uuid-categoria>",
    "categoriaNombre": "Diezmos",
    "fecha": "2025-11-10",
    "descripcion": "Diezmos dominicales",
    "metodoPago": "efectivo",
    "notas": "Colecta matutina"
  }'
```

**3. Registrar movimiento de inventario:**
```bash
curl -X POST http://localhost:5000/api/movimientos-inventario \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "articuloId": "<uuid-articulo>",
    "articuloNombre": "Velas blancas grandes",
    "tipo": "salida",
    "cantidad": "10",
    "fecha": "2025-11-10",
    "motivo": "uso_liturgico",
    "registradoPorNombre": "Sacristán",
    "notas": "Misas de la semana"
  }'

# Verificar que el stock se actualizó
curl -X GET http://localhost:5000/api/articulos-inventario/<uuid> \
  -b cookies.txt
```

---

## 🚀 Rate Limiting y Seguridad

**Actualmente no implementado**, pero se recomienda para producción:

- Rate limiting: 100 requests/minuto por IP
- CORS: Configurado para origen específico
- Helmet.js: Headers de seguridad
- CSRF protection: Para formularios

---

## 📚 Recursos Adicionales

- [Documentación Drizzle ORM](https://orm.drizzle.team/)
- [Zod Validation](https://zod.dev/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

---

**Última actualización:** Noviembre 10, 2025  
**Versión API:** 1.0  
**Contacto:** Ver documentación del proyecto
