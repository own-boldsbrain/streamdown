"use client";

import { AlertTriangle, Gauge, Lightning, Zap } from "lucide-react";
import { AnomalyReport } from "@/components/artifact-anomaly-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ComplianceMessage,
  PreSizingCard,
  WhatsAppPreviewMessage,
  YelloMessage,
} from "@/components/yello-messaging";
import { YelloBorder, YelloButton, YelloCard } from "@/components/yello-ui";

export default function YelloComponentsDemo() {
  return (
    <div className="container mx-auto space-y-8 p-6">
      <h1 className="mb-6 font-bold text-3xl">
        Yello Solar Hub - Tom "Marrento Certo"
      </h1>

      <section className="space-y-4">
        <h2 className="font-semibold text-2xl">Botões no Estilo YSH</h2>
        <div className="flex flex-wrap gap-4">
          <YelloButton>Simular agora</YelloButton>
          <YelloButton variant="yello-outline">Ver recomendação</YelloButton>
          <Button variant="default">Botão Padrão</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-2xl">Artifacts (UX Brief)</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <AnomalyReport
            description="Identificamos picos de consumo que podem ser ajustados para melhorar sua economia. Dá pra reduzir até 30% sem perder conforto."
            faixaHoraria="18h-22h"
            title="Consumo torto, eu desentorto."
          />

          <YelloMessage
            buttonText="Ver detalhes"
            icon={<Gauge className="h-5 w-5" />}
            message="Suave. Pode tocar. Seu sistema está dentro dos parâmetros esperados."
            title="Medidor de Risco"
            variant="success"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-2xl">Comunicações YSH</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <WhatsAppPreviewMessage
            body="Conta R$ 820,00. Kit Prosumer8 derruba ~72% e paga em ~3.5 anos. Quer o PDF?"
            header="Simulação pronta. ☀️"
          />

          <ComplianceMessage
            buttonText="Ver detalhes"
            isCompliant={true}
            nextReviewDate="12/05/2026"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-2xl">Cards Informativos</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <PreSizingCard kWp={5.6} paybackAnos={3.8} />

          <YelloMessage
            buttonText="Baixar projeto"
            icon={<Zap className="h-5 w-5" />}
            message="Projeto assinado e na régua. Eng. resp.: CREA-SP 123456."
            title="Esquema elétrico sem mistério."
            variant="primary"
          />

          <YelloMessage
            buttonText="Acompanhar status"
            icon={<AlertTriangle className="h-5 w-5" />}
            message="Protocolo 123456-7 em andamento. Status: Em análise. Prazo médio: 15 dias. Deixa comigo."
            title="Protocolo em andamento"
            variant="info"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-2xl">Toast Messages</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <YelloCard className="bg-black/5 p-4">
            <div className="rounded-lg border border-border bg-background p-3 shadow-md">
              <div className="flex items-center gap-2">
                <Lightning className="h-5 w-5 text-yello-primary" />
                <p className="font-medium">
                  Padrão fora da curva. Calma — eu explico e ajusto.
                </p>
              </div>
            </div>
          </YelloCard>

          <YelloCard className="bg-black/5 p-4">
            <div className="rounded-lg border border-border bg-background p-3 shadow-md">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yello-accent" />
                <p className="font-medium">
                  Projeto fechado. Sem gambiarra, só número.
                </p>
              </div>
            </div>
          </YelloCard>
        </div>
      </section>

      <section className="mt-8 space-y-4 border-border border-t pt-6">
        <h2 className="font-semibold text-2xl">Base Components</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <YelloCard>
            <h3 className="mb-2 font-medium text-lg">Card com Efeito Glass</h3>
            <p>
              Card com efeito de vidro e borda em degradê fino seguindo o estilo
              Yello Solar Hub.
            </p>
          </YelloCard>

          <YelloBorder className="bg-background">
            <h3 className="mb-2 font-medium text-lg">
              Container com Borda Degradê
            </h3>
            <p>
              Container com borda em degradê fino seguindo o estilo Yello Solar
              Hub.
            </p>
          </YelloBorder>

          <Card variant="glass">
            <CardHeader>
              <CardTitle>Card com Glass Effect</CardTitle>
              <CardDescription>
                Usando a variante glass do Yello Solar Hub
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Componente com estilo YSH.</p>
            </CardContent>
            <CardFooter>
              <YelloButton className="w-full">Ação YSH</YelloButton>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
