import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Search, BookOpen, Edit } from "lucide-react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSacramentoSchema, type Sacramento, type InsertSacramento, type Feligres } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const tiposSacramento = [
  { value: "bautismo", label: "Bautismo" },
  { value: "comunion", label: "Primera Comunión" },
  { value: "confirmacion", label: "Confirmación" },
  { value: "matrimonio", label: "Matrimonio" },
];

export default function Sacramentos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSacramento, setEditingSacramento] = useState<Sacramento | null>(null);
  const { toast } = useToast();

  const { data: sacramentos = [], isLoading } = useQuery<Sacramento[]>({ 
    queryKey: ["/api/sacramentos"] 
  });

  const { data: feligreses = [] } = useQuery<Feligres[]>({ 
    queryKey: ["/api/feligreses"] 
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertSacramento) => {
      return await apiRequest("POST", "/api/sacramentos", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sacramentos"] });
      setDialogOpen(false);
      form.reset();
      toast({
        title: "Sacramento registrado",
        description: "El sacramento ha sido registrado exitosamente",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: InsertSacramento }) => {
      return await apiRequest("PATCH", `/api/sacramentos/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sacramentos"] });
      setDialogOpen(false);
      setEditingSacramento(null);
      form.reset();
      toast({
        title: "Sacramento actualizado",
        description: "Los datos han sido actualizados exitosamente",
      });
    },
  });

  const form = useForm<InsertSacramento>({
    resolver: zodResolver(insertSacramentoSchema),
    defaultValues: {
      tipo: "bautismo",
      feligresId: "",
      nombreFeligres: "",
      fecha: new Date().toISOString().split('T')[0],
      lugarCelebracion: "Parroquia",
      ministro: "",
      nombrePadrino: "",
      nombreMadrina: "",
      nombreConyuge: "",
      testigo1: "",
      testigo2: "",
      libroNumero: "",
      folioNumero: "",
      partida: "",
      notas: "",
    },
  });

  const selectedTipo = form.watch("tipo");
  const selectedFeligresId = form.watch("feligresId");

  const onFeligresChange = (feligresId: string) => {
    const feligres = feligreses.find(f => f.id === feligresId);
    if (feligres) {
      form.setValue("nombreFeligres", `${feligres.nombre} ${feligres.apellidoPaterno} ${feligres.apellidoMaterno || ""}`);
    }
  };

  const onSubmit = (data: InsertSacramento) => {
    if (editingSacramento) {
      updateMutation.mutate({ id: editingSacramento.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (sacramento: Sacramento) => {
    setEditingSacramento(sacramento);
    form.reset({
      tipo: sacramento.tipo,
      feligresId: sacramento.feligresId,
      nombreFeligres: sacramento.nombreFeligres,
      fecha: sacramento.fecha,
      lugarCelebracion: sacramento.lugarCelebracion,
      ministro: sacramento.ministro,
      nombrePadrino: sacramento.nombrePadrino || "",
      nombreMadrina: sacramento.nombreMadrina || "",
      nombreConyuge: sacramento.nombreConyuge || "",
      testigo1: sacramento.testigo1 || "",
      testigo2: sacramento.testigo2 || "",
      libroNumero: sacramento.libroNumero || "",
      folioNumero: sacramento.folioNumero || "",
      partida: sacramento.partida || "",
      notas: sacramento.notas || "",
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSacramento(null);
    form.reset();
  };

  const filteredSacramentos = sacramentos.filter((s) =>
    s.nombreFeligres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">Registro de Sacramentos</h1>
        <p className="text-muted-foreground text-lg">
          Historial sacramental de la parroquia
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o tipo de sacramento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-base"
            data-testid="input-search-sacramentos"
          />
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button 
              size="lg" 
              className="h-12 px-6"
              data-testid="button-add-sacramento"
            >
              <Plus className="w-5 h-5 mr-2" />
              Registrar Sacramento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {editingSacramento ? "Editar Sacramento" : "Registrar Nuevo Sacramento"}
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
                        <FormLabel className="text-base">Tipo de Sacramento *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 text-base" data-testid="select-tipo">
                              <SelectValue placeholder="Seleccione tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tiposSacramento.map((tipo) => (
                              <SelectItem key={tipo.value} value={tipo.value}>
                                {tipo.label}
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fecha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Fecha de Celebración *</FormLabel>
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
                    name="lugarCelebracion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Lugar de Celebración *</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-12 text-base" data-testid="input-lugar" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="ministro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Ministro Celebrante *</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-12 text-base" data-testid="input-ministro" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedTipo !== "matrimonio" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nombrePadrino"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Nombre del Padrino</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} className="h-12 text-base" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nombreMadrina"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Nombre de la Madrina</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} className="h-12 text-base" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {selectedTipo === "matrimonio" && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="nombreConyuge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Nombre del Cónyuge</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} className="h-12 text-base" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="testigo1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Testigo 1</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value || ""} className="h-12 text-base" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="testigo2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Testigo 2</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value || ""} className="h-12 text-base" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Registro Oficial</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="libroNumero"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Libro No.</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} className="h-12 text-base" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="folioNumero"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Folio No.</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} className="h-12 text-base" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="partida"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Partida No.</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} className="h-12 text-base" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
                    data-testid="button-cancel-sacramento"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 h-12"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-save-sacramento"
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
      ) : filteredSacramentos.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="w-24 h-24 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-medium mb-2">
              {searchTerm ? "No se encontraron sacramentos" : "No hay sacramentos registrados"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm 
                ? "Intenta con otro término de búsqueda" 
                : "Comienza registrando el primer sacramento"
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setDialogOpen(true)} size="lg" data-testid="button-add-first-sacramento">
                <Plus className="w-5 h-5 mr-2" />
                Registrar Primer Sacramento
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSacramentos.map((sacramento) => (
            <Card key={sacramento.id} className="hover-elevate" data-testid={`card-sacramento-${sacramento.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary capitalize">
                        {sacramento.tipo}
                      </div>
                    </div>
                    <CardTitle className="text-lg truncate">
                      {sacramento.nombreFeligres}
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(sacramento)}
                    data-testid={`button-edit-sacramento-${sacramento.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">Fecha:</span>{" "}
                  {new Date(sacramento.fecha).toLocaleDateString('es-MX', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Ministro:</span> {sacramento.ministro}
                </p>
                {sacramento.nombrePadrino && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Padrino:</span> {sacramento.nombrePadrino}
                  </p>
                )}
                {sacramento.libroNumero && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Libro:</span> {sacramento.libroNumero}
                    {sacramento.folioNumero && `, Folio: ${sacramento.folioNumero}`}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
