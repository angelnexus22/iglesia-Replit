import { useState } from "react";
import { Download, Upload, Database, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Respaldo() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/export');
      const data = await response.json();
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `respaldo-parroquial-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Respaldo creado",
        description: "Los datos han sido exportados exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error al exportar",
        description: "No se pudieron exportar los datos",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      const response = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Import failed');
      
      toast({
        title: "Datos importados",
        description: "Los datos han sido importados exitosamente",
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast({
        title: "Error al importar",
        description: "No se pudieron importar los datos. Verifica que el archivo sea válido.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">Respaldo de Datos</h1>
        <p className="text-muted-foreground text-lg">
          Exporta e importa los datos de la parroquia
        </p>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="w-5 h-5" />
        <AlertTitle className="text-base">Importante</AlertTitle>
        <AlertDescription className="text-base">
          Realiza respaldos periódicos de tus datos. Guarda los archivos en un lugar seguro como una memoria USB.
          Los respaldos incluyen todos los feligreses, sacramentos, grupos, eventos y voluntarios.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Download className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Exportar Datos</CardTitle>
                <CardDescription className="text-base mt-1">
                  Descarga una copia de todos los datos
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Crea un archivo JSON con toda la información de la parroquia. 
              Este archivo puede ser guardado en tu computadora o en una memoria USB.
            </p>
            <Button 
              onClick={handleExport} 
              disabled={isExporting}
              className="w-full h-12"
              data-testid="button-export-data"
            >
              <Download className="w-5 h-5 mr-2" />
              {isExporting ? "Exportando..." : "Exportar Datos"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-orange-100">
                <Upload className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Importar Datos</CardTitle>
                <CardDescription className="text-base mt-1">
                  Restaura datos desde un respaldo
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Selecciona un archivo de respaldo previamente exportado para restaurar los datos.
              <strong className="block mt-2 text-orange-600">
                Advertencia: Esto reemplazará todos los datos actuales.
              </strong>
            </p>
            <label>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting}
                className="hidden"
                data-testid="input-import"
              />
              <Button 
                variant="outline"
                disabled={isImporting}
                className="w-full h-12"
                asChild
              >
                <span>
                  <Upload className="w-5 h-5 mr-2" />
                  {isImporting ? "Importando..." : "Seleccionar Archivo"}
                </span>
              </Button>
            </label>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-muted-foreground" />
            <CardTitle className="text-xl">Consejos de Respaldo</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Realiza respaldos semanales o después de registrar información importante</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Guarda múltiples copias en diferentes lugares (computadora, USB, nube)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Nombra los archivos con la fecha para identificarlos fácilmente</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Prueba restaurar un respaldo ocasionalmente para verificar que funciona</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
