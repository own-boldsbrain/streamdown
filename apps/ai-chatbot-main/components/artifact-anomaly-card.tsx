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

interface AnomalyReportProps {
  title?: string;
  subtitle?: string;
  faixaHoraria?: string;
  description?: string;
  className?: string;
  onViewRecommendation?: () => void;
}

/**
 * AnomalyReport - Componente de relatório de anomalias no estilo Yello Solar Hub
 * Segue o estilo de mensagens "Marrento Certo"
 */
export function AnomalyReport({
  title = "Consumo torto, eu desentorto.",
  subtitle = "Picos detectados. Dá pra domar com ajuste fininho.",
  faixaHoraria,
  description,
  className,
  onViewRecommendation = () => {},
}: AnomalyReportProps) {
  return (
    <Card className={cn("overflow-hidden", className)} variant="glass">
      <CardHeader className="pb-2">
        <CardTitle className="font-bold text-xl text-yello-accent">
          {title}
        </CardTitle>
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
        </div>
      </CardContent>
      <CardFooter>
        <YelloButton
          className="w-full font-medium"
          onClick={onViewRecommendation}
        >
          Ver recomendação
        </YelloButton>
      </CardFooter>
    </Card>
  );
}
