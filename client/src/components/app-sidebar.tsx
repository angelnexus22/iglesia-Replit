import { Home, Users, BookOpen, UsersRound, Calendar, Heart, Database, DollarSign, Package, BarChart3 } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Inicio",
    url: "/",
    icon: Home,
  },
  {
    title: "Feligreses",
    url: "/feligreses",
    icon: Users,
  },
  {
    title: "Sacramentos",
    url: "/sacramentos",
    icon: BookOpen,
  },
  {
    title: "Grupos",
    url: "/grupos",
    icon: UsersRound,
  },
  {
    title: "Eventos",
    url: "/eventos",
    icon: Calendar,
  },
  {
    title: "Voluntarios",
    url: "/voluntarios",
    icon: Heart,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-base truncate">Sistema Parroquial</h2>
            <p className="text-xs text-muted-foreground truncate">Gestión Pastoral</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase()}`}>
                      <item.icon className="w-5 h-5" />
                      <span className="text-base">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Administración</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location === "/contabilidad"}>
                  <Link href="/contabilidad" data-testid="link-contabilidad">
                    <DollarSign className="w-5 h-5" />
                    <span className="text-base">Contabilidad</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location === "/dashboard-financiero"}>
                  <Link href="/dashboard-financiero" data-testid="link-dashboard-financiero">
                    <BarChart3 className="w-5 h-5" />
                    <span className="text-base">Dashboard Financiero</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location === "/inventario"}>
                  <Link href="/inventario" data-testid="link-inventario">
                    <Package className="w-5 h-5" />
                    <span className="text-base">Inventario</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location === "/respaldo"}>
                  <Link href="/respaldo" data-testid="link-respaldo">
                    <Database className="w-5 h-5" />
                    <span className="text-base">Respaldo de Datos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
          <span className="text-sm text-muted-foreground">Sin conexión</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">v1.0.0</p>
      </SidebarFooter>
    </Sidebar>
  );
}
