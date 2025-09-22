'use client';

import { YelloButton, YelloCard, YelloBorder } from '@/components/yello-ui';
import { Button } from '@/components/ui/button';

export default function YelloComponentsDemo() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Yello Solar Hub Components</h1>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Botões</h2>
        <div className="flex flex-wrap gap-4">
          <YelloButton>Yello Glass Button</YelloButton>
          <YelloButton variant="yello-outline">Yello Outline Button</YelloButton>
          <Button variant="default">Botão Padrão</Button>
        </div>
      </section>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <YelloCard>
            <h3 className="text-lg font-medium mb-2">Card com Efeito Glass</h3>
            <p>Card com efeito de vidro e borda em degradê fino seguindo o estilo Yello Solar Hub.</p>
          </YelloCard>
          
          <YelloBorder className="bg-background">
            <h3 className="text-lg font-medium mb-2">Container com Borda Degradê</h3>
            <p>Container com borda em degradê fino seguindo o estilo Yello Solar Hub.</p>
          </YelloBorder>
          
          <div className="bg-accent/10 border border-border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Card Padrão</h3>
            <p>Card com estilo padrão da aplicação para comparação.</p>
          </div>
        </div>
      </section>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Elementos Combinados</h2>
        <YelloCard className="mx-auto max-w-md">
          <h3 className="mb-2 text-lg font-medium">Exemplo de Formulário</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="nome" className="mb-1 block text-sm font-medium">Nome</label>
              <input 
                id="nome"
                type="text" 
                className="w-full rounded-md border border-border bg-background/50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Digite seu nome"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
              <input 
                id="email"
                type="email" 
                className="w-full rounded-md border border-border bg-background/50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Digite seu email"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline">Cancelar</Button>
              <YelloButton>Enviar</YelloButton>
            </div>
          </div>
        </YelloCard>
      </section>
    </div>
  );
}