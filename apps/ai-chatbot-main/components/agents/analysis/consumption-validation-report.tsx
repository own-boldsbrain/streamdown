import { AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ConsumptionValidationData = {
  consumption_validation: {
    system_id: string;
    validation_status: "valid" | "invalid" | "partial";
    consumption_history_months: number;
    average_monthly_consumption: number;
    seasonal_variation: number;
    data_quality_score: number;
    recommendations: string[];
  };
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "valid":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "partial":
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    default:
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "valid":
      return <Badge className="bg-green-500 text-white">Válido</Badge>;
    case "partial":
      return <Badge className="bg-yellow-500 text-white">Parcial</Badge>;
    default:
      return <Badge className="bg-red-500 text-white">Inválido</Badge>;
  }
};

const HIGH_QUALITY_THRESHOLD = 0.9;
const MEDIUM_QUALITY_THRESHOLD = 0.7;
const PERCENTAGE_MULTIPLIER = 100;

const getQualityColor = (score: number) => {
  if (score >= HIGH_QUALITY_THRESHOLD) {
    return "bg-green-500";
  }
  if (score >= MEDIUM_QUALITY_THRESHOLD) {
    return "bg-yellow-500";
  }
  return "bg-red-500";
};

export const ConsumptionValidationReport = ({
  data,
}: {
  data: ConsumptionValidationData;
}) => {
  const {
    system_id,
    validation_status,
    consumption_history_months,
    average_monthly_consumption,
    seasonal_variation,
    data_quality_score,
    recommendations,
  } = data.consumption_validation;

  return (
    <Card className="w-full max-w-2xl border-border/50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-bold text-foreground text-lg">
          Validação de Consumo
        </CardTitle>
        <Badge className="text-sm" variant="outline">
          ID do Sistema: {system_id}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(validation_status)}
            <div>
              <p className="font-semibold">Status da Validação</p>
              <p className="text-muted-foreground text-sm">
                Histórico de {consumption_history_months} meses
              </p>
            </div>
          </div>
          {getStatusBadge(validation_status)}
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="font-medium text-sm">Consumo Médio</span>
            </div>
            <p className="font-bold text-2xl">
              {average_monthly_consumption.toFixed(1)} kWh
            </p>
            <p className="text-muted-foreground text-xs">por mês</p>
          </div>

          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <span className="font-medium text-sm">Variação Sazonal</span>
            </div>
            <p className="font-bold text-2xl">
              {(seasonal_variation * PERCENTAGE_MULTIPLIER).toFixed(1)}%
            </p>
            <p className="text-muted-foreground text-xs">coeficiente</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium text-sm">Qualidade dos Dados</span>
            <span className="font-bold text-sm">
              {(data_quality_score * PERCENTAGE_MULTIPLIER).toFixed(0)}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className={`h-2 rounded-full ${getQualityColor(data_quality_score)}`}
              style={{
                width: `${data_quality_score * PERCENTAGE_MULTIPLIER}%`,
              }}
            />
          </div>
        </div>

        {recommendations.length > 0 && (
          <div>
            <h4 className="mb-3 font-semibold text-sm">Recomendações</h4>
            <ul className="space-y-2">
              {recommendations.map((rec, index) => (
                <li
                  className="flex items-start gap-2 text-sm"
                  key={`rec-${rec.slice(0, 10)}-${index}`}
                >
                  <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
