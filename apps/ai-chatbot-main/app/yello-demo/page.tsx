"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnomalyReport } from "@/components/artifact-anomaly-card";
import { YelloBorder, YelloButton, YelloCard } from "@/components/yello-ui";
import { ComplianceMessage, PreSizingCard, WhatsAppPreviewMessage, YelloMessage } from "@/components/yello-messaging";
import { Gauge, Lightning, Zap, AlertTriangle } from "lucide-react";

export default function YelloComponentsDemo() {
  return (
    <div className="container mx-auto space-y-8 p-6">
      <h1 className="mb-6 text-3xl font-bold">Yello Solar Hub - Tom "Marrento Certo"</h1>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Botões no Estilo YSH</h2>
        <div className="flex flex-wrap gap-4">
          <YelloButton>Simular agora</YelloButton>
          <YelloButton variant="yello-outline">Ver recomendação</YelloButton>
          <Button variant="default">Botão Padrão</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Artifacts (UX Brief)</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <AnomalyReport
            title="Consumo torto, eu desentorto."
            faixaHoraria="18h-22h"
            description="Identificamos picos de consumo que podem ser ajustados para melhorar sua economia. Dá pra reduzir até 30% sem perder conforto."
          />
          
          <YelloMessage
            icon={<Gauge className="h-5 w-5" />}
            title="Medidor de Risco"
            message="Suave. Pode tocar. Seu sistema está dentro dos parâmetros esperados."
            buttonText="Ver detalhes"
            variant="success"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Comunicações YSH</h2>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <WhatsAppPreviewMessage 
            header="Simulação pronta. ☀️"
            body="Conta R$ 820,00. Kit Prosumer8 derruba ~72% e paga em ~3.5 anos. Quer o PDF?"
          />
          
          <ComplianceMessage 
            isCompliant={true} 
            nextReviewDate="12/05/2026"
            buttonText="Ver detalhes"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Cards Informativos</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <PreSizingCard kWp={5.6} paybackAnos={3.8} />
          
          <YelloMessage
            icon={<Zap className="h-5 w-5" />}
            title="Esquema elétrico sem mistério."
            message="Projeto assinado e na régua. Eng. resp.: CREA-SP 123456."
            buttonText="Baixar projeto"
            variant="primary"
          />

          <YelloMessage
            icon={<AlertTriangle className="h-5 w-5" />}
            title="Protocolo em andamento"
            message="Protocolo 123456-7 em andamento. Status: Em análise. Prazo médio: 15 dias. Deixa comigo."
            buttonText="Acompanhar status"
            variant="info"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Toast Messages</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <YelloCard className="bg-black/5 p-4">
            <div className="rounded-lg bg-background border border-border p-3 shadow-md">
              <div className="flex items-center gap-2">
                <Lightning className="h-5 w-5 text-yello-primary" />
                <p className="font-medium">Padrão fora da curva. Calma — eu explico e ajusto.</p>
              </div>
            </div>
          </YelloCard>
          
          <YelloCard className="bg-black/5 p-4">
            <div className="rounded-lg bg-background border border-border p-3 shadow-md">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yello-accent" />
                <p className="font-medium">Projeto fechado. Sem gambiarra, só número.</p>
              </div>
            </div>
          </YelloCard>
        </div>
      </section>
      
      <section className="space-y-4 mt-8 pt-6 border-t border-border">
        <h2 className="text-2xl font-semibold">Base Components</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <YelloCard>
            <h3 className="mb-2 text-lg font-medium">Card com Efeito Glass</h3>
            <p>
              Card com efeito de vidro e borda em degradê fino seguindo o estilo
              Yello Solar Hub.
            </p>
          </YelloCard>

          <YelloBorder className="bg-background">
            <h3 className="mb-2 text-lg font-medium">
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
              <p>
                Componente com estilo YSH.
              </p>
            </CardContent>
            <CardFooter>
              <YelloButton className="w-full">
                Ação YSH
              </YelloButton>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
