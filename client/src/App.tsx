import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import Dashboard from "@/pages/dashboard";
import Feligreses from "@/pages/feligreses";
import Sacramentos from "@/pages/sacramentos";
import Grupos from "@/pages/grupos";
import Eventos from "@/pages/eventos";
import Voluntarios from "@/pages/voluntarios";
import Respaldo from "@/pages/respaldo";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/feligreses">
        {() => <ProtectedRoute component={Feligreses} />}
      </Route>
      <Route path="/sacramentos">
        {() => <ProtectedRoute component={Sacramentos} />}
      </Route>
      <Route path="/grupos">
        {() => <ProtectedRoute component={Grupos} />}
      </Route>
      <Route path="/eventos">
        {() => <ProtectedRoute component={Eventos} />}
      </Route>
      <Route path="/voluntarios">
        {() => <ProtectedRoute component={Voluntarios} />}
      </Route>
      <Route path="/respaldo">
        {() => <ProtectedRoute component={Respaldo} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth(location === "/login");
  const { toast } = useToast();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "Sesión cerrada",
        description: "Ha cerrado sesión exitosamente",
      });
      setLocation("/login");
    },
  });

  if (location === "/login") {
    return <Router />;
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between px-4 py-3 border-b bg-background">
            <div className="flex items-center gap-3">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h2 className="text-sm font-medium text-muted-foreground">
                Gestión Parroquial Offline
              </h2>
            </div>
            {user && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {user.nombre} ({user.rol})
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => logoutMutation.mutate()}
                  data-testid="button-logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </header>
          <main className="flex-1 overflow-y-auto bg-background">
            <Router />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
