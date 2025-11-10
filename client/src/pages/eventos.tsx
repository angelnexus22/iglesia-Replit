import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Search, Calendar, Edit, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEventoSchema, type Evento, type InsertEvento } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Eventos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);
  const { toast } = useToast();

  const { data: eventos = [], isLoading } = useQuery<Evento[]>({ 
    queryKey: ["/api/eventos"] 
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertEvento) => {
      return await apiRequest("POST", "/api/eventos", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/eventos"] });
      setDialogOpen(false);
      form.reset();
      toast({
        title: "Evento creado",
        description: "El evento ha sido creado exitosamente",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: InsertEvento }) => {
      return await apiRequest("PATCH", `/api/eventos/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/eventos"] });
      setDialogOpen(false);
      setEditingEvento(null);
      form.reset();
      toast({
        title: "Evento actualizado",
        description: "Los datos han sido actualizados exitosamente",
      });
    },
  });

  const form = useForm<InsertEvento>({
    resolver: zodResolver(insertEventoSchema),
    defaultValues: {
      titulo: "",
      descripcion: "",
      tipo: "",
      fecha: new Date().toISOString().split('T')[0],
      horaInicio: "",
      horaFin: "",
      lugar: "",
      organizadorId: "",
      organizadorNombre: "",
      requiereVoluntarios: false,
      activo: true,
    },
  });

  const onSubmit = (data: InsertEvento) => {
    if (editingEvento) {
      updateMutation.mutate({ id: editingEvento.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (evento: Evento) => {
    setEditingEvento(evento);
    form.reset({
      titulo: evento.titulo,
      descripcion: evento.descripcion || "",
      tipo: evento.tipo,
      fecha: evento.fecha,
      horaInicio: evento.horaInicio || "",
      horaFin: evento.horaFin || "",
      lugar: evento.lugar || "",
      organizadorId: evento.organizadorId || "",
      organizadorNombre: evento.organizadorNombre || "",
      requiereVoluntarios: evento.requiereVoluntarios || false,
      activo: evento.activo ?? true,
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingEvento(null);
    form.reset();
  };

  const filteredEventos = eventos.filter((e) =>
    e.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.lugar?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const eventosProximos = filteredEventos
    .filter(e => e.activo && new Date(e.fecha) >= new Date())
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  const eventosPasados = filteredEventos
    .filter(e => new Date(e.fecha) < new Date())
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">Calendario Parroquial</h1>
        <p className="text-muted-foreground text-lg">
          Eventos y actividades de la comunidad
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar eventos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-base"
            data-testid="input-search-eventos"
          />
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button 
              size="lg" 
              className="h-12 px-6"
              data-testid="button-add-evento"
            >
              <Plus className="w-5 h-5 mr-2" />
              Crear Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {editingEvento ? "Editar Evento" : "Crear Nuevo Evento"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="titulo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Título del Evento *</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-12 text-base" data-testid="input-titulo" />
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
                      <FormLabel className="text-base">Descripción</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} className="h-12 text-base" data-testid="input-descripcion" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Tipo de Evento *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Ej: Misa, Retiro, Kermesse"
                            className="h-12 text-base" 
                            data-testid="input-tipo" 
                          />
                        </FormControl>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="horaInicio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Hora de Inicio</FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
                            {...field} 
                            value={field.value || ""} 
                            className="h-12 text-base" 
                            data-testid="input-hora-inicio" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="horaFin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Hora de Fin</FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
                            {...field} 
                            value={field.value || ""} 
                            className="h-12 text-base" 
                            data-testid="input-hora-fin" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="lugar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Lugar</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} className="h-12 text-base" data-testid="input-lugar" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="organizadorNombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Organizador</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} className="h-12 text-base" data-testid="input-organizador" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="requiereVoluntarios"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-requiere-voluntarios"
                          />
                        </FormControl>
                        <FormLabel className="text-base font-normal cursor-pointer">
                          Requiere voluntarios
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="activo"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-activo"
                          />
                        </FormControl>
                        <FormLabel className="text-base font-normal cursor-pointer">
                          Evento activo
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCloseDialog} 
                    className="flex-1 h-12"
                    data-testid="button-cancel-evento"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 h-12"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-save-evento"
                  >
                    {createMutation.isPending || updateMutation.isPending ? "Guardando..." : "Guardar"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Cargando...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {eventosProximos.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Próximos Eventos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {eventosProximos.map((evento) => (
                  <Card key={evento.id} className="hover-elevate" data-testid={`card-evento-${evento.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary capitalize">
                              {evento.tipo}
                            </div>
                          </div>
                          <CardTitle className="text-lg truncate">{evento.titulo}</CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(evento)}
                          data-testid={`button-edit-evento-${evento.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span>
                          {new Date(evento.fecha).toLocaleDateString('es-MX', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long' 
                          })}
                        </span>
                      </div>
                      {evento.horaInicio && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span>
                            {evento.horaInicio}
                            {evento.horaFin && ` - ${evento.horaFin}`}
                          </span>
                        </div>
                      )}
                      {evento.lugar && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">{evento.lugar}</span>
                        </div>
                      )}
                      {evento.descripcion && (
                        <p className="text-sm text-muted-foreground pt-2 line-clamp-2">
                          {evento.descripcion}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {eventosPasados.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Eventos Pasados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {eventosPasados.slice(0, 6).map((evento) => (
                  <Card key={evento.id} className="hover-elevate opacity-75" data-testid={`card-evento-${evento.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground capitalize">
                              {evento.tipo}
                            </div>
                          </div>
                          <CardTitle className="text-lg truncate">{evento.titulo}</CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(evento)}
                          data-testid={`button-edit-evento-past-${evento.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span>
                          {new Date(evento.fecha).toLocaleDateString('es-MX', { 
                            day: 'numeric', 
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {filteredEventos.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-24 h-24 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-medium mb-2">
                  {searchTerm ? "No se encontraron eventos" : "No hay eventos registrados"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm 
                    ? "Intenta con otro término de búsqueda" 
                    : "Comienza planificando el primer evento parroquial"
                  }
                </p>
                {!searchTerm && (
                  <Button onClick={() => setDialogOpen(true)} size="lg" data-testid="button-add-first-evento">
                    <Plus className="w-5 h-5 mr-2" />
                    Crear Primer Evento
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
