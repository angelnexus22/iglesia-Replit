import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Search, UsersRound, Edit, Users } from "lucide-react";
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
import { insertGrupoSchema, type Grupo, type InsertGrupo } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Grupos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGrupo, setEditingGrupo] = useState<Grupo | null>(null);
  const { toast } = useToast();

  const { data: grupos = [], isLoading } = useQuery<Grupo[]>({ 
    queryKey: ["/api/grupos"] 
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertGrupo) => {
      return await apiRequest("POST", "/api/grupos", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/grupos"] });
      setDialogOpen(false);
      form.reset();
      toast({
        title: "Grupo creado",
        description: "El grupo pastoral ha sido creado exitosamente",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: InsertGrupo }) => {
      return await apiRequest("PATCH", `/api/grupos/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/grupos"] });
      setDialogOpen(false);
      setEditingGrupo(null);
      form.reset();
      toast({
        title: "Grupo actualizado",
        description: "Los datos han sido actualizados exitosamente",
      });
    },
  });

  const form = useForm<InsertGrupo>({
    resolver: zodResolver(insertGrupoSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      coordinadorId: "",
      coordinadorNombre: "",
      tipo: "",
      activo: true,
    },
  });

  const onSubmit = (data: InsertGrupo) => {
    if (editingGrupo) {
      updateMutation.mutate({ id: editingGrupo.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (grupo: Grupo) => {
    setEditingGrupo(grupo);
    form.reset({
      nombre: grupo.nombre,
      descripcion: grupo.descripcion || "",
      coordinadorId: grupo.coordinadorId || "",
      coordinadorNombre: grupo.coordinadorNombre || "",
      tipo: grupo.tipo || "",
      activo: grupo.activo ?? true,
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingGrupo(null);
    form.reset();
  };

  const filteredGrupos = grupos.filter((g) =>
    g.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.coordinadorNombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">Grupos Pastorales</h1>
        <p className="text-muted-foreground text-lg">
          Gestión de ministerios y grupos de la comunidad
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, tipo o coordinador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-base"
            data-testid="input-search-grupos"
          />
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button 
              size="lg" 
              className="h-12 px-6"
              data-testid="button-add-grupo"
            >
              <Plus className="w-5 h-5 mr-2" />
              Crear Grupo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {editingGrupo ? "Editar Grupo" : "Crear Nuevo Grupo Pastoral"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Nombre del Grupo *</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-12 text-base" data-testid="input-nombre" />
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

                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Tipo de Grupo</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          value={field.value || ""} 
                          placeholder="Ej: Jóvenes, Coro, Catequesis, Liturgia"
                          className="h-12 text-base" 
                          data-testid="input-tipo" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="coordinadorNombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Nombre del Coordinador</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} className="h-12 text-base" data-testid="input-coordinador" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                        Grupo activo
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
                    data-testid="button-cancel-grupo"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 h-12"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-save-grupo"
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
      ) : filteredGrupos.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <UsersRound className="w-24 h-24 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-medium mb-2">
              {searchTerm ? "No se encontraron grupos" : "No hay grupos registrados"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm 
                ? "Intenta con otro término de búsqueda" 
                : "Comienza creando el primer grupo pastoral"
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setDialogOpen(true)} size="lg" data-testid="button-add-first-grupo">
                <Plus className="w-5 h-5 mr-2" />
                Crear Primer Grupo
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGrupos.map((grupo) => (
            <Card key={grupo.id} className="hover-elevate" data-testid={`card-grupo-${grupo.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{grupo.nombre}</CardTitle>
                    {grupo.tipo && (
                      <p className="text-sm text-muted-foreground mt-1 capitalize">{grupo.tipo}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(grupo)}
                    data-testid={`button-edit-grupo-${grupo.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {grupo.descripcion && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {grupo.descripcion}
                  </p>
                )}
                {grupo.coordinadorNombre && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{grupo.coordinadorNombre}</span>
                  </div>
                )}
                {!grupo.activo && (
                  <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded inline-block">
                    Inactivo
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
