"use client";

import { Crown, Eye, EyeOff, Lock } from "lucide-react";
import { memo, type ReactNode, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type FeatureTier = "free" | "starter" | "pro" | "enterprise";

export type GateDisplayMode = "blur" | "overlay" | "placeholder" | "hidden";

type FeatureGateProps = {
  /** The content to gate behind the feature */
  children: ReactNode;
  /** Current user tier */
  userTier: FeatureTier;
  /** Required tier to access the feature */
  requiredTier: FeatureTier;
  /** Display mode when feature is locked */
  displayMode?: GateDisplayMode;
  /** Custom title for the gate */
  title?: string;
  /** Custom description for the gate */
  description?: string;
  /** Custom upgrade CTA text */
  upgradeText?: string;
  /** Show upgrade button */
  showUpgradeButton?: boolean;
  /** Callback when upgrade is requested */
  onUpgrade?: () => void;
  /** Allow preview/teaser of the feature */
  allowPreview?: boolean;
  /** Custom preview content */
  previewContent?: ReactNode;
  /** Additional CSS classes */
  className?: string;
};

const tierHierarchy: Record<FeatureTier, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  enterprise: 3,
};

const tierLabels = {
  free: "Gratuito",
  starter: "Iniciante",
  pro: "Profissional",
  enterprise: "Empresarial",
};

const tierColors = {
  free: "text-gray-600 bg-gray-100 border-gray-200",
  starter: "text-blue-600 bg-blue-100 border-blue-200",
  pro: "text-purple-600 bg-purple-100 border-purple-200",
  enterprise: "text-green-600 bg-green-100 border-green-200",
};

const hasAccess = (
  userTier: FeatureTier,
  requiredTier: FeatureTier
): boolean => {
  return tierHierarchy[userTier] >= tierHierarchy[requiredTier];
};

const getUpgradeMessage = (requiredTier: FeatureTier): string => {
  switch (requiredTier) {
    case "starter":
      return "Faça upgrade para o plano Iniciante para desbloquear este recurso.";
    case "pro":
      return "Faça upgrade para o plano Profissional para acessar recursos avançados.";
    case "enterprise":
      return "Este recurso está disponível apenas para clientes Empresariais.";
    default:
      return "Faça upgrade para acessar este recurso.";
  }
};

export const FeatureGate = memo<FeatureGateProps>(
  ({
    children,
    userTier,
    requiredTier,
    displayMode = "overlay",
    title,
    description,
    upgradeText = "Fazer Upgrade",
    showUpgradeButton = true,
    onUpgrade,
    allowPreview = false,
    previewContent,
    className,
  }) => {
    const [showPreview, setShowPreview] = useState(false);
    const canAccess = hasAccess(userTier, requiredTier);

    if (canAccess) {
      return <>{children}</>;
    }

    const renderGateContent = () => (
      <div className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
          <Lock className="h-6 w-6 text-white" />
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-lg">
            {title || `Recurso ${tierLabels[requiredTier]}`}
          </h3>
          <p className="max-w-md text-muted-foreground text-sm">
            {description || getUpgradeMessage(requiredTier)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            className={cn("text-xs", tierColors[requiredTier])}
            variant="outline"
          >
            <Crown className="mr-1 h-3 w-3" />
            {tierLabels[requiredTier]}
          </Badge>
          {userTier !== "free" && (
            <Badge
              className={cn("text-xs", tierColors[userTier])}
              variant="secondary"
            >
              Seu plano: {tierLabels[userTier]}
            </Badge>
          )}
        </div>

        {allowPreview && previewContent && (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowPreview(!showPreview)}
              size="sm"
              variant="outline"
            >
              {showPreview ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Ocultar Preview
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Preview
                </>
              )}
            </Button>
          </div>
        )}

        {showUpgradeButton && (
          <Button
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            onClick={onUpgrade}
          >
            <Crown className="mr-2 h-4 w-4" />
            {upgradeText}
          </Button>
        )}
      </div>
    );

    const renderBlurred = () => (
      <div className={cn("relative", className)}>
        <div className="pointer-events-none opacity-50 blur-sm">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Card className="w-full max-w-md shadow-lg">
            <CardContent className="p-0">{renderGateContent()}</CardContent>
          </Card>
        </div>
      </div>
    );

    const renderOverlay = () => (
      <div className={cn("relative", className)}>
        {children}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md shadow-lg">
            <CardContent className="p-0">{renderGateContent()}</CardContent>
          </Card>
        </div>
      </div>
    );

    const renderPlaceholder = () => (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-0">{renderGateContent()}</CardContent>
      </Card>
    );

    const renderHidden = () => (
      <div className={cn("hidden", className)}>{children}</div>
    );

    const renderPreview = () => (
      <div className={cn("space-y-4", className)}>
        {showPreview && previewContent && (
          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Preview do Recurso</CardTitle>
                <Badge className="text-xs" variant="outline">
                  <Eye className="mr-1 h-3 w-3" />
                  Preview
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Esta é uma visualização limitada do recurso premium
              </CardDescription>
            </CardHeader>
            <CardContent>{previewContent}</CardContent>
          </Card>
        )}
        <Card>
          <CardContent className="p-0">{renderGateContent()}</CardContent>
        </Card>
      </div>
    );

    switch (displayMode) {
      case "blur":
        return renderBlurred();
      case "overlay":
        return renderOverlay();
      case "placeholder":
        return renderPlaceholder();
      case "hidden":
        return renderHidden();
      default:
        return allowPreview ? renderPreview() : renderPlaceholder();
    }
  }
);

FeatureGate.displayName = "FeatureGate";

// Convenience components for specific tiers
export const ProGate = memo((props: Omit<FeatureGateProps, "requiredTier">) => (
  <FeatureGate {...props} requiredTier="pro" />
));

export const EnterpriseGate = memo(
  (props: Omit<FeatureGateProps, "requiredTier">) => (
    <FeatureGate {...props} requiredTier="enterprise" />
  )
);

export const StarterGate = memo(
  (props: Omit<FeatureGateProps, "requiredTier">) => (
    <FeatureGate {...props} requiredTier="starter" />
  )
);

ProGate.displayName = "ProGate";
EnterpriseGate.displayName = "EnterpriseGate";
StarterGate.displayName = "StarterGate";

// Hook for checking feature access
export const useFeatureAccess = (
  userTier: FeatureTier,
  requiredTier: FeatureTier
): boolean => {
  return hasAccess(userTier, requiredTier);
};

// Component for inline feature gates
export const InlineFeatureGate = memo<{
  userTier: FeatureTier;
  requiredTier: FeatureTier;
  children: ReactNode;
  fallback?: ReactNode;
  onUpgrade?: () => void;
}>(({ userTier, requiredTier, children, fallback, onUpgrade }) => {
  const canAccess = hasAccess(userTier, requiredTier);

  if (canAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <span className="inline-flex items-center gap-1 text-muted-foreground">
      <Lock className="h-3 w-3" />
      <span className="text-xs">
        Disponível no plano {tierLabels[requiredTier]}
      </span>
      {onUpgrade && (
        <Button
          className="h-auto p-0 text-xs underline"
          onClick={onUpgrade}
          size="sm"
          variant="link"
        >
          Upgrade
        </Button>
      )}
    </span>
  );
});

InlineFeatureGate.displayName = "InlineFeatureGate";
