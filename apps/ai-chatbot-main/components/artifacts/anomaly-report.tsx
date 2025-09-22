"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnomalyReportSchema } from "@/lib/schemas/ap2";

export default function AnomalyReportArtifact({
  seed,
}: {
  seed: Record<string, unknown>;
}) {
  const { object, isLoading, error, submit, stop, clear } = useObject({
    api: "/api/use-object",
    schema: AnomalyReportSchema,
    initialValue: {
      system_id: (seed?.system_id as string) || "system-default",
    },
  });

  // Cast do objeto para acessar propriedades de forma segura
  const typedObject = object as
    | {
        system_id?: string;
        total_anomalies?: number;
        risk_assessment?: string;
        anomalies_detected?: Array<{
          type?: string;
          month?: string;
          severity?: string;
          description?: string;
        }>;
      }
    | undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatório de Anomalias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button onClick={() => submit(seed)} type="button">
            Gerar
          </Button>
          <Button
            disabled={!isLoading}
            onClick={stop}
            type="button"
            variant="outline"
          >
            Parar
          </Button>
          <Button onClick={clear} type="button" variant="secondary">
            Limpar
          </Button>
        </div>

        {isLoading && <div className="text-sm opacity-70">Gerando…</div>}
        {error && (
          <div className="text-red-600 text-sm">Erro: {String(error)}</div>
        )}

        {typedObject && (
          <div className="space-y-2 text-sm">
            <div>System: {typedObject.system_id}</div>

            {typedObject.total_anomalies !== undefined &&
              typedObject.risk_assessment && (
                <div>
                  Total: {typedObject.total_anomalies} · Risco:{" "}
                  {typedObject.risk_assessment}
                </div>
              )}

            {typedObject.anomalies_detected &&
              typedObject.anomalies_detected.length > 0 && (
                <ul className="ml-5 list-disc">
                  {typedObject.anomalies_detected.map((anomaly, index) => (
                    <li key={`anomaly-${index}-${anomaly.type || "unknown"}`}>
                      {anomaly.type || "Tipo desconhecido"} ·
                      {anomaly.severity || "severity n/a"} ·
                      {anomaly.month || "mês n/a"}
                    </li>
                  ))}
                </ul>
              )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
