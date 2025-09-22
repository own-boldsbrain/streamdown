import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Shield } from "lucide-react";

type ComplianceStatusData = {
  compliance_status: {
    system_id: string;
    lei_14300_compliant: boolean;
    validation_date: string;
    requirements_met: string[];
    next_review_date: string;
  };
};

const getComplianceIcon = (compliant: boolean) => {
  return compliant ? (
    <CheckCircle className="h-5 w-5 text-green-500" />
  ) : (
    <XCircle className="h-5 w-5 text-red-500" />
  );
};

const getComplianceBadge = (compliant: boolean) => {
  return compliant ? (
    <Badge className="bg-green-500 text-white">
      <CheckCircle className="mr-1 h-3 w-3" />
      Conforme
    </Badge>
  ) : (
    <Badge className="bg-red-500 text-white">
      <XCircle className="mr-1 h-3 w-3" />
      Não Conforme
    </Badge>
  );
};

export const ComplianceStatusReport = ({ data }: { data: ComplianceStatusData }) => {
  const { system_id, lei_14300_compliant, validation_date, requirements_met, next_review_date } = data.compliance_status;

  return (
    <Card className="w-full max-w-2xl border-border/50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold text-foreground">
          Status de Conformidade - Lei 14.300/2022
        </CardTitle>
        <Badge variant="outline" className="text-sm">
          ID do Sistema: {system_id}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {getComplianceIcon(lei_14300_compliant)}
            <div>
              <p className="font-semibold">Lei 14.300/2022 (Geração Distribuída)</p>
              <p className="text-sm text-muted-foreground">
                Validação realizada em {new Date(validation_date).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          {getComplianceBadge(lei_14300_compliant)}
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Requisitos Verificados
          </h4>
          <div className="grid gap-2">
            {requirements_met.map((requirement, index) => (
              <div
                key={`requirement-${index}`}
                className="flex items-center gap-3 p-3 rounded-lg border bg-green-50 dark:bg-green-950/20"
              >
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">{requirement}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg border bg-blue-50 dark:bg-blue-950/20">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <h4 className="font-semibold text-sm">Próxima Revisão</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Revisão obrigatória até {new Date(next_review_date).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};