import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Calculator } from "lucide-react";

type FinancingOption = {
  option_name: string;
  interest_rate: number;
  term_months: number;
  monthly_payment: number;
  total_cost: number;
  irr: number;
};

type FinancingSimulationData = {
  financing_simulation: {
    system_id: string;
    system_size_kw: number;
    total_investment: number;
    financing_options: FinancingOption[];
    recommended_option: string;
  };
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const FinancingSimulationReport = ({ data }: { data: FinancingSimulationData }) => {
  const { system_id, system_size_kw, total_investment, financing_options, recommended_option } = data.financing_simulation;

  return (
    <Card className="w-full max-w-4xl border-border/50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold text-foreground">
          Simulação de Financiamento
        </CardTitle>
        <Badge variant="outline" className="text-sm">
          ID do Sistema: {system_id}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-950/20">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Tamanho do Sistema</span>
            </div>
            <p className="text-2xl font-bold">{system_size_kw} kWp</p>
          </div>

          <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-950/20">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Investimento Total</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(total_investment)}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Opções de Financiamento
          </h4>

          {financing_options.map((option, index) => (
            <div
              key={`option-${index}`}
              className={`p-4 rounded-lg border ${
                option.option_name === recommended_option
                  ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                  : 'border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-semibold">{option.option_name}</h5>
                {option.option_name === recommended_option && (
                  <Badge className="bg-green-500 text-white">
                    Recomendado
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Taxa de Juros</p>
                  <p className="font-semibold">{(option.interest_rate * 100).toFixed(2)}% a.a.</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Prazo</p>
                  <p className="font-semibold">{option.term_months} meses</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Parcela Mensal</p>
                  <p className="font-semibold">{formatCurrency(option.monthly_payment)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Custo Total</p>
                  <p className="font-semibold">{formatCurrency(option.total_cost)}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">TIR (Taxa Interna de Retorno)</span>
                  <span className="font-semibold text-green-600">
                    {(option.irr * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg border bg-yellow-50 dark:bg-yellow-950/20">
          <h4 className="font-semibold text-sm mb-2">Observações Importantes</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Valores aproximados sujeitos à análise de crédito</li>
            <li>• Taxas podem variar conforme perfil do cliente</li>
            <li>• Considere incentivos fiscais disponíveis</li>
            <li>• Recomenda-se consultar instituições financeiras</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};