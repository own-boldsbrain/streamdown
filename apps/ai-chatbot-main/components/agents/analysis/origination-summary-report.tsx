import { BarChart, FileCheck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type OriginationSummaryData = {
  origination_summary: {
    customer_id: string;
    system_id: string;
    status: "approved" | "pending_review" | "rejected";
    average_consumption_kwh: number;
    proposed_system_kwp: number;
    estimated_savings_percent: number;
    estimated_payback_years: number;
  };
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-green-500 text-white">Aprovado</Badge>
      );
    case "pending_review":
      return (
        <Badge className="bg-yellow-500 text-white">Revisão Pendente</Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-500 text-white">Rejeitado</Badge>
      );
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
};

export const OriginationSummaryReport = ({
  data,
}: {
  data: OriginationSummaryData;
}) => {
  const {
    customer_id,
    system_id,
    status,
    average_consumption_kwh,
    proposed_system_kwp,
    estimated_savings_percent,
    estimated_payback_years,
  } = data.origination_summary;

  return (
    <Card className="w-full max-w-2xl border-border/50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-bold text-foreground text-lg">
          Resumo da Originação
        </CardTitle>
        {getStatusBadge(status)}
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            Cliente: <span className="font-mono">{customer_id}</span>
          </p>
          <p className="text-muted-foreground">
            Sistema: <span className="font-mono">{system_id}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2">
              <BarChart className="h-4 w-4 text-blue-500" />
              <span className="font-medium text-sm">Consumo Médio</span>
            </div>
            <p className="font-bold text-2xl">
              {average_consumption_kwh.toLocaleString("pt-BR")} kWh
            </p>
            <p className="text-muted-foreground text-xs">mensal</p>
          </div>

          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="font-medium text-sm">Sistema Proposto</span>
            </div>
            <p className="font-bold text-2xl">{proposed_system_kwp} kWp</p>
            <p className="text-muted-foreground text-xs">potência</p>
          </div>
        </div>

        <div className="mt-6 rounded-lg border bg-green-50 p-4 dark:bg-green-950/20">
          <div className="mb-2 flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-green-600" />
            <h4 className="font-semibold text-sm">Projeções Financeiras</h4>
          </div>
          <div className="flex justify-around">
            <div className="text-center">
              <p className="font-bold text-green-600 text-xl">
                ~{estimated_savings_percent}%
              </p>
              <p className="text-muted-foreground text-xs">
                Economia na Fatura
              </p>
            </div>
            <div className="text-center">
              <p className="font-bold text-green-600 text-xl">
                ~{estimated_payback_years} anos
              </p>
              <p className="text-muted-foreground text-xs">Payback Simples</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
