import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, RotateCcw, Sun } from "lucide-react";

type PanelData = {
  panel_id: string;
  position: {
    x: number;
    y: number;
    orientation: number; // degrees
  };
  specifications: {
    wattage: number;
    efficiency: number;
    tilt_angle: number;
  };
  performance: {
    irradiance: number;
    shading_factor: number;
    expected_output: number;
  };
};

type PanelLayoutData = {
  system_id: string;
  roof_area_m2: number;
  total_panels: number;
  layout_configuration: string;
  panels: PanelData[];
  optimization_score: number;
  recommendations: string[];
};

type PanelLayoutReportProps = {
  data: PanelLayoutData;
};

const HIGH_OPTIMIZATION_THRESHOLD = 0.8;
const MEDIUM_OPTIMIZATION_THRESHOLD = 0.6;
const SOUTH_ORIENTATION_MIN = -45;
const SOUTH_ORIENTATION_MAX = 45;
const PERCENTAGE_MULTIPLIER = 100;
const MAX_PANELS_DISPLAY = 6;

export function PanelLayoutReport({ data }: PanelLayoutReportProps) {
  const getOptimizationBadge = (score: number) => {
    if (score >= HIGH_OPTIMIZATION_THRESHOLD) {
      return <Badge className="bg-green-100 text-green-800">Otimizado</Badge>;
    }
    if (score >= MEDIUM_OPTIMIZATION_THRESHOLD) {
      return <Badge className="bg-yellow-100 text-yellow-800">Parcialmente Otimizado</Badge>;
    }
    return <Badge variant="destructive">Requer Otimização</Badge>;
  };

  const getOrientationIcon = (orientation: number) => {
    if (orientation >= -45 && orientation <= 45) {
      return <Sun className="h-4 text-yellow-600 w-4" />;
    }
    return <RotateCcw className="h-4 text-blue-600 w-4" />;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Layout de Painéis - {data.system_id}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visão Geral do Layout */}
        <div className="gap-4 grid-cols-1 grid md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="font-bold text-2xl text-center">
                {data.total_panels}
              </div>
              <p className="text-center text-muted-foreground text-sm">
                Total de Painéis
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="font-bold text-2xl text-center">
                {data.roof_area_m2} m²
              </div>
              <p className="text-center text-muted-foreground text-sm">
                Área do Telhado
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="font-bold text-2xl text-center">
                {(data.optimization_score * 100).toFixed(0)}%
              </div>
              <p className="text-center text-muted-foreground text-sm">
                Score de Otimização
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                {getOptimizationBadge(data.optimization_score)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuração do Layout */}
        <div>
          <h3 className="font-semibold mb-4 text-lg">Configuração do Layout</h3>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm">{data.layout_configuration}</p>
            </CardContent>
          </Card>
        </div>

        {/* Detalhes dos Painéis */}
        <div>
          <h3 className="font-semibold mb-4 text-lg">Detalhes dos Painéis</h3>
          <div className="gap-4 grid-cols-1 grid md:grid-cols-2">
            {data.panels.slice(0, 6).map((panel) => (
              <Card key={`panel-${panel.panel_id}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-sm">Painel {panel.panel_id}</span>
                    {getOrientationIcon(panel.position.orientation)}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Posição:</span>
                      <span>({panel.position.x}, {panel.position.y})</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Orientação:</span>
                      <span>{panel.position.orientation}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Potência:</span>
                      <span>{panel.specifications.wattage}W</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Eficiência:</span>
                      <span>{(panel.specifications.efficiency * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ângulo de Inclinação:</span>
                      <span>{panel.specifications.tilt_angle}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Produção Esperada:</span>
                      <span>{panel.performance.expected_output.toFixed(1)} kWh/dia</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {data.panels.length > 6 && (
            <p className="mt-4 text-center text-muted-foreground text-sm">
              E mais {data.panels.length - 6} painéis...
            </p>
          )}
        </div>

        {/* Recomendações */}
        {data.recommendations.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 text-lg">Recomendações de Layout</h3>
            <ul className="space-y-2">
              {data.recommendations.map((rec, index) => (
                <li key={`layout-rec-${rec.slice(0, 10)}-${index}`} className="flex gap-2 items-start">
                  <Sun className="flex-shrink-0 h-4 mt-0.5 text-yellow-600 w-4" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}