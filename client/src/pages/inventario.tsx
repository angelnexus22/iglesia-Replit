import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Search, Package, AlertTriangle, Edit, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
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
  insertArticuloInventarioSchema,
  insertMovimientoInventarioSchema,
  type ArticuloInventario, 
  type InsertArticuloInventario,
  type InsertMovimientoInventario
} from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Inventario() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [movimientoDialogOpen, setMovimientoDialogOpen] = useState(false);
  const [editingArticulo, setEditingArticulo] = useState<ArticuloInventario | null>(null);
  const [activeTab, setActiveTab] = useState("todos");
  const { toast } = useToast();

  const { data: articulos = [], isLoading } = useQuery<ArticuloInventario[]>({ 
    queryKey: ["/api/articulos-inventario"] 
  });

  const createArticuloMutation = useMutation({
    mutationFn: async (data: InsertArticuloInventario) => {
      return await apiRequest("POST", "/api/articulos-inventario", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articulos-inventario"] });
      setDialogOpen(false);
      articuloForm.reset();
      toast({
        title: "Artículo registrado",
        description: "El artículo ha sido registrado exitosamente",
      });
    },
  });

  const updateArticuloMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: InsertArticuloInventario }) => {
      return await apiRequest("PATCH", `/api/articulos-inventario/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articulos-inventario"] });
      setDialogOpen(false);
      setEditingArticulo(null);
      articuloForm.reset();
      toast({
        title: "Artículo actualizado",
        description: "Los datos han sido actualizados exitosamente",
      });
    },
  });

  const createMovimientoMutation = useMutation({
    mutationFn: async (data: InsertMovimientoInventario) => {
      const articulo = articulos.find(a => a.id === data.articuloId);
      const payload = {
        ...data,
        articuloNombre: articulo?.nombre || "",
        registradoPorId: "",
        registradoPorNombre: "",
      };
      return await apiRequest("POST", "/api/movimientos-inventario", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articulos-inventario"] });
      queryClient.invalidateQueries({ queryKey: ["/api/movimientos-inventario"] });
      setMovimientoDialogOpen(false);
      movimientoForm.reset();
      toast({
        title: "Movimiento registrado",
        description: "El movimiento de inventario ha sido registrado exitosamente",
      });
    },
  });

  const articuloForm = useForm<InsertArticuloInventario>({
    resolver: zodResolver(insertArticuloInventarioSchema),
    defaultValues: {
      nombre: "",
      categoria: "liturgico",
      descripcion: "",
      unidadMedida: "",
      stockActual: "0",
      stockMinimo: "0",
      ubicacion: "",
      valorUnitario: "",
      activo: true,
    },
  });

  const movimientoForm = useForm<InsertMovimientoInventario>({
    resolver: zodResolver(insertMovimientoInventarioSchema.extend({
      cantidad: insertMovimientoInventarioSchema.shape.cantidad.refine((val) => parseFloat(val) > 0, {
        message: "La cantidad debe ser mayor a 0",
      }),
    })),
    defaultValues: {
      articuloId: "",
      articuloNombre: "",
      tipo: "entrada",
      cantidad: "",
      fecha: new Date().toISOString().split('T')[0],
      motivo: "compra",
      referencia: "",
      registradoPorId: "",
      registradoPorNombre: "",
      notas: "",
    },
  });

  const onArticuloSubmit = (data: InsertArticuloInventario) => {
    if (editingArticulo) {
      updateArticuloMutation.mutate({ id: editingArticulo.id, data });
    } else {
      createArticuloMutation.mutate(data);
    }
  };

  const onMovimientoSubmit = (data: InsertMovimientoInventario) => {
    createMovimientoMutation.mutate(data);
  };

  const handleEdit = (articulo: ArticuloInventario) => {
    setEditingArticulo(articulo);
    articuloForm.reset({
      nombre: articulo.nombre,
      categoria: articulo.categoria,
      descripcion: articulo.descripcion || "",
      unidadMedida: articulo.unidadMedida,
      stockActual: articulo.stockActual,
      stockMinimo: articulo.stockMinimo,
      ubicacion: articulo.ubicacion || "",
      valorUnitario: articulo.valorUnitario || "",
      activo: articulo.activo ?? true,
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingArticulo(null);
      articuloForm.reset();
    }
  };

  const handleCloseMovimientoDialog = (open: boolean) => {
    setMovimientoDialogOpen(open);
    if (!open) {
      movimientoForm.reset();
    }
  };

  const filteredArticulos = articulos.filter((a) =>
    a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const articulosByCategoria = {
    todos: filteredArticulos,
    liturgico: filteredArticulos.filter(a => a.categoria === "liturgico"),
    equipo: filteredArticulos.filter(a => a.categoria === "equipo"),
    consumible: filteredArticulos.filter(a => a.categoria === "consumible"),
    mobiliario: filteredArticulos.filter(a => a.categoria === "mobiliario"),
  };

  const totalArticulos = articulos.length;
  const articulosActivos = articulos.filter(a => a.activo).length;
  const articulosStockBajo = articulos.filter(a => 
    parseFloat(a.stockActual) < parseFloat(a.stockMinimo)
  ).length;

  const articulosActivos2 = articulos.filter(a => a.activo);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">Gestión de Inventario</h1>
        <p className="text-muted-foreground text-lg">
          Control de artículos y equipamiento parroquial
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card data-testid="card-total-articulos">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="w-4 h-4" />
              Total Artículos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold" data-testid="text-total-articulos">
              {totalArticulos}
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-alertas-stock">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Alertas de Stock Bajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-semibold ${articulosStockBajo > 0 ? 'text-red-600' : ''}`} data-testid="text-alertas-stock">
              {articulosStockBajo}
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-articulos-activos">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="w-4 h-4" />
              Artículos Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold" data-testid="text-articulos-activos">
              {articulosActivos}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, categoría o ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-base"
            data-testid="input-search-articulos"
          />
        </div>
        <Dialog open={movimientoDialogOpen} onOpenChange={handleCloseMovimientoDialog}>
          <DialogTrigger asChild>
            <Button 
              size="lg" 
              variant="outline"
              className="h-12 px-6"
              data-testid="button-add-movimiento"
            >
              <ArrowRightLeft className="w-5 h-5 mr-2" />
              Registrar Movimiento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Registrar Movimiento de Inventario</DialogTitle>
            </DialogHeader>
            <Form {...movimientoForm}>
              <form onSubmit={movimientoForm.handleSubmit(onMovimientoSubmit)} className="space-y-6">
                <FormField
                  control={movimientoForm.control}
                  name="articuloId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Artículo *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 text-base" data-testid="select-articulo">
                            <SelectValue placeholder="Seleccionar artículo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {articulosActivos2.map((art) => (
                            <SelectItem key={art.id} value={art.id}>
                              {art.nombre} ({art.stockActual} {art.unidadMedida})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={movimientoForm.control}
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Tipo *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 text-base" data-testid="select-tipo-movimiento">
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="entrada">Entrada</SelectItem>
                            <SelectItem value="salida">Salida</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={movimientoForm.control}
                    name="cantidad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Cantidad *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="0"
                            {...field} 
                            className="h-12 text-base" 
                            data-testid="input-cantidad-movimiento" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={movimientoForm.control}
                    name="fecha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Fecha *</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            className="h-12 text-base" 
                            data-testid="input-fecha-movimiento" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={movimientoForm.control}
                    name="motivo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Motivo *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 text-base" data-testid="select-motivo">
                              <SelectValue placeholder="Seleccionar motivo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="compra">Compra</SelectItem>
                            <SelectItem value="donacion">Donación</SelectItem>
                            <SelectItem value="uso_liturgico">Uso Litúrgico</SelectItem>
                            <SelectItem value="evento">Evento</SelectItem>
                            <SelectItem value="prestamo">Préstamo</SelectItem>
                            <SelectItem value="deterioro">Deterioro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={movimientoForm.control}
                  name="referencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Referencia</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          value={field.value || ""}
                          placeholder="Factura, evento, etc."
                          className="h-12 text-base" 
                          data-testid="input-referencia-movimiento" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={movimientoForm.control}
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
                          data-testid="input-notas-movimiento" 
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
                    onClick={() => handleCloseMovimientoDialog(false)} 
                    className="flex-1 h-12"
                    data-testid="button-cancel-movimiento"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 h-12"
                    disabled={createMovimientoMutation.isPending}
                    data-testid="button-save-movimiento"
                  >
                    {createMovimientoMutation.isPending ? "Guardando..." : "Guardar"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button 
              size="lg" 
              className="h-12 px-6"
              data-testid="button-add-articulo"
            >
              <Plus className="w-5 h-5 mr-2" />
              Registrar Artículo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {editingArticulo ? "Editar Artículo" : "Registrar Nuevo Artículo"}
              </DialogTitle>
            </DialogHeader>
            <Form {...articuloForm}>
              <form onSubmit={articuloForm.handleSubmit(onArticuloSubmit)} className="space-y-6">
                <FormField
                  control={articuloForm.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Nombre del Artículo *</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-12 text-base" data-testid="input-nombre" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={articuloForm.control}
                  name="categoria"
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
                          <SelectItem value="liturgico">Litúrgico</SelectItem>
                          <SelectItem value="equipo">Equipo</SelectItem>
                          <SelectItem value="consumible">Consumible</SelectItem>
                          <SelectItem value="mobiliario">Mobiliario</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={articuloForm.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Descripción</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          value={field.value || ""}
                          className="text-base resize-none" 
                          rows={2}
                          data-testid="input-descripcion" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={articuloForm.control}
                    name="unidadMedida"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Unidad de Medida *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Ej: piezas, litros, kg"
                            className="h-12 text-base" 
                            data-testid="input-unidad-medida" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={articuloForm.control}
                    name="ubicacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Ubicación</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            value={field.value || ""}
                            placeholder="Ej: Sacristía, Bodega"
                            className="h-12 text-base" 
                            data-testid="input-ubicacion" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={articuloForm.control}
                    name="stockActual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Stock Actual</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field} 
                            className="h-12 text-base" 
                            data-testid="input-stock-actual" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={articuloForm.control}
                    name="stockMinimo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Stock Mínimo</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field} 
                            className="h-12 text-base" 
                            data-testid="input-stock-minimo" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={articuloForm.control}
                    name="valorUnitario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Valor Unitario</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field} 
                            value={field.value || ""}
                            placeholder="0.00"
                            className="h-12 text-base" 
                            data-testid="input-valor-unitario" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={articuloForm.control}
                  name="activo"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value ?? false} 
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-activo"
                        />
                      </FormControl>
                      <FormLabel className="text-base font-normal cursor-pointer">
                        Artículo activo
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleCloseDialog(false)} 
                    className="flex-1 h-12"
                    data-testid="button-cancel-articulo"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 h-12"
                    disabled={createArticuloMutation.isPending || updateArticuloMutation.isPending}
                    data-testid="button-save-articulo"
                  >
                    {createArticuloMutation.isPending || updateArticuloMutation.isPending ? "Guardando..." : "Guardar"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList data-testid="tabs-categoria">
          <TabsTrigger value="todos" data-testid="tab-todos">Todos</TabsTrigger>
          <TabsTrigger value="liturgico" data-testid="tab-liturgico">Litúrgico</TabsTrigger>
          <TabsTrigger value="equipo" data-testid="tab-equipo">Equipo</TabsTrigger>
          <TabsTrigger value="consumible" data-testid="tab-consumible">Consumible</TabsTrigger>
          <TabsTrigger value="mobiliario" data-testid="tab-mobiliario">Mobiliario</TabsTrigger>
        </TabsList>

        {Object.entries(articulosByCategoria).map(([key, items]) => (
          <TabsContent key={key} value={key}>
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Cargando...</p>
              </div>
            ) : items.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="w-24 h-24 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-medium mb-2">
                    {searchTerm ? "No se encontraron artículos" : "No hay artículos registrados"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm 
                      ? "Intenta con otro término de búsqueda" 
                      : "Comienza registrando el primer artículo de inventario"
                    }
                  </p>
                  {!searchTerm && (
                    <Button onClick={() => setDialogOpen(true)} size="lg" data-testid="button-add-first-articulo">
                      <Plus className="w-5 h-5 mr-2" />
                      Registrar Primer Artículo
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((articulo) => {
                  const stockBajo = parseFloat(articulo.stockActual) < parseFloat(articulo.stockMinimo);
                  return (
                    <Card key={articulo.id} className="hover-elevate" data-testid={`card-articulo-${articulo.id}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <Badge variant="secondary" className="capitalize">
                                {articulo.categoria}
                              </Badge>
                              {stockBajo && (
                                <Badge variant="destructive" className="flex items-center gap-1" data-testid={`badge-stock-bajo-${articulo.id}`}>
                                  <AlertTriangle className="w-3 h-3" />
                                  Stock Bajo
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-lg truncate">{articulo.nombre}</CardTitle>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(articulo)}
                            data-testid={`button-edit-articulo-${articulo.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {articulo.descripcion && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {articulo.descripcion}
                          </p>
                        )}
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Stock Actual</p>
                            <p className={`text-lg font-semibold ${stockBajo ? 'text-red-600' : ''}`} data-testid={`text-stock-actual-${articulo.id}`}>
                              {articulo.stockActual} {articulo.unidadMedida}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Stock Mínimo</p>
                            <p className="text-lg font-semibold">
                              {articulo.stockMinimo} {articulo.unidadMedida}
                            </p>
                          </div>
                        </div>
                        {articulo.ubicacion && (
                          <p className="text-sm pt-2">
                            <span className="text-muted-foreground">Ubicación:</span> {articulo.ubicacion}
                          </p>
                        )}
                        {!articulo.activo && (
                          <Badge variant="secondary" className="mt-2">Inactivo</Badge>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
