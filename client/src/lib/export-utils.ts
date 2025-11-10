import { format } from "date-fns";

/**
 * Escapa un valor para uso seguro en CSV
 */
function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value);
  
  // Si contiene comas, saltos de línea o comillas, encerrar entre comillas
  if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Convierte un array de objetos a formato CSV
 */
function convertToCSV(data: any[], headers: string[]): string {
  const headerRow = headers.join(',');
  
  const rows = data.map(item => {
    return headers.map(header => escapeCSVValue(item[header])).join(',');
  });
  
  return [headerRow, ...rows].join('\n');
}

/**
 * Descarga un string como archivo CSV
 */
function downloadCSV(csv: string, filename: string) {
  const BOM = '\uFEFF'; // UTF-8 BOM para correcta visualización en Excel
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Liberar URL del blob
  setTimeout(() => URL.revokeObjectURL(link.href), 100);
}

/**
 * Exporta transacciones financieras a CSV
 */
export function exportTransaccionesCSV(transacciones: any[]) {
  const fecha = format(new Date(), 'yyyy-MM-dd');
  const filename = `transacciones_${fecha}.csv`;
  
  const headers = [
    'fecha',
    'tipo',
    'categoriaNombre',
    'monto',
    'metodoPago',
    'descripcion',
    'referencia',
    'notas',
    'registradoPorNombre'
  ];
  
  // Formatear datos para CSV
  const formattedData = transacciones.map(t => ({
    fecha: format(new Date(t.fecha), 'dd/MM/yyyy'),
    tipo: t.tipo === 'ingreso' ? 'Ingreso' : 'Egreso',
    categoriaNombre: t.categoriaNombre || '',
    monto: `$${parseFloat(t.monto).toFixed(2)}`,
    metodoPago: t.metodoPago || '',
    descripcion: t.descripcion || '',
    referencia: t.referencia || '',
    notas: t.notas || '',
    registradoPorNombre: t.registradoPorNombre || ''
  }));
  
  const csv = convertToCSV(formattedData, headers);
  downloadCSV(csv, filename);
}

/**
 * Exporta artículos de inventario a CSV
 */
export function exportInventarioCSV(articulos: any[]) {
  const fecha = format(new Date(), 'yyyy-MM-dd');
  const filename = `inventario_${fecha}.csv`;
  
  const headers = [
    'nombre',
    'categoria',
    'descripcion',
    'unidadMedida',
    'stockActual',
    'stockMinimo',
    'ubicacion',
    'valorUnitario',
    'activo'
  ];
  
  // Formatear datos para CSV
  const formattedData = articulos.map(a => ({
    nombre: a.nombre,
    categoria: a.categoria,
    descripcion: a.descripcion || '',
    unidadMedida: a.unidadMedida,
    stockActual: a.stockActual,
    stockMinimo: a.stockMinimo,
    ubicacion: a.ubicacion || '',
    valorUnitario: a.valorUnitario ? `$${parseFloat(a.valorUnitario).toFixed(2)}` : '',
    activo: a.activo ? 'Sí' : 'No'
  }));
  
  const csv = convertToCSV(formattedData, headers);
  downloadCSV(csv, filename);
}

/**
 * Exporta movimientos de inventario a CSV
 */
export function exportMovimientosCSV(movimientos: any[]) {
  const fecha = format(new Date(), 'yyyy-MM-dd');
  const filename = `movimientos_inventario_${fecha}.csv`;
  
  const headers = [
    'fecha',
    'tipo',
    'cantidad',
    'articulo',
    'motivo',
    'referencia',
    'responsable',
    'notas'
  ];
  
  // Formatear datos para CSV
  const formattedData = movimientos.map(m => ({
    fecha: format(new Date(m.fecha), 'dd/MM/yyyy'),
    tipo: m.tipo,
    cantidad: m.cantidad,
    articulo: m.articuloNombre || `ID: ${m.articuloId}`,
    motivo: m.motivo || '',
    referencia: m.referencia || '',
    responsable: m.responsable || '',
    notas: m.notas || ''
  }));
  
  const csv = convertToCSV(formattedData, headers);
  downloadCSV(csv, filename);
}

/**
 * Exporta reporte financiero completo (resumen + transacciones)
 */
export function exportReporteFinancieroCSV(transacciones: any[], categorias: any[]) {
  const fecha = format(new Date(), 'yyyy-MM-dd');
  const filename = `reporte_financiero_${fecha}.csv`;
  
  // Calcular totales
  const totalIngresos = transacciones
    .filter(t => t.tipo === "ingreso")
    .reduce((sum, t) => sum + parseFloat(t.monto), 0);
  
  const totalEgresos = transacciones
    .filter(t => t.tipo === "egreso")
    .reduce((sum, t) => sum + parseFloat(t.monto), 0);
  
  const balance = totalIngresos - totalEgresos;
  
  // Resumen por categoría
  const resumenCategorias = categorias.map(cat => {
    const transaccionesCategoria = transacciones.filter(t => t.categoriaId === cat.id);
    const montoTotal = transaccionesCategoria.reduce((sum, t) => sum + parseFloat(t.monto), 0);
    
    return {
      categoria: cat.nombre,
      tipo: cat.tipo === 'ingreso' ? 'Ingreso' : 'Egreso',
      monto: `$${montoTotal.toFixed(2)}`,
      numTransacciones: transaccionesCategoria.length
    };
  }).filter(item => item.numTransacciones > 0);
  
  // Construir CSV manualmente con secciones
  let csv = 'Reporte Financiero Parroquial\n';
  csv += `Fecha de generación: ${format(new Date(), 'dd/MM/yyyy HH:mm')}\n`;
  csv += '\n';
  csv += 'RESUMEN GENERAL\n';
  csv += `Total Ingresos,$${totalIngresos.toFixed(2)}\n`;
  csv += `Total Egresos,$${totalEgresos.toFixed(2)}\n`;
  csv += `Balance,$${balance.toFixed(2)}\n`;
  csv += '\n';
  csv += 'RESUMEN POR CATEGORÍA\n';
  
  // Datos del resumen con encabezados en español y escape correcto
  const resumenHeaders = ['Categoría', 'Tipo', 'Monto Total', 'Número de Transacciones'];
  const resumenRows = resumenCategorias.map(item => [
    item.categoria,
    item.tipo,
    item.monto,
    item.numTransacciones.toString()
  ]);
  
  csv += resumenHeaders.map(escapeCSVValue).join(',') + '\n';
  csv += resumenRows.map(row => row.map(escapeCSVValue).join(',')).join('\n');
  csv += '\n\n';
  csv += 'DETALLE DE TRANSACCIONES\n';
  
  // Datos de transacciones con encabezados en español y escape correcto
  const transaccionesHeaders = ['Fecha', 'Tipo', 'Categoría', 'Monto', 'Método de Pago', 'Descripción'];
  const transaccionesRows = transacciones.map(t => [
    format(new Date(t.fecha), 'dd/MM/yyyy'),
    t.tipo === 'ingreso' ? 'Ingreso' : 'Egreso',
    t.categoriaNombre || '',
    `$${parseFloat(t.monto).toFixed(2)}`,
    t.metodoPago || '',
    t.descripcion || ''
  ]);
  
  csv += transaccionesHeaders.map(escapeCSVValue).join(',') + '\n';
  csv += transaccionesRows.map(row => row.map(escapeCSVValue).join(',')).join('\n');
  
  downloadCSV(csv, filename);
}
