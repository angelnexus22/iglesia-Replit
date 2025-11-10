import { Link } from "wouter";
import { Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="text-center max-w-md">
        <AlertCircle className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
        <h1 className="text-4xl font-semibold mb-4">Página no encontrada</h1>
        <p className="text-lg text-muted-foreground mb-8">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link href="/">
          <Button size="lg" className="h-12 px-6" data-testid="button-back-home">
            <Home className="w-5 h-5 mr-2" />
            Volver al Inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}
