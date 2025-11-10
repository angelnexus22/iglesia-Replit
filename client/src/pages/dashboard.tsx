import { useQuery } from "@tanstack/react-query";
import { Users, BookOpen, UsersRound, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Feligres, Sacramento, Grupo, Evento } from "@shared/schema";

export default function Dashboard() {
  const { data: feligreses = [] } = useQuery<Feligres[]>({ 
    queryKey: ["/api/feligreses"] 
  });
  
  const { data: sacramentos = [] } = useQuery<Sacramento[]>({ 
    queryKey: ["/api/sacramentos"] 
  });
  
  const { data: grupos = [] } = useQuery<Grupo[]>({ 
    queryKey: ["/api/grupos"] 
  });
  
  const { data: eventos = [] } = useQuery<Evento[]>({ 
    queryKey: ["/api/eventos"] 
  });

  const stats = [
    {
      title: "Feligreses Activos",
      value: feligreses.filter(f => f.activo).length,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Sacramentos Registrados",
      value: sacramentos.length,
      icon: BookOpen,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Grupos Pastorales",
      value: grupos.filter(g => g.activo).length,
      icon: UsersRound,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Eventos Próximos",
      value: eventos.filter(e => e.activo && new Date(e.fecha) >= new Date()).length,
      icon: Calendar,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">Panel Principal</h1>
        <p className="text-muted-foreground text-lg">
          Resumen de actividades parroquiales
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold" data-testid={`stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            {sacramentos.length === 0 && feligreses.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">No hay actividad reciente</p>
                <p className="text-sm text-muted-foreground">
                  Los registros nuevos aparecerán aquí
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sacramentos.slice(0, 5).map((sacramento) => (
                  <div key={sacramento.id} className="flex items-start gap-3 p-3 rounded-lg hover-elevate">
                    <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{sacramento.nombreFeligres}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {sacramento.tipo} - {new Date(sacramento.fecha).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Próximos Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            {eventos.filter(e => e.activo && new Date(e.fecha) >= new Date()).length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">No hay eventos próximos</p>
                <p className="text-sm text-muted-foreground">
                  Planifica actividades parroquiales
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {eventos
                  .filter(e => e.activo && new Date(e.fecha) >= new Date())
                  .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
                  .slice(0, 5)
                  .map((evento) => (
                    <div key={evento.id} className="flex items-start gap-3 p-3 rounded-lg hover-elevate">
                      <Calendar className="w-5 h-5 mt-1 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{evento.titulo}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(evento.fecha).toLocaleDateString('es-MX', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
