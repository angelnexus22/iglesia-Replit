import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Search, Edit, CheckCircle, XCircle } from "lucide-react";
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
import { insertFeligresSchema, type Feligres, type InsertFeligres } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Feligreses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFeligres, setEditingFeligres] = useState<Feligres | null>(null);
  const { toast } = useToast();

  const { data: feligreses = [], isLoading } = useQuery<Feligres[]>({ 
    queryKey: ["/api/feligreses"] 
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertFeligres) => {
      return await apiRequest("POST", "/api/feligreses", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feligreses"] });
      setDialogOpen(false);
      form.reset();
      toast({
        title: "Feligrés registrado",
        description: "El feligrés ha sido registrado exitosamente",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: InsertFeligres }) => {
      return await apiRequest("PATCH", `/api/feligreses/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feligreses"] });
      setDialogOpen(false);
      setEditingFeligres(null);
      form.reset();
      toast({
        title: "Feligrés actualizado",
        description: "Los datos han sido actualizados exitosamente",
      });
    },
  });

  const form = useForm<InsertFeligres>({
    resolver: zodResolver(insertFeligresSchema),
    defaultValues: {
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      fechaNacimiento: undefined,
      telefono: "",
      email: "",
      direccion: "",
      barrio: "",
      bautizado: false,
      confirmado: false,
      casado: false,
      nombrePadre: "",
      nombreMadre: "",
      nombrePareja: "",
      notas: "",
      activo: true,
    },
  });

  const onSubmit = (data: InsertFeligres) => {
    if (editingFeligres) {
      updateMutation.mutate({ id: editingFeligres.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (feligres: Feligres) => {
    setEditingFeligres(feligres);
    form.reset({
      nombre: feligres.nombre,
      apellidoPaterno: feligres.apellidoPaterno,
      apellidoMaterno: feligres.apellidoMaterno || "",
      fechaNacimiento: feligres.fechaNacimiento || undefined,
      telefono: feligres.telefono || "",
      email: feligres.email || "",
      direccion: feligres.direccion || "",
      barrio: feligres.barrio || "",
      bautizado: feligres.bautizado || false,
      confirmado: feligres.confirmado || false,
      casado: feligres.casado || false,
      nombrePadre: feligres.nombrePadre || "",
      nombreMadre: feligres.nombreMadre || "",
      nombrePareja: feligres.nombrePareja || "",
      notas: feligres.notas || "",
      activo: feligres.activo ?? true,
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingFeligres(null);
    form.reset();
  };

  const filteredFeligreses = feligreses.filter((f) =>
    `${f.nombre} ${f.apellidoPaterno} ${f.apellidoMaterno}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    f.barrio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">Directorio de Feligreses</h1>
        <p className="text-muted-foreground text-lg">
          Gestión de miembros de la comunidad parroquial
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o barrio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-base"
            data-testid="input-search-feligreses"
          />
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button 
              size="lg" 
              className="h-12 px-6"
              data-testid="button-add-feligres"
            >
              <Plus className="w-5 h-5 mr-2" />
              Registrar Feligrés
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {editingFeligres ? "Editar Feligrés" : "Registrar Nuevo Feligrés"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Nombre(s) *</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-12 text-base" data-testid="input-nombre" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="apellidoPaterno"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Apellido Paterno *</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-12 text-base" data-testid="input-apellido-paterno" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="apellidoMaterno"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Apellido Materno</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} className="h-12 text-base" data-testid="input-apellido-materno" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fechaNacimiento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Fecha de Nacimiento</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            value={field.value || ""} 
                            className="h-12 text-base" 
                            data-testid="input-fecha-nacimiento" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Teléfono</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} className="h-12 text-base" data-testid="input-telefono" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} value={field.value || ""} className="h-12 text-base" data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="direccion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Dirección</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} className="h-12 text-base" data-testid="input-direccion" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="barrio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Barrio/Colonia</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} className="h-12 text-base" data-testid="input-barrio" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Estado Sacramental</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="bautizado"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-bautizado"
                            />
                          </FormControl>
                          <FormLabel className="text-base font-normal cursor-pointer">
                            Bautizado
                          </FormLabel>
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
                    <FormField
                      control={form.control}
                      name="casado"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-casado"
                            />
                          </FormControl>
                          <FormLabel className="text-base font-normal cursor-pointer">
                            Casado por la Iglesia
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nombrePadre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Nombre del Padre</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} className="h-12 text-base" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nombreMadre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Nombre de la Madre</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} className="h-12 text-base" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nombrePareja"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Nombre de la Pareja</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} className="h-12 text-base" />
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
                        <Input {...field} value={field.value || ""} className="h-12 text-base" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCloseDialog} 
                    className="flex-1 h-12"
                    data-testid="button-cancel-feligres"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 h-12"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-save-feligres"
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
      ) : filteredFeligreses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-24 h-24 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-medium mb-2">
              {searchTerm ? "No se encontraron feligreses" : "No hay feligreses registrados"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm 
                ? "Intenta con otro término de búsqueda" 
                : "Comienza registrando el primer feligrés de la comunidad"
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setDialogOpen(true)} size="lg" data-testid="button-add-first-feligres">
                <Plus className="w-5 h-5 mr-2" />
                Registrar Primer Feligrés
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFeligreses.map((feligres) => (
            <Card key={feligres.id} className="hover-elevate" data-testid={`card-feligres-${feligres.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">
                      {feligres.nombre} {feligres.apellidoPaterno} {feligres.apellidoMaterno}
                    </CardTitle>
                    {feligres.barrio && (
                      <p className="text-sm text-muted-foreground mt-1">{feligres.barrio}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(feligres)}
                    data-testid={`button-edit-feligres-${feligres.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {feligres.telefono && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Tel:</span> {feligres.telefono}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 pt-2">
                  {feligres.bautizado && (
                    <div className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                      <CheckCircle className="w-3 h-3" />
                      Bautizado
                    </div>
                  )}
                  {feligres.confirmado && (
                    <div className="flex items-center gap-1 text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded">
                      <CheckCircle className="w-3 h-3" />
                      Confirmado
                    </div>
                  )}
                  {feligres.casado && (
                    <div className="flex items-center gap-1 text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded">
                      <CheckCircle className="w-3 h-3" />
                      Casado
                    </div>
                  )}
                  {!feligres.activo && (
                    <div className="flex items-center gap-1 text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">
                      <XCircle className="w-3 h-3" />
                      Inactivo
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
