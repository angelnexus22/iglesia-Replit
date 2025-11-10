import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { LogIn } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
  password: z.string().min(4, "La contraseña debe tener al menos 4 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/auth/me"], user);
      toast({
        title: "Bienvenido",
        description: `Sesión iniciada como ${user.nombre}`,
      });
      setLocation("/feligreses");
    },
    onError: (error: any) => {
      toast({
        title: "Error al iniciar sesión",
        description: error.message || "Verifique sus credenciales",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: LoginForm) {
    loginMutation.mutate(data);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Sistema Parroquial</CardTitle>
          <CardDescription>
            Ingrese sus credenciales para acceder
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuario</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="nombre.usuario"
                        autoComplete="username"
                        data-testid="input-username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        data-testid="input-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
                data-testid="button-login"
              >
                {loginMutation.isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>¿No tiene una cuenta? Contacte al párroco para obtener acceso.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
