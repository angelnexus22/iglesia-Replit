import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Search, Heart, Edit } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertVoluntarioSchema, type Voluntario, type InsertVoluntario, type Evento, type Feligres } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Voluntarios() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVoluntario, setEditingVoluntario] = useState<Voluntario | null>(null);
  const { toast } = useToast();

  const { data: voluntarios = [], isLoading } = useQuery<Voluntario[]>({ 
    queryKey: ["/api/voluntarios"] 
  });

  const { data: eventos = [] } = useQuery<Evento[]>({ 
    queryKey: ["/api/eventos"] 
  });

  const { data: feligreses = [] } = useQuery<Feligres[]>({ 
    queryKey: ["/api/feligreses"] 
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertVoluntario) => {
      return await apiRequest("POST", "/api/voluntarios", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/voluntarios"] });
      setDialogOpen(false);
      form.reset();
      toast({
        title: "Voluntario inscrito",
        description: "El voluntario ha sido inscrito exitosamente",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: InsertVoluntario }) => {
      return await apiRequest("PATCH", `/api/voluntarios/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/voluntarios"] });
      setDialogOpen(false);
      setEditingVoluntario(null);
      form.reset();
      toast({
        title: "Voluntario actualizado",
        description: "Los datos han sido actualizados exitosamente",
      });
    },
  });

  const form = useForm<InsertVoluntario>({
    resolver: zodResolver(insertVoluntarioSchema),
    defaultValues: {
      eventoId: "",
      feligresId: "",
      nombreFeligres: "",
      area: "",
      confirmado: true,
    },
  });

  const selectedFeligresId = form.watch("feligresId");

  const onFeligresChange = (feligresId: string) => {
    const feligres = feligreses.find(f => f.id === feligresId);
    if (feligres) {
      form.setValue("nombreFeligres", `${feligres.nombre} ${feligres.apellidoPaterno} ${feligres.apellidoMaterno || ""}`);
    }
  };

  const onSubmit = (data: InsertVoluntario) => {
    if (editingVoluntario) {
      updateMutation.mutate({ id: editingVoluntario.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (voluntario: Voluntario) => {
    setEditingVoluntario(voluntario);
    form.reset({
      eventoId: voluntario.eventoId,
      feligresId: voluntario.feligresId,
      nombreFeligres: voluntario.nombreFeligres,
      area: voluntario.area || "",
      confirmado: voluntario.confirmado ?? true,
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingVoluntario(null);
    form.reset();
  };

  const filteredVoluntarios = voluntarios.filter((v) =>
    v.nombreFeligres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.area?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const voluntariosPorEvento = filteredVoluntarios.reduce((acc, vol) => {
    const evento = eventos.find(e => e.id === vol.eventoId);
    if (evento) {
      if (!acc[evento.id]) {
        acc[evento.id] = { evento, voluntarios: [] };
      }
      acc[evento.id].voluntarios.push(vol);
    }
    return acc;
  }, {} as Record<string, { evento: Evento, voluntarios: Voluntario[] }>);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">Gestión de Voluntarios</h1>
        <p className="text-muted-foreground text-lg">
          Inscripción y coordinación de voluntarios en eventos
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar voluntarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-base"
            data-testid="input-search-voluntarios"
          />
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button 
              size="lg" 
              className="h-12 px-6"
              data-testid="button-add-voluntario"
            >
              <Plus className="w-5 h-5 mr-2" />
              Inscribir Voluntario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {editingVoluntario ? "Editar Voluntario" : "Inscribir Nuevo Voluntario"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="eventoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Evento *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 text-base" data-testid="select-evento">
                            <SelectValue placeholder="Seleccione evento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {eventos.filter(e => e.activo && e.requiereVoluntarios).map((evento) => (
                            <SelectItem key={evento.id} value={evento.id}>
                              {evento.titulo} - {new Date(evento.fecha).toLocaleDateString('es-MX')}
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
                  name="feligresId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Feligrés *</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          onFeligresChange(value);
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 text-base" data-testid="select-feligres">
                            <SelectValue placeholder="Seleccione feligrés" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {feligreses.filter(f => f.activo).map((feligres) => (
                            <SelectItem key={feligres.id} value={feligres.id}>
                              {feligres.nombre} {feligres.apellidoPaterno} {feligres.apellidoMaterno}
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
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Área de Servicio</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          value={field.value || ""} 
                          placeholder="Ej: Decoración, Cocina, Ujieres, Liturgia"
                          className="h-12 text-base" 
                          data-testid="input-area" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmado"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-confirmado"
                        />
                      </FormControl>
                      <FormLabel className="text-base font-normal cursor-pointer">
                        Confirmado
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCloseDialog} 
                    className="flex-1 h-12"
                    data-testid="button-cancel-voluntario"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 h-12"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-save-voluntario"
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
      ) : Object.keys(voluntariosPorEvento).length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Heart className="w-24 h-24 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-medium mb-2">
              {searchTerm ? "No se encontraron voluntarios" : "No hay voluntarios registrados"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm 
                ? "Intenta con otro término de búsqueda" 
                : "Comienza inscribiendo voluntarios para tus eventos"
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setDialogOpen(true)} size="lg" data-testid="button-add-first-voluntario">
                <Plus className="w-5 h-5 mr-2" />
                Inscribir Primer Voluntario
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.values(voluntariosPorEvento).map(({ evento, voluntarios: vols }) => (
            <Card key={evento.id}>
              <CardHeader>
                <CardTitle className="text-xl">
                  {evento.titulo}
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({vols.length} {vols.length === 1 ? 'voluntario' : 'voluntarios'})
                  </span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {new Date(evento.fecha).toLocaleDateString('es-MX', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {vols.map((voluntario) => (
                    <div
                      key={voluntario.id}
                      className="flex items-start gap-3 p-3 rounded-lg border hover-elevate"
                      data-testid={`card-voluntario-${voluntario.id}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{voluntario.nombreFeligres}</p>
                        {voluntario.area && (
                          <p className="text-sm text-muted-foreground truncate">{voluntario.area}</p>
                        )}
                        {!voluntario.confirmado && (
                          <p className="text-xs text-orange-600 mt-1">Pendiente confirmar</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(voluntario)}
                        className="flex-shrink-0"
                        data-testid={`button-edit-voluntario-${voluntario.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
