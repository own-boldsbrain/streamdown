import { AlertTriangle, TrendingUp, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { YelloButton } from "@/components/yello-ui";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type AnomalySeverity = "low" | "medium" | "high";
type AnomalyType = "consumption_spike" | "unusual_pattern" | "billing_irregularity" | "outlier";

type AnomalyReportProps = {
  title?: string;
  subtitle?: string;
  faixaHoraria?: string;
  description?: string;
  className?: string;
  onViewRecommendation?: () => void;
  severity?: AnomalySeverity;
  type?: AnomalyType;
  deviationPercent?: number;
  systemId?: string;
};

const SEVERITY_ICONS = {
  low: <TrendingUp className="h-4 w-4 text-blue-500" />,
  medium: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
  high: <Zap className="h-4 w-4 text-red-500" />
};

const SEVERITY_LABELS = {
  low: "Baixo",
  medium: "Médio",
  high: "Alto"
};

const TYPE_LABELS = {
  consumption_spike: "Pico de Consumo",
  unusual_pattern: "Padrão Anormal",
  billing_irregularity: "Irregularidade",
  outlier: "Outlier"
};

/**
 * AnomalyReport - Componente de relatório de anomalias no estilo Yello Solar Hub
 * Segue o estilo de mensagens "Marrento Certo" do AP2 Detection Agent
 */
export function AnomalyReport({
  title = "Consumo torto, eu desentorto.",
  subtitle = "Picos detectados. Dá pra domar com ajuste fininho.",
  faixaHoraria,
  description,
  className,
  onViewRecommendation = () => {
    // Action for viewing recommendation
  },
  severity = "medium",
  type = "consumption_spike",
  deviationPercent = 0,
  systemId = ""
}: AnomalyReportProps) {
  
  const typeLabel = TYPE_LABELS[type];
  const severityLabel = SEVERITY_LABELS[severity];
  const severityIcon = SEVERITY_ICONS[severity];
  
  return (
    <Card className={cn("overflow-hidden border-l-4", 
      severity === "low" ? "border-l-blue-500" : 
      severity === "medium" ? "border-l-yellow-500" : 
      "border-l-red-500", 
      className)} 
      variant="glass">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="font-bold text-xl text-yello-accent">
            {title}
          </CardTitle>
          <div className="flex space-x-2">
            <Badge className="flex items-center gap-1" variant="outline">
              {severityIcon} {severityLabel}
            </Badge>
            <Badge variant="secondary">
              {typeLabel}
            </Badge>
          </div>
        </div>
        <CardDescription>
          {faixaHoraria
            ? `Picos em ${faixaHoraria}. Dá pra domar com ajuste fininho.`
            : subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <p className="text-foreground/90 text-sm">
            {description ||
              "Analisamos seus dados e identificamos padrões que podem ser otimizados para melhorar sua economia."}
          </p>
          
          {deviationPercent > 0 && (
            <div className="bg-gray-50 mt-2 rounded-md p-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Desvio detectado:</span>
                <span className="font-bold text-red-500">+{deviationPercent.toFixed(1)}%</span>
              </div>
            </div>
          )}
          
          {systemId && (
            <div className="mt-1 text-gray-500 text-xs">
              Sistema: {systemId}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <YelloButton
          className="w-full font-medium"
          onClick={onViewRecommendation}
        >
          Resolver agora
        </YelloButton>
      </CardFooter>
    </Card>
  );
}
