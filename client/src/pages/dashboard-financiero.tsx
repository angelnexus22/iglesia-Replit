import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { type Transaccion, type CategoriaFinanciera } from "@shared/schema";
import { format, startOfMonth, parseISO } from "date-fns";
import { es } from "date-fns/locale";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
};

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function DashboardFinanciero() {
  const { data: transacciones = [], isLoading } = useQuery<Transaccion[]>({ 
    queryKey: ["/api/transacciones"] 
  });

  const { data: categorias = [] } = useQuery<CategoriaFinanciera[]>({ 
    queryKey: ["/api/categorias-financieras"] 
  });

  // Calcular totales (memoizado para evitar recalcular en cada render)
  const totales = useMemo(() => {
    const totalIngresos = transacciones
      .filter(t => t.tipo === "ingreso")
      .reduce((sum, t) => sum + parseFloat(t.monto), 0);

    const totalEgresos = transacciones
      .filter(t => t.tipo === "egreso")
      .reduce((sum, t) => sum + parseFloat(t.monto), 0);

    return {
      totalIngresos,
      totalEgresos,
      balance: totalIngresos - totalEgresos,
    };
  }, [transacciones]);

  // Datos para gráfica de ingresos vs egresos (memoizado)
  const ingresosVsEgresosData = useMemo(() => [
    { name: 'Ingresos', monto: totales.totalIngresos },
    { name: 'Egresos', monto: totales.totalEgresos },
  ], [totales]);

  // Datos para gráfica de distribución por categoría (memoizado)
  const distribucionPorCategoria = useMemo(() => {
    return categorias.map(categoria => {
      const montoTotal = transacciones
        .filter(t => t.categoriaId === categoria.id)
        .reduce((sum, t) => sum + parseFloat(t.monto), 0);
      
      return {
        nombre: categoria.nombre,
        monto: montoTotal,
        tipo: categoria.tipo,
      };
    }).filter(item => item.monto > 0);
  }, [categorias, transacciones]);

  // Datos para gráfica de tendencias mensuales (últimos 6 meses, memoizado)
  const tendenciasData = useMemo(() => {
    const monthsMap = new Map<string, { ingresos: number; egresos: number }>();
    
    transacciones.forEach(t => {
      const fecha = parseISO(t.fecha);
      const monthKey = format(startOfMonth(fecha), 'yyyy-MM');
      
      if (!monthsMap.has(monthKey)) {
        monthsMap.set(monthKey, { ingresos: 0, egresos: 0 });
      }
      
      const data = monthsMap.get(monthKey)!;
      if (t.tipo === "ingreso") {
        data.ingresos += parseFloat(t.monto);
      } else {
        data.egresos += parseFloat(t.monto);
      }
    });

    return Array.from(monthsMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6)
      .map(([key, data]) => {
        const fecha = parseISO(key + '-01');
        return {
          mes: format(fecha, 'MMM yyyy', { locale: es }),
          ingresos: data.ingresos,
          egresos: data.egresos,
        };
      });
  }, [transacciones]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground">Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">Dashboard Financiero</h1>
        <p className="text-muted-foreground text-lg">
          Análisis y visualización de la situación financiera parroquial
        </p>
      </div>

      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card data-testid="card-total-ingresos">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Total Ingresos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-green-600" data-testid="text-total-ingresos">
              {formatCurrency(totales.totalIngresos)}
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-total-egresos">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              Total Egresos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-red-600" data-testid="text-total-egresos">
              {formatCurrency(totales.totalEgresos)}
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-balance">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-semibold ${totales.balance >= 0 ? 'text-green-600' : 'text-red-600'}`} data-testid="text-balance">
              {formatCurrency(totales.balance)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Ingresos vs Egresos */}
        <Card data-testid="chart-ingresos-egresos">
          <CardHeader>
            <CardTitle className="text-lg">Ingresos vs Egresos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ingresosVsEgresosData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="monto" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribución por Categoría */}
        <Card data-testid="chart-distribucion-categoria">
          <CardHeader>
            <CardTitle className="text-lg">Distribución por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={distribucionPorCategoria}
                  dataKey="monto"
                  nameKey="nombre"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.nombre}: ${formatCurrency(entry.monto)}`}
                >
                  {distribucionPorCategoria.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tendencias Mensuales */}
      <Card data-testid="chart-tendencias-mensuales">
        <CardHeader>
          <CardTitle className="text-lg">Tendencias Mensuales (Últimos 6 Meses)</CardTitle>
        </CardHeader>
        <CardContent>
          {tendenciasData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={tendenciasData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={2} name="Ingresos" />
                <Line type="monotone" dataKey="egresos" stroke="#ef4444" strokeWidth={2} name="Egresos" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <p>No hay datos suficientes para mostrar tendencias</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumen por Categoría (Tabla) */}
      <Card className="mt-6" data-testid="table-resumen-categorias">
        <CardHeader>
          <CardTitle className="text-lg">Resumen por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Categoría</th>
                  <th className="text-left py-3 px-4 font-medium">Tipo</th>
                  <th className="text-right py-3 px-4 font-medium">Monto Total</th>
                  <th className="text-right py-3 px-4 font-medium">Transacciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((categoria) => {
                  const transaccionesCategoria = transacciones.filter(t => t.categoriaId === categoria.id);
                  const montoTotal = transaccionesCategoria.reduce((sum, t) => sum + parseFloat(t.monto), 0);
                  
                  if (transaccionesCategoria.length === 0) return null;

                  return (
                    <tr key={categoria.id} className="border-b hover-elevate">
                      <td className="py-3 px-4">{categoria.nombre}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded text-sm ${
                          categoria.tipo === 'ingreso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {categoria.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
                        </span>
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        {formatCurrency(montoTotal)}
                      </td>
                      <td className="text-right py-3 px-4 text-muted-foreground">
                        {transaccionesCategoria.length}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
