import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";

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

const getQualityColor = (score: number) => {
  if (score >= 0.9) return "bg-green-500";
  if (score >= 0.7) return "bg-yellow-500";
  return "bg-red-500";
};

export const ConsumptionValidationReport = ({ data }: { data: ConsumptionValidationData }) => {
  const {
    system_id,
    validation_status,
    consumption_history_months,
    average_monthly_consumption,
    seasonal_variation,
    data_quality_score,
    recommendations
  } = data.consumption_validation;

  return (
    <Card className="w-full max-w-2xl border-border/50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold text-foreground">
          Validação de Consumo
        </CardTitle>
        <Badge variant="outline" className="text-sm">
          ID do Sistema: {system_id}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {getStatusIcon(validation_status)}
            <div>
              <p className="font-semibold">Status da Validação</p>
              <p className="text-sm text-muted-foreground">
                Histórico de {consumption_history_months} meses
              </p>
            </div>
          </div>
          {getStatusBadge(validation_status)}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Consumo Médio</span>
            </div>
            <p className="text-2xl font-bold">{average_monthly_consumption.toFixed(1)} kWh</p>
            <p className="text-xs text-muted-foreground">por mês</p>
          </div>

          <div className="p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Variação Sazonal</span>
            </div>
            <p className="text-2xl font-bold">{(seasonal_variation * 100).toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">coeficiente</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Qualidade dos Dados</span>
            <span className="text-sm font-bold">{(data_quality_score * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getQualityColor(data_quality_score)}`}
              style={{ width: `${data_quality_score * 100}%` }}
            />
          </div>
        </div>

        {recommendations.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-3">Recomendações</h4>
            <ul className="space-y-2">
              {recommendations.map((rec, index) => (
                <li key={`rec-${index}`} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
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