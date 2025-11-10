import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Search, TrendingUp, TrendingDown, DollarSign, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  insertTransaccionSchema, 
  type Transaccion, 
  type InsertTransaccion,
  type CategoriaFinanciera
} from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const formatCurrency = (amount: string) => {
  const numericAmount = parseFloat(amount);
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(numericAmount);
};

export default function Contabilidad() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaccion, setEditingTransaccion] = useState<Transaccion | null>(null);
  const [activeTab, setActiveTab] = useState("todas");
  const { toast } = useToast();

  const { data: transacciones = [], isLoading } = useQuery<Transaccion[]>({ 
    queryKey: ["/api/transacciones"] 
  });

  const { data: categorias = [] } = useQuery<CategoriaFinanciera[]>({ 
    queryKey: ["/api/categorias-financieras"] 
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertTransaccion) => {
      const categoria = categorias.find(c => c.id === data.categoriaId);
      const payload = {
        ...data,
        categoriaNombre: categoria?.nombre || "",
        registradoPorId: "",
        registradoPorNombre: "",
      };
      return await apiRequest("POST", "/api/transacciones", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transacciones"] });
      setDialogOpen(false);
      form.reset();
      toast({
        title: "Transacción registrada",
        description: "La transacción ha sido registrada exitosamente",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: InsertTransaccion }) => {
      const categoria = categorias.find(c => c.id === data.categoriaId);
      const payload = {
        ...data,
        categoriaNombre: categoria?.nombre || "",
      };
      return await apiRequest("PATCH", `/api/transacciones/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transacciones"] });
      setDialogOpen(false);
      setEditingTransaccion(null);
      form.reset();
      toast({
        title: "Transacción actualizada",
        description: "Los datos han sido actualizados exitosamente",
      });
    },
  });

  const form = useForm<InsertTransaccion>({
    resolver: zodResolver(insertTransaccionSchema.extend({
      monto: insertTransaccionSchema.shape.monto.refine((val) => parseFloat(val) > 0, {
        message: "El monto debe ser mayor a 0",
      }),
    })),
    defaultValues: {
      tipo: "ingreso",
      monto: "",
      categoriaId: "",
      categoriaNombre: "",
      fecha: new Date().toISOString().split('T')[0],
      descripcion: "",
      metodoPago: "efectivo",
      referencia: "",
      registradoPorId: "",
      registradoPorNombre: "",
      notas: "",
    },
  });

  const selectedTipo = form.watch("tipo");

  const onSubmit = (data: InsertTransaccion) => {
    if (editingTransaccion) {
      updateMutation.mutate({ id: editingTransaccion.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (transaccion: Transaccion) => {
    setEditingTransaccion(transaccion);
    form.reset({
      tipo: transaccion.tipo,
      monto: transaccion.monto,
      categoriaId: transaccion.categoriaId,
      categoriaNombre: transaccion.categoriaNombre,
      fecha: transaccion.fecha,
      descripcion: transaccion.descripcion,
      metodoPago: transaccion.metodoPago || "efectivo",
      referencia: transaccion.referencia || "",
      registradoPorId: transaccion.registradoPorId || "",
      registradoPorNombre: transaccion.registradoPorNombre || "",
      notas: transaccion.notas || "",
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingTransaccion(null);
      form.reset();
    }
  };

  const filteredTransacciones = transacciones
    .filter((t) =>
      t.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.categoriaNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.referencia?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const transaccionesByType = {
    todas: filteredTransacciones,
    ingresos: filteredTransacciones.filter(t => t.tipo === "ingreso"),
    egresos: filteredTransacciones.filter(t => t.tipo === "egreso"),
  };

  const totalIngresos = transacciones
    .filter(t => t.tipo === "ingreso")
    .reduce((sum, t) => sum + parseFloat(t.monto), 0);

  const totalEgresos = transacciones
    .filter(t => t.tipo === "egreso")
    .reduce((sum, t) => sum + parseFloat(t.monto), 0);

  const balance = totalIngresos - totalEgresos;

  const categoriasActivas = categorias.filter(c => c.activo && c.tipo === selectedTipo);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">Gestión Financiera</h1>
        <p className="text-muted-foreground text-lg">
          Control de ingresos y egresos parroquiales
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card data-testid="card-total-ingresos">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Total Ingresos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-green-600" data-testid="text-total-ingresos">
              {formatCurrency(totalIngresos.toString())}
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-total-egresos">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Total Egresos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-red-600" data-testid="text-total-egresos">
              {formatCurrency(totalEgresos.toString())}
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
            <p 
              className={`text-2xl font-semibold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}
              data-testid="text-balance"
            >
              {formatCurrency(balance.toString())}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por descripción, categoría o referencia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-base"
            data-testid="input-search-transacciones"
          />
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button 
              size="lg" 
              className="h-12 px-6"
              data-testid="button-add-transaccion"
            >
              <Plus className="w-5 h-5 mr-2" />
              Registrar Transacción
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {editingTransaccion ? "Editar Transacción" : "Registrar Nueva Transacción"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Tipo *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 text-base" data-testid="select-tipo">
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ingreso">Ingreso</SelectItem>
                            <SelectItem value="egreso">Egreso</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="monto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Monto *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="0.00"
                            {...field} 
                            className="h-12 text-base" 
                            data-testid="input-monto" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="categoriaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Categoría *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 text-base" data-testid="select-categoria">
                            <SelectValue placeholder="Seleccionar categoría" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoriasActivas.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fecha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Fecha *</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                          className="h-12 text-base" 
                          data-testid="input-fecha" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Descripción *</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="text-base resize-none" 
                          rows={3}
                          data-testid="input-descripcion" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="metodoPago"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Método de Pago</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || "efectivo"}>
                          <FormControl>
                            <SelectTrigger className="h-12 text-base" data-testid="select-metodo-pago">
                              <SelectValue placeholder="Seleccionar método" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="efectivo">Efectivo</SelectItem>
                            <SelectItem value="transferencia">Transferencia</SelectItem>
                            <SelectItem value="cheque">Cheque</SelectItem>
                            <SelectItem value="tarjeta">Tarjeta</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="referencia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Referencia</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            value={field.value || ""}
                            placeholder="No. cheque, folio, etc."
                            className="h-12 text-base" 
                            data-testid="input-referencia" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Notas</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          value={field.value || ""}
                          className="text-base resize-none" 
                          rows={2}
                          data-testid="input-notas" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleCloseDialog(false)} 
                    className="flex-1 h-12"
                    data-testid="button-cancel-transaccion"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 h-12"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-save-transaccion"
                  >
                    {createMutation.isPending || updateMutation.isPending ? "Guardando..." : "Guardar"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList data-testid="tabs-tipo">
          <TabsTrigger value="todas" data-testid="tab-todas">Todas</TabsTrigger>
          <TabsTrigger value="ingresos" data-testid="tab-ingresos">Ingresos</TabsTrigger>
          <TabsTrigger value="egresos" data-testid="tab-egresos">Egresos</TabsTrigger>
        </TabsList>

        {Object.entries(transaccionesByType).map(([key, items]) => (
          <TabsContent key={key} value={key}>
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Cargando...</p>
              </div>
            ) : items.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <DollarSign className="w-24 h-24 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-medium mb-2">
                    {searchTerm ? "No se encontraron transacciones" : "No hay transacciones registradas"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm 
                      ? "Intenta con otro término de búsqueda" 
                      : "Comienza registrando la primera transacción financiera"
                    }
                  </p>
                  {!searchTerm && (
                    <Button onClick={() => setDialogOpen(true)} size="lg" data-testid="button-add-first-transaccion">
                      <Plus className="w-5 h-5 mr-2" />
                      Registrar Primera Transacción
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((transaccion) => (
                  <Card key={transaccion.id} className="hover-elevate" data-testid={`card-transaccion-${transaccion.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              transaccion.tipo === "ingreso" 
                                ? "bg-green-50 text-green-700" 
                                : "bg-red-50 text-red-700"
                            }`}>
                              {transaccion.tipo === "ingreso" ? (
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3" />
                                  Ingreso
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <TrendingDown className="w-3 h-3" />
                                  Egreso
                                </div>
                              )}
                            </div>
                          </div>
                          <CardTitle className={`text-2xl font-semibold ${
                            transaccion.tipo === "ingreso" ? "text-green-600" : "text-red-600"
                          }`} data-testid={`text-monto-${transaccion.id}`}>
                            {formatCurrency(transaccion.monto)}
                          </CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(transaccion)}
                          data-testid={`button-edit-transaccion-${transaccion.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm font-medium">{transaccion.categoriaNombre}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {transaccion.descripcion}
                      </p>
                      <div className="flex items-center justify-between pt-2 text-sm text-muted-foreground">
                        <span>
                          {new Date(transaccion.fecha).toLocaleDateString('es-MX', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        {transaccion.metodoPago && (
                          <span className="capitalize">{transaccion.metodoPago}</span>
                        )}
                      </div>
                      {transaccion.referencia && (
                        <p className="text-xs text-muted-foreground">
                          Ref: {transaccion.referencia}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
