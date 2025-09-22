"use client";

import { Check, Crown, Star, X, Zap } from "lucide-react";
import { memo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type PlanType = "monthly" | "yearly";

export type PlanTier = "starter" | "pro" | "enterprise";

type PlanFeature = {
  name: string;
  included: boolean;
  highlight?: boolean;
};

type Plan = {
  id: PlanTier;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  badge?: string;
  features: PlanFeature[];
  popular?: boolean;
  ctaText: string;
};

type MonetizationUpgradeModalProps = {
  /** Current user tier */
  currentTier?: PlanTier;
  /** Trigger element for the modal */
  trigger?: React.ReactNode;
  /** Callback when a plan is selected */
  onPlanSelect?: (planId: PlanTier, billingType: PlanType) => void;
  /** Callback when modal is closed */
  onClose?: () => void;
  /** Show modal by default */
  open?: boolean;
  /** Custom title */
  title?: string;
  /** Custom description */
  description?: string;
  /** Show yearly/monthly toggle */
  showBillingToggle?: boolean;
  /** Default billing type */
  defaultBillingType?: PlanType;
  /** Additional CSS classes */
  className?: string;
};

const plans: Plan[] = [
  {
    id: "starter",
    name: "Iniciante",
    description: "Perfeito para começar sua jornada",
    monthlyPrice: 19,
    yearlyPrice: 190,
    features: [
      { name: "Até 1.000 mensagens/mês", included: true },
      { name: "5GB de armazenamento", included: true },
      { name: "Suporte por email", included: true },
      { name: "Recursos básicos de IA", included: true },
      { name: "Exportação básica", included: true },
      { name: "Integrações limitadas", included: false },
      { name: "Suporte prioritário", included: false },
      { name: "Recursos avançados", included: false },
    ],
    ctaText: "Começar Grátis",
  },
  {
    id: "pro",
    name: "Profissional",
    description: "Para profissionais que precisam de mais",
    monthlyPrice: 49,
    yearlyPrice: 490,
    badge: "Mais Popular",
    popular: true,
    features: [
      { name: "Até 10.000 mensagens/mês", included: true, highlight: true },
      { name: "50GB de armazenamento", included: true },
      { name: "Suporte prioritário 24/7", included: true },
      { name: "Todos os recursos de IA", included: true },
      { name: "Exportação avançada", included: true },
      { name: "Integrações completas", included: true },
      { name: "API access", included: true },
      { name: "Recursos empresariais", included: false },
    ],
    ctaText: "Upgrade para Pro",
  },
  {
    id: "enterprise",
    name: "Empresarial",
    description: "Soluções completas para empresas",
    monthlyPrice: 99,
    yearlyPrice: 990,
    features: [
      { name: "Mensagens ilimitadas", included: true, highlight: true },
      { name: "Armazenamento ilimitado", included: true },
      { name: "Suporte dedicado", included: true },
      { name: "Todos os recursos", included: true },
      { name: "SLA garantido", included: true },
      { name: "Integrações customizadas", included: true },
      { name: "On-premise deployment", included: true },
      { name: "Consultoria incluída", included: true },
    ],
    ctaText: "Falar com Vendas",
  },
];

const getSavingsPercentage = (
  monthlyPrice: number,
  yearlyPrice: number
): number => {
  const monthlyTotal = monthlyPrice * 12;
  return Math.round(((monthlyTotal - yearlyPrice) / monthlyTotal) * 100);
};

export const MonetizationUpgradeModal = memo<MonetizationUpgradeModalProps>(
  ({
    currentTier,
    trigger,
    onPlanSelect,
    onClose,
    open: controlledOpen,
    title = "Escolha seu plano",
    description = "Desbloqueie todo o potencial da plataforma com nossos planos premium",
    showBillingToggle = true,
    defaultBillingType = "monthly",
    className,
  }) => {
    const [open, setOpen] = useState(controlledOpen);
    const [billingType, setBillingType] =
      useState<PlanType>(defaultBillingType);

    const handleOpenChange = (newOpen: boolean) => {
      setOpen(newOpen);
      if (!newOpen) {
        onClose?.();
      }
    };

    const handlePlanSelect = (planId: PlanTier) => {
      onPlanSelect?.(planId, billingType);
      setOpen(false);
    };

    const renderPlanCard = (plan: Plan) => {
      const isCurrentPlan = currentTier === plan.id;
      const price =
        billingType === "monthly" ? plan.monthlyPrice : plan.yearlyPrice / 12;
      const yearlySavings = getSavingsPercentage(
        plan.monthlyPrice,
        plan.yearlyPrice
      );

      return (
        <Card
          className={cn(
            "relative transition-all duration-200 hover:shadow-lg",
            plan.popular && "border-purple-200 shadow-md",
            isCurrentPlan && "border-green-200 bg-green-50/50"
          )}
          key={plan.id}
        >
          {plan.badge && (
            <div className="-top-3 -translate-x-1/2 absolute left-1/2 transform">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-white">
                <Star className="mr-1 h-3 w-3" />
                {plan.badge}
              </Badge>
            </div>
          )}

          {isCurrentPlan && (
            <div className="-top-3 absolute right-4">
              <Badge className="border-green-200 bg-green-100 text-green-700">
                <Check className="mr-1 h-3 w-3" />
                Seu plano atual
              </Badge>
            </div>
          )}

          <CardHeader className="pb-4 text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              {plan.name}
              {plan.popular && <Crown className="h-5 w-5 text-purple-500" />}
            </CardTitle>
            <CardDescription>{plan.description}</CardDescription>

            <div className="space-y-1">
              <div className="flex items-baseline justify-center gap-1">
                <span className="font-bold text-3xl">
                  R${" "}
                  {billingType === "yearly"
                    ? Math.round(price)
                    : plan.monthlyPrice}
                </span>
                <span className="text-muted-foreground">/mês</span>
              </div>

              {billingType === "yearly" && (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-muted-foreground text-sm line-through">
                    R$ {plan.monthlyPrice * 12}
                  </span>
                  <Badge className="bg-green-100 text-green-700 text-xs">
                    Economize {yearlySavings}%
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li className="flex items-start gap-2" key={index}>
                  <Check
                    className={cn(
                      "mt-0.5 h-4 w-4 flex-shrink-0",
                      feature.included
                        ? feature.highlight
                          ? "text-purple-500"
                          : "text-green-500"
                        : "text-gray-300"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm",
                      feature.included
                        ? feature.highlight
                          ? "font-semibold text-purple-700"
                          : "text-foreground"
                        : "text-muted-foreground line-through"
                    )}
                  >
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              className={cn(
                "w-full",
                plan.popular
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  : "",
                isCurrentPlan && "bg-green-600 hover:bg-green-700"
              )}
              disabled={isCurrentPlan}
              onClick={() => handlePlanSelect(plan.id)}
              variant={plan.popular ? "default" : "outline"}
            >
              {isCurrentPlan ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Plano Atual
                </>
              ) : (
                <>
                  {plan.id === "enterprise" ? (
                    <Zap className="mr-2 h-4 w-4" />
                  ) : (
                    <Crown className="mr-2 h-4 w-4" />
                  )}
                  {plan.ctaText}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      );
    };

    const modalContent = (
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="font-bold text-2xl">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {showBillingToggle && (
          <Tabs
            className="w-full"
            onValueChange={(value) => setBillingType(value as PlanType)}
            value={billingType}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monthly">Mensal</TabsTrigger>
              <TabsTrigger className="relative" value="yearly">
                Anual
                <Badge className="-top-2 -right-2 absolute bg-green-100 px-1.5 py-0.5 text-green-700 text-xs">
                  -20%
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map(renderPlanCard)}
        </div>

        <div className="text-center text-muted-foreground text-sm">
          <p>
            Todos os planos incluem 7 dias de teste grátis. Cancele a qualquer
            momento.
          </p>
          <p className="mt-1">
            Precisa de algo personalizado?{" "}
            <Button className="h-auto p-0 text-sm underline" variant="link">
              Fale conosco
            </Button>
          </p>
        </div>
      </div>
    );

    if (trigger) {
      return (
        <Dialog onOpenChange={handleOpenChange} open={open}>
          <DialogTrigger asChild>{trigger}</DialogTrigger>
          <DialogContent
            className={cn("max-h-[90vh] max-w-6xl overflow-y-auto", className)}
          >
            <DialogHeader>
              <DialogTitle className="sr-only">{title}</DialogTitle>
              <DialogDescription className="sr-only">
                {description}
              </DialogDescription>
            </DialogHeader>
            {modalContent}
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Dialog onOpenChange={handleOpenChange} open={open}>
        <DialogContent
          className={cn("max-h-[90vh] max-w-6xl overflow-y-auto", className)}
        >
          <DialogHeader>
            <DialogTitle className="sr-only">{title}</DialogTitle>
            <DialogDescription className="sr-only">
              {description}
            </DialogDescription>
          </DialogHeader>
          {modalContent}
        </DialogContent>
      </Dialog>
    );
  }
);

MonetizationUpgradeModal.displayName = "MonetizationUpgradeModal";

// Convenience hook for managing upgrade modal state
export const useUpgradeModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return {
    isOpen,
    openModal,
    closeModal,
  };
};
