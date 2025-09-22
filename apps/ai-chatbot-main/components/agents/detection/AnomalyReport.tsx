import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Zap } from "lucide-react";

type Anomaly = {
  type: string;
  month: string;
  deviation_percent: number;
  severity: "high" | "medium" | "low";
};

type AnomalyReportData = {
  anomaly_report: {
    system_id: string;
    anomalies_detected: Anomaly[];
    total_anomalies: number;
    risk_assessment: string;
  };
};

const severityConfig = {
  high: {
    color: "bg-red-500 border-red-500",
    text: "Alta",
    icon: <AlertTriangle className="mr-1 h-3 w-3" />,
  },
  medium: {
    color: "bg-yellow-500 border-yellow-500",
    text: "Média",
    icon: <AlertTriangle className="mr-1 h-3 w-3" />,
  },
  low: {
    color: "bg-green-500 border-green-500",
    text: "Baixa",
    icon: <Zap className="mr-1 h-3 w-3" />,
  },
};

export const AnomalyReport = ({ data }: { data: AnomalyReportData }) => {
  const { system_id, anomalies_detected, total_anomalies, risk_assessment } =
    data.anomaly_report;

  return (
    <Card className="w-full max-w-2xl border-border/50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold text-foreground">
          Relatório de Anomalias de Consumo
        </CardTitle>
        <Badge variant="outline" className="text-sm">
          ID do Sistema: {system_id}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Total de anomalias detectadas:{" "}
            <span className="font-bold text-foreground">{total_anomalies}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Avaliação de Risco:{" "}
            <span className="font-bold capitalize text-foreground">
              {risk_assessment}
            </span>
          </p>
        </div>
        <div className="space-y-4">
          {anomalies_detected.map((anomaly, index) => (
            <div
              key={index}
              className="flex items-start justify-between rounded-lg border p-3"
            >
              <div>
                <p className="font-semibold capitalize">
                  {anomaly.type.replace(/_/g, " ")}
                </p>
                <p className="text-xs text-muted-foreground">
                  Mês: {anomaly.month}
                </p>
                <p className="text-xs text-muted-foreground">
                  Desvio: {anomaly.deviation_percent}%
                </p>
              </div>
              <Badge
                className={`flex items-center text-white ${
                  severityConfig[anomaly.severity].color
                }`}
              >
                {severityConfig[anomaly.severity].icon}
                {severityConfig[anomaly.severity].text}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
