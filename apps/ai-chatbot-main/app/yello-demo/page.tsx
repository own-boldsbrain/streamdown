"use client";

import { Button } from "@/components/ui/button";
import { YelloBorder, YelloButton, YelloCard } from "@/components/yello-ui";

export default function YelloComponentsDemo() {
  return (
    <div className="container mx-auto space-y-8 p-6">
      <h1 className="mb-6 font-bold text-3xl">Yello Solar Hub Components</h1>

      <section className="space-y-4">
        <h2 className="font-semibold text-2xl">Botões</h2>
        <div className="flex flex-wrap gap-4">
          <YelloButton>Yello Glass Button</YelloButton>
          <YelloButton variant="yello-outline">
            Yello Outline Button
          </YelloButton>
          <Button variant="default">Botão Padrão</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-2xl">Cards</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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

          <div className="rounded-lg border border-border bg-accent/10 p-4">
            <h3 className="mb-2 font-medium text-lg">Card Padrão</h3>
            <p>Card com estilo padrão da aplicação para comparação.</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-2xl">Elementos Combinados</h2>
        <YelloCard className="mx-auto max-w-md">
          <h3 className="mb-2 font-medium text-lg">Exemplo de Formulário</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block font-medium text-sm" htmlFor="nome">
                Nome
              </label>
              <input
                className="w-full rounded-md border border-border bg-background/50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                id="nome"
                placeholder="Digite seu nome"
                type="text"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-sm" htmlFor="email">
                Email
              </label>
              <input
                className="w-full rounded-md border border-border bg-background/50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                id="email"
                placeholder="Digite seu email"
                type="email"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline">Cancelar</Button>
              <YelloButton>Enviar</YelloButton>
            </div>
          </div>
        </YelloCard>
      </section>
    </div>
  );
}
