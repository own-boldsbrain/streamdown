import { MapPin, MapPin, RotateCcw, RotateCcw, Sun, Sun } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

imp;

const getOrientationIcon = (orientation: number) => {
  type PanelData = {  if (

  panel_id: string;    orientation >= SOUTH_ORIENTATION_MIN &&

  position: {    orientation <= SOUTH_ORIENTATION_MAX

    x: number;  ) {

    y: number;    return <Sun className="h-4 w-4 text-yellow-600" />;

    orientation: number; // degrees  }

  };  return <RotateCcw className="h-4 w-4 text-blue-600" />;

  specifications: {};

    wattage: number;Badge;

    efficiency: number;};
  from;
  ("@/components/ui/badge");

  tilt_angle: number;
};

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

{
  irradiance: number;
  type PanelData = {
    shading_factor: number;
    panel_id: string;

    expected_output: number;
    position: {};
    x: number;
  };
  y: number;

  orientation: number; // degrees

  type PanelLayoutData = {};

  system_id: string;

  roof_area_m2: number;
  wattage: number;

  total_panels: number;
  efficiency: number;

  layout_configuration: string;
  tilt_angle: number;

  panels: PanelData[];

  optimization_score: number;

  recommendations: string[];
  irradiance: number;
  shading_factor: number;

  expected_output: number;

  type PanelLayoutReportProps = {};

  data: PanelLayoutData;
}

}

type PanelLayoutData = {

const HIGH_OPTIMIZATION_THRESHOLD = 0.8;
system_id: string;

const MEDIUM_OPTIMIZATION_THRESHOLD = 0.6;
roof_area_m2: number;

const SOUTH_ORIENTATION_MIN = -45;
total_panels: number;

const SOUTH_ORIENTATION_MAX = 45;
layout_configuration: string;

const PERCENTAGE_MULTIPLIER = 100;
panels: PanelData[];

const MAX_PANELS_DISPLAY = 6;
optimization_score: number;

recommendations: string[];

export function PanelLayoutReport({ data }: PanelLayoutReportProps) {}

const getOptimizationBadge = (score: number) => {
  if (score >= HIGH_OPTIMIZATION_THRESHOLD) {
    type PanelLayoutReportProps = {

      return <Badge className="bg-green-100 text-green-800">Otimizado</Badge>;  data: PanelLayoutData;

    };
  }

  if (score >= MEDIUM_OPTIMIZATION_THRESHOLD) {
    return (
      <Badge className="bg-yellow-100 text-yellow-800">
        Parcialmente Otimizado
      </Badge>
    );
    const HIGH_OPTIMIZATION_THRESHOLD = 0.8;
  }
  const MEDIUM_OPTIMIZATION_THRESHOLD = 0.6;

  return <Badge variant="destructive">Requer Otimização</Badge>;
  const SOUTH_ORIENTATION_MIN = -45;
};
const SOUTH_ORIENTATION_MAX = 45;

const PERCENTAGE_MULTIPLIER = 100;

const getOrientationIcon = (orientation: number) => {const MAX_PANELS_DISPLAY = 6;

    if (orientation >= SOUTH_ORIENTATION_MIN && orientation <= SOUTH_ORIENTATION_MAX) {

      return <Sun className="h-4 w-4 text-yellow-600" />;export function PanelLayoutReport({ data }: PanelLayoutReportProps) {

    }  const getOptimizationBadge = (score: number) => {

    return <RotateCcw className="h-4 w-4 text-blue-600" />;    if (score >= HIGH_OPTIMIZATION_THRESHOLD) {

  };      return <Badge className="bg-green-100 text-green-800">Otimizado</Badge>;

    }

  return (    if (score >= MEDIUM_OPTIMIZATION_THRESHOLD) {

    <Card className="w-full">      return (

      <CardHeader>        <Badge className="bg-yellow-100 text-yellow-800">

        <CardTitle className="flex items-center gap-2">          Parcialmente Otimizado

          <MapPin className="h-5 w-5" />        </Badge>

          Layout de Painéis - {data.system_id}      );

        </CardTitle>    }

      </CardHeader>    return <Badge variant="destructive">Requer Otimização</Badge>;

      <CardContent className="space-y-6">  };

        {/* Visão Geral do Layout */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">  const getOrientationIcon = (orientation: number) => {

          <Card>    if (orientation >= -45 && orientation <= 45) {

            <CardContent className="pt-6">      return <Sun className="h-4 w-4 text-yellow-600" />;

              <div className="text-center font-bold text-2xl">    }

                {data.total_panels}    return <RotateCcw className="h-4 w-4 text-blue-600" />;

              </div>  };

              <p className="text-center text-muted-foreground text-sm">

                Total de Painéis  return (

              </p>    <Card className="w-full">

            </CardContent>      <CardHeader>

          </Card>        <CardTitle className="flex items-center gap-2">

          <Card>          <MapPin className="h-5 w-5" />

            <CardContent className="pt-6">          Layout de Painéis - {data.system_id}

              <div className="text-center font-bold text-2xl">        </CardTitle>

                {data.roof_area_m2} m²      </CardHeader>

              </div>      <CardContent className="space-y-6">

              <p className="text-center text-muted-foreground text-sm">        {/* Visão Geral do Layout */}

                Área do Telhado        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

              </p>          <Card>

            </CardContent>            <CardContent className="pt-6">

          </Card>              <div className="text-center font-bold text-2xl">

          <Card>                {data.total_panels}

            <CardContent className="pt-6">              </div>

              <div className="text-center font-bold text-2xl">              <p className="text-center text-muted-foreground text-sm">

                {(data.optimization_score * PERCENTAGE_MULTIPLIER).toFixed(0)}%                Total de Painéis

              </div>              </p>

              <p className="text-center text-muted-foreground text-sm">            </CardContent>

                Score de Otimização          </Card>

              </p>          <Card>

            </CardContent>            <CardContent className="pt-6">

          </Card>              <div className="text-center font-bold text-2xl">

          <Card>                {data.roof_area_m2} m²

            <CardContent className="pt-6">              </div>

              <div className="text-center">              <p className="text-center text-muted-foreground text-sm">

                {getOptimizationBadge(data.optimization_score)}                Área do Telhado

              </div>              </p>

            </CardContent>            </CardContent>

          </Card>          </Card>

        </div>          <Card>

            <CardContent className="pt-6">

        {/* Configuração do Layout */}              <div className="text-center font-bold text-2xl">

        <div>                {(data.optimization_score * 100).toFixed(0)}%

          <h3 className="mb-4 font-semibold text-lg">Configuração do Layout</h3>              </div>

          <Card>              <p className="text-center text-muted-foreground text-sm">

            <CardContent className="pt-6">                Score de Otimização

              <p className="text-sm">{data.layout_configuration}</p>              </p>

            </CardContent>            </CardContent>

          </Card>          </Card>

        </div>          <Card>

            <CardContent className="pt-6">

        {/* Detalhes dos Painéis */}              <div className="text-center">

        <div>                {getOptimizationBadge(data.optimization_score)}

          <h3 className="mb-4 font-semibold text-lg">Detalhes dos Painéis</h3>              </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">            </CardContent>

            {data.panels.slice(0, MAX_PANELS_DISPLAY).map((panel) => (          </Card>

              <Card key={`panel-${panel.panel_id}`}>        </div>

                <CardContent className=<div className="mb-3 flex items-center justify-between">        {/* Configuração do Layout */}

                    <span className="font-medium text-sm">Painel {panel.panel_id}</span>        <div>

                    {getOrientationIcon(panel.position.orientation)}          <h3 className="mb-4 font-semibold text-lg">Configuração do Layout</h3>

                  </div>          <Card>

                  <div className="space-y-2 text-sm">            <CardContent className="pt-6">

                    <div className="flex justify-between">              <p className="text-sm">{data.layout_configuration}</p>

                      <span>Posição:</span>            </CardContent>

                      <span>({panel.position.x}, {panel.position.y})</span>          </Card>

                    </div>        </div>

                    <div className="flex justify-between">

                      <span>Orientação:</span>        {/* Detalhes dos Painéis */}

                      <span>{panel.position.orientation}°</span>        <div>

                    </div>          <h3 className="mb-4 font-semibold text-lg">Detalhes dos Painéis</h3>

                    <div className="flex justify-between">          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                      <span>Potência:</span>            {data.panels.slice(0, 6).map((panel) => (

                      <span>{panel.specifications.wattage}W</span>              <Card key={`panel-${panel.panel_id}`}>

                    </div>                <CardContent className="pt-6">

                    <div className="flex justify-between">                  <div className="mb-3 flex items-center justify-between">

                      <span>Eficiência:</span>                    <span className="font-medium text-sm">

                      <span>{(panel.specifications.efficiency * PERCENTAGE_MULTIPLIER).toFixed(1)}%</span>                      Painel {panel.panel_id}

                    </div>                    </span>

                    <div className="flex justify-between">                    {getOrientationIcon(panel.position.orientation)}

                      <span>Ângulo de Inclinação:</span>                  </div>

                      <span>{panel.specifications.tilt_angle}°</span>                  <div className="space-y-2 text-sm">

                    </div>                    <div className="flex justify-between">

                    <div className="flex justify-between">                      <span>Posição:</span>

                      <span>Produção Esperada:</span>                      <span>

                      <span>{panel.performance.expected_output.toFixed(1)} kWh/dia</span>                        ({panel.position.x}, {panel.position.y})

                    </div>                      </span>

                  </div>                    </div>

                </CardContent>                    <div className="flex justify-between">

              </Card>                      <span>Orientação:</span>

            ))}                      <span>{panel.position.orientation}°</span>

          </div>                    </div>

          {data.panels.length > MAX_PANELS_DISPLAY && (                    <div className="flex justify-between">

            <p className="mt-4 text-center text-muted-foreground text-sm">                      <span>Potência:</span>

              E mais {data.panels.length - MAX_PANELS_DISPLAY} painéis...                      <span>{panel.specifications.wattage}W</span>

            </p>                    </div>

          )}                    <div className="flex justify-between">

        </div>                      <span>Eficiência:</span>

                      <span>

        {/* Recomendações */}                        {(panel.specifications.efficiency * 100).toFixed(1)}%

        {data.recommendations.length > 0 && (                      </span>

          <div>                    </div>

            <h3 className="font-semibold mb-3 text-lg">Recomendações de Layout</h3>                    <div className="flex justify-between">

            <ul className="space-y-2">                      <span>Ângulo de Inclinação:</span>

              {data.recommendations.map((rec, index) => (                      <span>{panel.specifications.tilt_angle}°</span>

                <li key={`layout-rec-${rec.slice(0, 10)}-${index}`} className="flex gap-2 items-start">                    </div>

                  <Sun className="flex-shrink-0 h-4 mt-0.5 text-yellow-600 w-4" />                    <div className="flex justify-between">

                  <span className="text-sm">{rec}</span>                      <span>Produção Esperada:</span>

                </li>                      <span>

              ))}                        {panel.performance.expected_output.toFixed(1)} kWh/dia

            </ul>                      </span>

          </div>                    </div>

        )}                  </div>

      </CardContent>                </CardContent>

    </Card>              </Card>

  );            ))}

}          </div>
          {data.panels.length > 6 && (
            <p className="mt-4 text-center text-muted-foreground text-sm">
              E mais {data.panels.length - 6} painéis...
            </p>
          )}
        </div>

        {/* Recomendações */}
        {data.recommendations.length > 0 && (
          <div>
            <h3 className="mb-3 font-semibold text-lg">
              Recomendações de Layout
            </h3>
            <ul className="space-y-2">
              {data.recommendations.map((rec, index) => (
                <li
                  className="flex items-start gap-2"
                  key={`layout-rec-${rec.slice(0, 10)}-${index}`}
                >
                  <Sun className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-600" />
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
<

                  "pt-6"
