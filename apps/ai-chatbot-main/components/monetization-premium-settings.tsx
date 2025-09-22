"use client";

import { Crown } from "lucide-react";
import { memo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PremiumSettings = {
  prioritySupport: boolean;
  highThroughput: boolean;
  betaFeatures: boolean;
  customModels: boolean;
  maxTokens: number;
  advancedAnalytics: boolean;
};

type PremiumSettingsProps = {
  className?: string;
  initialSettings?: Partial<PremiumSettings>;
  onSave?: (settings: PremiumSettings) => void;
};

const defaultSettings: PremiumSettings = {
  prioritySupport: true,
  highThroughput: true,
  betaFeatures: false,
  customModels: false,
  maxTokens: 8192,
  advancedAnalytics: true,
};

const MonetizationPremiumSettings = memo(
  ({ className, initialSettings, onSave }: PremiumSettingsProps) => {
    const [settings, setSettings] = useState<PremiumSettings>({
      ...defaultSettings,
      ...initialSettings,
    });

    const handleToggle = (key: keyof PremiumSettings) => {
      setSettings((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    };

    const handleSliderChange = (value: number[]) => {
      setSettings((prev) => ({
        ...prev,
        maxTokens: value[0],
      }));
    };

    const handleSave = () => {
      if (onSave) {
        onSave(settings);
      }
    };

    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            <CardTitle>Configurações Premium</CardTitle>
          </div>
          <CardDescription>
            Gerencie suas configurações e recursos premium exclusivos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs className="w-full" defaultValue="features">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="features">Recursos</TabsTrigger>
              <TabsTrigger value="limits">Limites</TabsTrigger>
            </TabsList>
            <TabsContent className="space-y-4 pt-4" value="features">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="priority-support">
                      Suporte prioritário
                    </Label>
                    <p className="text-muted-foreground text-sm">
                      Receba suporte em até 1 hora
                    </p>
                  </div>
                  <Switch
                    checked={settings.prioritySupport}
                    id="priority-support"
                    onCheckedChange={() => handleToggle("prioritySupport")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="high-throughput">Alta capacidade</Label>
                    <p className="text-muted-foreground text-sm">
                      Aumente sua cota de requisições
                    </p>
                  </div>
                  <Switch
                    checked={settings.highThroughput}
                    id="high-throughput"
                    onCheckedChange={() => handleToggle("highThroughput")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="beta-features">Recursos beta</Label>
                      <Badge className="text-xs" variant="outline">
                        Novo
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Acesso antecipado a novos recursos
                    </p>
                  </div>
                  <Switch
                    checked={settings.betaFeatures}
                    id="beta-features"
                    onCheckedChange={() => handleToggle("betaFeatures")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="custom-models">
                      Modelos personalizados
                    </Label>
                    <p className="text-muted-foreground text-sm">
                      Use seus próprios modelos treinados
                    </p>
                  </div>
                  <Switch
                    checked={settings.customModels}
                    id="custom-models"
                    onCheckedChange={() => handleToggle("customModels")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="advanced-analytics">
                      Analytics avançado
                    </Label>
                    <p className="text-muted-foreground text-sm">
                      Relatórios e insights detalhados
                    </p>
                  </div>
                  <Switch
                    checked={settings.advancedAnalytics}
                    id="advanced-analytics"
                    onCheckedChange={() => handleToggle("advancedAnalytics")}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent className="space-y-4 pt-4" value="limits">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="max-tokens">Limite de tokens</Label>
                    <span className="text-muted-foreground text-sm">
                      {settings.maxTokens}
                    </span>
                  </div>
                  <Slider
                    aria-label="Token limit"
                    id="max-tokens"
                    max={32_768}
                    min={1024}
                    onValueChange={handleSliderChange}
                    step={1024}
                    value={[settings.maxTokens]}
                  />
                  <p className="text-muted-foreground text-xs">
                    Define o número máximo de tokens por requisição
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Restaurar padrões</Button>
          <Button onClick={handleSave}>Salvar alterações</Button>
        </CardFooter>
      </Card>
    );
  }
);

MonetizationPremiumSettings.displayName = "MonetizationPremiumSettings";

export { MonetizationPremiumSettings };
