import {
  CheckCircle,
  CircleDot,
  FileText,
  Hourglass,
  ListChecks,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type JourneyStage = {
  name: string;
  status: "completed" | "in_progress" | "pending";
  description: string;
};

type PotentialJourneyData = {
  potential_journey: {
    customer_id: string;
    journey_id: string;
    current_stage: string;
    stages: JourneyStage[];
  };
};

const stageIcons = {
  "Análise de Consumo": <ListChecks className="h-5 w-5" />,
  "Dimensionamento do Sistema": <CircleDot className="h-5 w-5" />,
  "Simulação Financeira": <FileText className="h-5 w-5" />,
  "Envio da Proposta": <Hourglass className="h-5 w-5" />,
  "Assinatura do Contrato": <Hourglass className="h-5 w-5" />,
};

const getStatusClasses = (status: string, isCurrent: boolean) => {
  if (isCurrent) {
    return {
      icon: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/20",
      border: "border-blue-500",
      text: "text-blue-600 dark:text-blue-300",
    };
  }
  switch (status) {
    case "completed":
      return {
        icon: "text-green-500",
        bg: "bg-green-50 dark:bg-green-950/20",
        border: "border-green-500/50",
        text: "text-green-600 dark:text-green-300",
      };
    case "pending":
      return {
        icon: "text-gray-400",
        bg: "bg-gray-50 dark:bg-gray-800/20",
        border: "border-gray-300/50 dark:border-gray-700/50",
        text: "text-gray-500 dark:text-gray-400",
      };
    default:
      return {
        icon: "text-gray-400",
        bg: "bg-white dark:bg-gray-900",
        border: "border-gray-300 dark:border-gray-700",
        text: "text-gray-500 dark:text-gray-400",
      };
  }
};

export const PotentialJourneyReport = ({
  data,
}: {
  data: PotentialJourneyData;
}) => {
  const { customer_id, journey_id, current_stage, stages } =
    data.potential_journey;

  return (
    <Card className="w-full max-w-3xl border-border/50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="font-bold text-foreground text-lg">
          Jornada Solar Potencial
        </CardTitle>
        <Badge variant="outline">ID: {journey_id}</Badge>
      </CardHeader>
      <CardContent>
        <div className="relative flex justify-between">
          {stages.map((stage) => {
            const isCurrent = stage.name === current_stage;
            const statusClasses = getStatusClasses(stage.status, isCurrent);
            const Icon =
              stageIcons[stage.name as keyof typeof stageIcons] || CircleDot;

            return (
              <TooltipProvider key={stage.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="z-10 flex flex-col items-center">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${statusClasses.bg} ${statusClasses.border}`}
                      >
                        {stage.status === "completed" ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                          <div className={statusClasses.icon}>{Icon}</div>
                        )}
                      </div>
                      <p
                        className={`mt-2 text-center font-medium text-xs ${statusClasses.text}`}
                      >
                        {stage.name}
                      </p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{stage.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
          <div className="absolute top-6 left-0 -z-0 h-0.5 w-full bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="mt-6 rounded-lg border bg-gray-50 p-3 text-center dark:bg-gray-800/30">
          <p className="font-semibold text-sm">
            Cliente: <span className="font-mono">{customer_id}</span>
          </p>
          <p className="text-muted-foreground text-xs">
            Etapa Atual:{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {current_stage}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
