"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  Crown,
  Gift,
  Rocket,
  Sparkles,
  Star,
  Timer,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { memo, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export type UpsellVariant =
  | "trial-ending"
  | "usage-limit"
  | "premium-feature"
  | "special-offer"
  | "upgrade-prompt";

export type BannerPosition = "top" | "bottom" | "inline";

type MonetizationUpsellBannerProps = {
  variant: UpsellVariant;
  position?: BannerPosition;
  showCloseButton?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
  onClose?: () => void;
  onUpgrade?: () => void;
  onDismiss?: () => void;
  className?: string;
  customTitle?: string;
  customDescription?: string;
  customCtaText?: string;
  trialDaysLeft?: number;
  usagePercentage?: number;
  discountPercentage?: number;
  originalPrice?: string;
  discountedPrice?: string;
};

// Constants for time calculations
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_MINUTE = 60;
const _MILLISECONDS_PER_SECOND = 1000;

// Animation constants
const ANIMATION_DURATION = 0.3;
const COUNTDOWN_UPDATE_INTERVAL = 1000;
const ANIMATION_RESET_DELAY = 1000;
const SPARKLE_ANIMATION_DURATION = 3;
const SLIDE_DISTANCE = 20;
const RANDOM_POSITION_MULTIPLIER = 100;

// Auto-hide delay
const DEFAULT_AUTO_HIDE_DELAY = 10_000;

// Animation delays
const SPARKLE_DELAY_MULTIPLIER = 0.5;
const URGENCY_SCALE_MULTIPLIER = 1.2;
const FEATURE_DELAY_MULTIPLIER = 0.1;

const variantConfigs = {
  "trial-ending": {
    icon: Timer,
    title: "Seu período de teste está terminando!",
    description: "Aproveite todos os recursos premium antes que expire.",
    ctaText: "Fazer Upgrade Agora",
    gradient: "from-orange-500 to-red-500",
    bgColor: "bg-gradient-to-r from-orange-50 to-red-50 border-orange-200",
    urgencyLevel: "high",
  },
  "usage-limit": {
    icon: TrendingUp,
    title: "Limite de uso atingido",
    description: "Você atingiu seu limite mensal. Faça upgrade para continuar.",
    ctaText: "Remover Limites",
    gradient: "from-yellow-500 to-orange-500",
    bgColor: "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200",
    urgencyLevel: "medium",
  },
  "premium-feature": {
    icon: Crown,
    title: "Recurso Premium Desbloqueado",
    description: "Este recurso está disponível apenas para usuários premium.",
    ctaText: "Tornar-se Premium",
    gradient: "from-purple-500 to-pink-500",
    bgColor: "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200",
    urgencyLevel: "medium",
  },
  "special-offer": {
    icon: Gift,
    title: "Oferta Especial por Tempo Limitado!",
    description: "Desconto exclusivo para novos usuários premium.",
    ctaText: "Aproveitar Oferta",
    gradient: "from-green-500 to-emerald-500",
    bgColor: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200",
    urgencyLevel: "high",
  },
  "upgrade-prompt": {
    icon: Rocket,
    title: "Evolua sua experiência",
    description: "Desbloqueie recursos avançados e aumente sua produtividade.",
    ctaText: "Explorar Planos",
    gradient: "from-blue-500 to-indigo-500",
    bgColor: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200",
    urgencyLevel: "low",
  },
};

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / SECONDS_PER_HOUR);
  const minutes = Math.floor((seconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  const secs = seconds % SECONDS_PER_MINUTE;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

export const MonetizationUpsellBanner = memo<MonetizationUpsellBannerProps>(
  ({
    variant,
    position = "top",
    showCloseButton = true,
    autoHide = false,
    autoHideDelay = DEFAULT_AUTO_HIDE_DELAY,
    onClose,
    onUpgrade,
    onDismiss,
    className,
    customTitle,
    customDescription,
    customCtaText,
    trialDaysLeft,
    usagePercentage,
    discountPercentage,
    originalPrice,
    discountedPrice,
  }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const config = variantConfigs[variant];
    const Icon = config.icon;

    // Countdown timer for trial ending
    useEffect(() => {
      if (variant === "trial-ending" && trialDaysLeft) {
        const totalSeconds = trialDaysLeft * 24 * 60 * 60;
        setTimeLeft(totalSeconds);

        const interval = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, COUNTDOWN_UPDATE_INTERVAL);

        return () => clearInterval(interval);
      }
    }, [variant, trialDaysLeft]);

    // Auto-hide functionality
    useEffect(() => {
      if (autoHide && autoHideDelay > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          onClose?.();
        }, autoHideDelay);

        return () => clearTimeout(timer);
      }
    }, [autoHide, autoHideDelay, onClose]);
    const handleUpgrade = () => {
      setIsAnimating(true);
      onUpgrade?.();
      setTimeout(() => setIsAnimating(false), ANIMATION_RESET_DELAY);
    };

    const handleDismiss = () => {
      setIsVisible(false);
      onDismiss?.();
    };

    const renderCountdownTimer = () => {
      if (variant !== "trial-ending" || !trialDaysLeft) {
        return null;
      }

      return (
        <div className="flex items-center gap-2 font-mono text-sm">
          <Timer className="h-4 w-4" />
          <span className="font-semibold">{formatTime(timeLeft)}</span>
          <Badge className="text-xs" variant="outline">
            {trialDaysLeft} {trialDaysLeft === 1 ? "dia" : "dias"} restantes
          </Badge>
        </div>
      );
    };

    const renderUsageProgress = () => {
      if (variant !== "usage-limit" || !usagePercentage) {
        return null;
      }

      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uso mensal</span>
            <span className="font-semibold">{usagePercentage}%</span>
          </div>
          <Progress className="h-2" value={usagePercentage} />
          <p className="text-muted-foreground text-xs">
            Você atingiu {usagePercentage}% do seu limite
          </p>
        </div>
      );
    };

    const renderPricing = () => {
      if (variant !== "special-offer" || !discountPercentage) {
        return null;
      }

      return (
        <div className="flex items-center gap-3">
          {originalPrice && (
            <span className="text-muted-foreground text-sm line-through">
              {originalPrice}
            </span>
          )}
          {discountedPrice && (
            <span className="font-bold text-green-600 text-lg">
              {discountedPrice}
            </span>
          )}
          {discountPercentage && (
            <Badge className="border-green-200 bg-green-100 text-green-700">
              -{discountPercentage}%
            </Badge>
          )}
        </div>
      );
    };

    const positionClasses = {
      top: "sticky top-0 z-50 rounded-none border-x-0 border-t-0",
      bottom: "sticky bottom-0 z-50 rounded-none border-x-0 border-b-0",
      inline: "rounded-lg shadow-lg",
    };

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "relative overflow-hidden border",
              config.bgColor,
              positionClasses[position],
              className
            )}
            exit={{
              opacity: 0,
              y: position === "top" ? -SLIDE_DISTANCE : SLIDE_DISTANCE,
            }}
            initial={{
              opacity: 0,
              y: position === "top" ? -SLIDE_DISTANCE : SLIDE_DISTANCE,
            }}
            transition={{ duration: ANIMATION_DURATION }}
          >
            {/* Animated background gradient */}
            <motion.div
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              className={cn(
                "absolute inset-0 bg-gradient-to-r opacity-5",
                config.gradient
              )}
              style={{
                backgroundSize: "200% 200%",
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />

            {/* Sparkle effects for special offers */}
            {variant === "special-offer" && (
              <div className="absolute inset-0 overflow-hidden">
                {[
                  "sparkle-1",
                  "sparkle-2",
                  "sparkle-3",
                  "sparkle-4",
                  "sparkle-5",
                  "sparkle-6",
                ].map((sparkleId, i) => (
                  <motion.div
                    animate={{
                      y: "-100%",
                      opacity: [0, 1, 0],
                    }}
                    className="absolute"
                    initial={{
                      x: `${Math.random() * RANDOM_POSITION_MULTIPLIER}%`,
                      y: "100%",
                      opacity: 0,
                    }}
                    key={sparkleId}
                    transition={{
                      duration: SPARKLE_ANIMATION_DURATION,
                      delay: i * SPARKLE_DELAY_MULTIPLIER,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeOut",
                    }}
                  >
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                  </motion.div>
                ))}
              </div>
            )}

            <Card className="border-0 bg-transparent shadow-none">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <motion.div
                      className={cn(
                        "flex-shrink-0 rounded-full bg-gradient-to-r p-2",
                        config.gradient
                      )}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </motion.div>

                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate font-semibold text-sm">
                          {customTitle || config.title}
                        </h3>
                        {config.urgencyLevel === "high" && (
                          <motion.div
                            animate={{
                              scale: [1, URGENCY_SCALE_MULTIPLIER, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                            }}
                          >
                            <Badge
                              className="px-1.5 py-0.5 text-xs"
                              variant="destructive"
                            >
                              Urgente
                            </Badge>
                          </motion.div>
                        )}
                      </div>

                      <p className="text-muted-foreground text-sm">
                        {customDescription || config.description}
                      </p>

                      {/* Dynamic content based on variant */}
                      {renderCountdownTimer()}
                      {renderUsageProgress()}
                      {renderPricing()}

                      {/* Feature highlights for premium variant */}
                      {variant === "premium-feature" && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {[
                            "Respostas ilimitadas",
                            "Suporte prioritário",
                            "Recursos avançados",
                          ].map((feature, index) => (
                            <motion.div
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center gap-1 text-muted-foreground text-xs"
                              initial={{ opacity: 0, x: -10 }}
                              key={feature}
                              transition={{
                                delay: index * FEATURE_DELAY_MULTIPLIER,
                              }}
                            >
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {feature}
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-shrink-0 items-center gap-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        className={cn(
                          "bg-gradient-to-r font-semibold shadow-md",
                          config.gradient,
                          isAnimating && "animate-pulse"
                        )}
                        onClick={handleUpgrade}
                        size="sm"
                      >
                        {isAnimating ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            }}
                          >
                            <Zap className="h-4 w-4" />
                          </motion.div>
                        ) : (
                          <>
                            <Star className="mr-1 h-4 w-4" />
                            {customCtaText || config.ctaText}
                          </>
                        )}
                      </Button>
                    </motion.div>

                    {showCloseButton && (
                      <motion.button
                        aria-label="Fechar banner"
                        className="rounded-full p-1 transition-colors hover:bg-black/10"
                        onClick={handleDismiss}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

MonetizationUpsellBanner.displayName = "MonetizationUpsellBanner";

// Convenience components for specific variants
export const TrialEndingBanner = memo(
  (props: Omit<MonetizationUpsellBannerProps, "variant">) => (
    <MonetizationUpsellBanner {...props} variant="trial-ending" />
  )
);

export const UsageLimitBanner = memo(
  (props: Omit<MonetizationUpsellBannerProps, "variant">) => (
    <MonetizationUpsellBanner {...props} variant="usage-limit" />
  )
);

export const PremiumFeatureBanner = memo(
  (props: Omit<MonetizationUpsellBannerProps, "variant">) => (
    <MonetizationUpsellBanner {...props} variant="premium-feature" />
  )
);

export const SpecialOfferBanner = memo(
  (props: Omit<MonetizationUpsellBannerProps, "variant">) => (
    <MonetizationUpsellBanner {...props} variant="special-offer" />
  )
);

export const UpgradePromptBanner = memo(
  (props: Omit<MonetizationUpsellBannerProps, "variant">) => (
    <MonetizationUpsellBanner {...props} variant="upgrade-prompt" />
  )
);

TrialEndingBanner.displayName = "TrialEndingBanner";
UsageLimitBanner.displayName = "UsageLimitBanner";
PremiumFeatureBanner.displayName = "PremiumFeatureBanner";
SpecialOfferBanner.displayName = "SpecialOfferBanner";
UpgradePromptBanner.displayName = "UpgradePromptBanner";
