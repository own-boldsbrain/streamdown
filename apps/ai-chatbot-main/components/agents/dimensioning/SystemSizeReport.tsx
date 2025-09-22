import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

type SystemSizeData = {
  system_id: string;
  recommended_size_kw: number;
  min_size_kw: number;
  max_size_kw: number;
  confidence_level: number;
  sizing_factors: {
    consumption_profile: number;
    roof_area_available: number;
    budget_constraint: number;
    regulatory_limits: number;
  };
  recommendations: string[];
  warnings: string[];
};

type SystemSizeReportProps = {
  data: SystemSizeData;
};

const HIGH_CONFIDENCE_THRESHOLD = 0.8;
const MEDIUM_CONFIDENCE_THRESHOLD = 0.6;
const PERCENTAGE_MULTIPLIER = 100;

export function SystemSizeReport({ data }: SystemSizeReportProps) {
  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= HIGH_CONFIDENCE_THRESHOLD) {
      return <Badge className="bg-green-100 text-green-800">Alta Confiança</Badge>;
    }
    if (confidence >= MEDIUM_CONFIDENCE_THRESHOLD) {
      return <Badge className="bg-yellow-100 text-yellow-800">Média Confiança</Badge>;
    }
    return <Badge variant="destructive">Baixa Confiança</Badge>;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Dimensionamento do Sistema - {data.system_id}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tamanho Recomendado */}
        <div className="gap-4 grid-cols-1 grid md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="font-bold text-2xl text-center">
                {data.recommended_size_kw} kWp
              </div>
              <p className="text-center text-muted-foreground text-sm">
                Tamanho Recomendado
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="font-semibold text-center text-lg">
                {data.min_size_kw} - {data.max_size_kw} kWp
              </div>
              <p className="text-center text-muted-foreground text-sm">
                Faixa Viável
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                {getConfidenceBadge(data.confidence_level)}
                <p className="mt-2 text-muted-foreground text-sm">
                  Confiança: {(data.confidence_level * PERCENTAGE_MULTIPLIER).toFixed(0)}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fatores de Dimensionamento */}
        <div>
          <h3 className="font-semibold mb-4 text-lg">Fatores de Dimensionamento</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Perfil de Consumo</span>
                <span>{(data.sizing_factors.consumption_profile * PERCENTAGE_MULTIPLIER).toFixed(0)}%</span>
              </div>
              <Progress value={data.sizing_factors.consumption_profile * PERCENTAGE_MULTIPLIER} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Área Disponível no Telhado</span>
                <span>{(data.sizing_factors.roof_area_available * PERCENTAGE_MULTIPLIER).toFixed(0)}%</span>
              </div>
              <Progress value={data.sizing_factors.roof_area_available * PERCENTAGE_MULTIPLIER} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Restrição Orçamentária</span>
                <span>{(data.sizing_factors.budget_constraint * PERCENTAGE_MULTIPLIER).toFixed(0)}%</span>
              </div>
              <Progress value={data.sizing_factors.budget_constraint * PERCENTAGE_MULTIPLIER} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Limites Regulatórios</span>
                <span>{(data.sizing_factors.regulatory_limits * PERCENTAGE_MULTIPLIER).toFixed(0)}%</span>
              </div>
              <Progress value={data.sizing_factors.regulatory_limits * PERCENTAGE_MULTIPLIER} className="h-2" />
            </div>
          </div>
        </div>

        {/* Recomendações */}
        {data.recommendations.length > 0 && (
          <div>
            <h3 className="flex font-semibold gap-2 items-center mb-3 text-lg">
              <CheckCircle className="h-4 text-green-600 w-4" />
              Recomendações
            </h3>
            <ul className="space-y-2">
              {data.recommendations.map((rec, index) => (
                <li key={`rec-${rec.slice(0, 10)}-${index}`} className="flex gap-2 items-start">
                  <CheckCircle className="flex-shrink-0 h-4 mt-0.5 text-green-600 w-4" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Avisos */}
        {data.warnings.length > 0 && (
          <div className="border border-yellow-200 bg-yellow-50 p-4 rounded-lg">
            <div className="flex gap-2 items-start">
              <AlertTriangle className="flex-shrink-0 h-4 text-yellow-600 w-4" />
              <div className="space-y-1">
                {data.warnings.map((warning, index) => (
                  <p key={`warning-${warning.slice(0, 10)}-${index}`} className="text-sm">{warning}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}