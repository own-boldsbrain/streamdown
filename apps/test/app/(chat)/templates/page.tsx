"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function TemplatesConsole() {
  const { toast } = useToast();
  const [personaId, setPersonaId] = useState("B1-RS");
  const [region, setRegion] = useState("SE");
  const [channel, setChannel] = useState("whatsapp");
  const [variables, setVariables] = useState<string>(
    '{"persona_nome":"Renata","consumo_kWh_mes":"420","kit_nome":"Rooftop 5kWp","economia_pct":"28","payback_anos":"4","proposta_id":"abc123","contrato_id":"c789","link_curto":"https://y.sh/x"}'
  );
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function call(api: string) {
    try {
      setLoading(true);
      let varsObj = {};
      try {
        varsObj = JSON.parse(variables);
      } catch (e) {
        toast({
          title: "Erro nos dados",
          description: "JSON de variáveis inválido",
          variant: "destructive",
        });
        return;
      }

      const r = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personaId,
          region,
          channel,
          variables: varsObj,
          marketing: true,
        }),
      });

      const data = await r.json();
      setResult(data);

      if (r.status >= 400) {
        toast({
          title: "Erro na operação",
          description: data.error || "Falha na requisição",
          variant: "destructive",
        });
      } else if (data.compliance?.status === "fail") {
        toast({
          title: "Problemas de compliance",
          description: `${data.compliance.errors.join(", ")}`,
          variant: "warning",
        });
      } else {
        toast({
          title: "Sucesso",
          description: api.includes("validate")
            ? "Template validado"
            : "Template renderizado",
          variant: "default",
        });
      }
    } catch (e) {
      toast({
        title: "Erro na requisição",
        description: e instanceof Error ? e.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Console de Templates</span>
            {result?.compliance && (
              <Badge
                variant={
                  result.compliance.status === "pass"
                    ? "success"
                    : "destructive"
                }
                aria-live="polite"
              >
                {result.compliance.status === "pass" ? "PASS" : "FAIL"}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              value={personaId}
              onChange={(e) => setPersonaId(e.target.value)}
              placeholder="ID da Persona"
              aria-label="ID da Persona"
            />

            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger aria-label="Região">
                <SelectValue placeholder="Região" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="N">Norte (N)</SelectItem>
                <SelectItem value="NE">Nordeste (NE)</SelectItem>
                <SelectItem value="CO">Centro-Oeste (CO)</SelectItem>
                <SelectItem value="SE">Sudeste (SE)</SelectItem>
                <SelectItem value="S">Sul (S)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger aria-label="Canal">
                <SelectValue placeholder="Canal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="telegram">Telegram</SelectItem>
                <SelectItem value="email">E-mail</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                onClick={() => call("/api/messaging/validate")}
                variant="outline"
                disabled={loading}
                aria-label="Validar template"
              >
                Validar
              </Button>
              <Button
                onClick={() => call("/api/messaging/compose")}
                disabled={loading}
                aria-label="Renderizar template"
              >
                Renderizar
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm mb-2 block">Variáveis (JSON)</label>
            <Textarea
              rows={6}
              value={variables}
              onChange={(e) => setVariables(e.target.value)}
              className="font-mono text-sm"
              aria-label="Variáveis em formato JSON"
            />
          </div>

          {result && (
            <div>
              <h3 className="text-sm font-medium mb-2">Resultado</h3>
              <div className="bg-muted p-4 rounded text-xs font-mono overflow-auto max-h-[400px]">
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>

              {result.compliance?.errors?.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
                  <h4 className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">
                    Erros de Compliance:
                  </h4>
                  <ul className="list-disc pl-5 text-sm text-red-600 dark:text-red-400">
                    {result.compliance.errors.map((err: string, i: number) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.rendered && channel === "whatsapp" && (
                <div className="mt-4 p-4 border rounded-md max-w-sm">
                  <div className="text-xs text-muted-foreground mb-1">
                    Preview WhatsApp
                  </div>
                  {result.rendered.header && (
                    <div className="font-medium">{result.rendered.header}</div>
                  )}
                  <div className="whitespace-pre-wrap my-2">
                    {result.rendered.body}
                  </div>
                  {result.rendered.footer && (
                    <div className="text-xs text-muted-foreground">
                      {result.rendered.footer}
                    </div>
                  )}
                  {result.raw.cta && (
                    <div className="mt-2">
                      <Button size="sm" variant="outline" className="w-full">
                        {result.raw.cta.text}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground">
        <p>
          Este serviço segue as diretrizes de compliance para todos os canais:
          <br />
          WhatsApp: Body ≤ 1024 caracteres, sem links diretos no corpo, opt-out
          para marketing.
          <br />
          SMS: Total ≤ 160 caracteres, opt-out para marketing.
          <br />
          E-mail: Subject ≤ 78 caracteres, preheader ≤ 110 caracteres.
          <br />
          Telegram: Máximo de 4 botões por linha.
        </p>
        <p className="mt-2">
          <a href="/politica-privacidade" className="underline">
            Política de Privacidade
          </a>{" "}
          | Finalidade: Comunicação de produtos e serviços conforme LGPD.
        </p>
      </div>
    </div>
  );
}
