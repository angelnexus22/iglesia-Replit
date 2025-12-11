import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2, Save, Loader2 } from "lucide-react";
import type { ConfiguracionParroquia } from "@shared/schema";

const configuracionSchema = z.object({
  nombreParroquia: z.string().min(1, "El nombre de la parroquia es requerido"),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  nombreParroco: z.string().optional(),
  diocesis: z.string().optional(),
  vicaria: z.string().optional(),
});

type ConfiguracionFormData = z.infer<typeof configuracionSchema>;

export default function Configuracion() {
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: config, isLoading } = useQuery<ConfiguracionParroquia | null>({
    queryKey: ["/api/configuracion-parroquia"],
  });

  const form = useForm<ConfiguracionFormData>({
    resolver: zodResolver(configuracionSchema),
    defaultValues: {
      nombreParroquia: "",
      direccion: "",
      telefono: "",
      email: "",
      nombreParroco: "",
      diocesis: "",
      vicaria: "",
    },
    values: config ? {
      nombreParroquia: config.nombreParroquia || "",
      direccion: config.direccion || "",
      telefono: config.telefono || "",
      email: config.email || "",
      nombreParroco: config.nombreParroco || "",
      diocesis: config.diocesis || "",
      vicaria: config.vicaria || "",
    } : undefined,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: ConfiguracionFormData) => {
      const response = await apiRequest("POST", "/api/configuracion-parroquia", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/configuracion-parroquia"] });
      toast({
        title: "Configuración guardada",
        description: "Los datos de la parroquia se han actualizado correctamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar la configuración",
        variant: "destructive",
      });
    },
  });

  const isPárroco = user?.rol === "parroco";

  const onSubmit = (data: ConfiguracionFormData) => {
    if (!isPárroco) return;
    saveMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Configuración de la Parroquia</h1>
          <p className="text-muted-foreground">
            Estos datos aparecerán en los certificados y documentos oficiales
          </p>
        </div>
      </div>

      {!isPárroco && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <p className="text-amber-800" data-testid="text-permission-warning">
              Solo el párroco puede modificar la configuración de la parroquia. 
              Usted puede ver la información pero no editarla.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Datos de la Parroquia</CardTitle>
          <CardDescription>
            Información general que identifica a la parroquia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nombreParroquia"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nombre de la Parroquia *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Ej: Parroquia de San Juan Bautista"
                          disabled={!isPárroco}
                          data-testid="input-nombre-parroquia"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nombreParroco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Párroco</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Ej: Pbro. Juan García López"
                          disabled={!isPárroco}
                          data-testid="input-nombre-parroco"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="diocesis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diócesis</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Ej: Diócesis de Guadalajara"
                          disabled={!isPárroco}
                          data-testid="input-diocesis"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vicaria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vicaría</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Ej: Vicaría Norte"
                          disabled={!isPárroco}
                          data-testid="input-vicaria"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="direccion"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Ej: Calle Hidalgo #123, Col. Centro, CP 12345"
                          disabled={!isPárroco}
                          data-testid="input-direccion"
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
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Ej: (33) 1234-5678"
                          disabled={!isPárroco}
                          data-testid="input-telefono"
                        />
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
                      <FormLabel>Correo Electrónico</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email"
                          placeholder="Ej: parroquia@ejemplo.com"
                          disabled={!isPárroco}
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {isPárroco && (
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={saveMutation.isPending}
                    data-testid="button-guardar-configuracion"
                  >
                    {saveMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Guardar Configuración
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
