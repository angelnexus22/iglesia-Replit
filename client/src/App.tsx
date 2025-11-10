import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import Dashboard from "@/pages/dashboard";
import Feligreses from "@/pages/feligreses";
import Sacramentos from "@/pages/sacramentos";
import Grupos from "@/pages/grupos";
import Eventos from "@/pages/eventos";
import Voluntarios from "@/pages/voluntarios";
import Respaldo from "@/pages/respaldo";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/feligreses" component={Feligreses} />
      <Route path="/sacramentos" component={Sacramentos} />
      <Route path="/grupos" component={Grupos} />
      <Route path="/eventos" component={Eventos} />
      <Route path="/voluntarios" component={Voluntarios} />
      <Route path="/respaldo" component={Respaldo} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="flex items-center justify-between px-4 py-3 border-b bg-background">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <h2 className="text-sm font-medium text-muted-foreground">
                  Gestión Parroquial Offline
                </h2>
              </header>
              <main className="flex-1 overflow-y-auto bg-background">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
