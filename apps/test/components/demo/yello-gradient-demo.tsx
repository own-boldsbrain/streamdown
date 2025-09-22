"use client";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";

/**
 * Demonstração dos componentes UI com o degradê da Yello
 */
export default function YelloGradientDemo() {
  return (
    <div className="container mx-auto space-y-8 py-10">
      <h1 className="font-bold text-3xl">
        Demonstração de Componentes com Degradê Yello
      </h1>

      <section>
        <h2 className="mb-4 font-semibold text-2xl">Botões</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="yello-gradient">Botão com Degradê</Button>
          <Button variant="yello-stroke">Botão com Stroke</Button>
          <Button variant="yello-animated">Botão Animado</Button>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-semibold text-2xl">Cards</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Card Padrão</CardTitle>
              <CardDescription>Sem degradê Yello</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Este é um card com estilo padrão.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Ação</Button>
            </CardFooter>
          </Card>

          <Card variant="yello-stroke">
            <CardHeader>
              <CardTitle>Card com Stroke</CardTitle>
              <CardDescription>Com borda em degradê Yello</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Este card utiliza o stroke thin degradê da Yello.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="yello-stroke">
                Ação
              </Button>
            </CardFooter>
          </Card>

          <Card variant="yello-animated">
            <CardHeader>
              <CardTitle>Card Animado</CardTitle>
              <CardDescription>Com borda animada em degradê</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Este card utiliza o stroke animado em degradê da Yello.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="yello-animated">
                Ação
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-semibold text-2xl">Inputs</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Input placeholder="Input padrão" />
          <Input placeholder="Input com stroke Yello" variant="yello-stroke" />
          <Input
            placeholder="Input com stroke animado"
            variant="yello-animated"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-semibold text-2xl">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Padrão</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="yello-gradient">Yello Gradient</Badge>
          <Badge variant="yello-stroke">Yello Stroke</Badge>
          <Badge variant="yello-animated">Yello Animated</Badge>
        </div>
      </section>
    </div>
  );
}
