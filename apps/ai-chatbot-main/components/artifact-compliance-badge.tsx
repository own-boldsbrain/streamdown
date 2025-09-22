"use client";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Shield,
  ShieldCheck,
  Star,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type ComplianceStatus =
  | "compliant"
  | "pending"
  | "non-compliant"
  | "expired";

export type ComplianceCertificate = {
  id: string;
  name: string;
  issuer: string;
  status: ComplianceStatus;
  issuedAt: Date;
  expiresAt?: Date;
  score: number; // 0-100
  requirements: ComplianceRequirement[];
  documentUrl?: string;
};

export type ComplianceRequirement = {
  id: string;
  name: string;
  description: string;
  status: "met" | "pending" | "failed";
  evidence?: string;
};

export type ArtifactComplianceBadgeProps = {
  certificates: ComplianceCertificate[];
  isLoading?: boolean;
  className?: string;
  showExport?: boolean;
  showDownload?: boolean;
  onExport?: () => void;
  onDownload?: (certificateId: string) => void;
  isPremiumUser?: boolean;
};

const COMPLIANCE_STATUS_CONFIG = {
  compliant: {
    label: "Conforme",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: CheckCircle,
  },
  pending: {
    label: "Pendente",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    icon: Clock,
  },
  "non-compliant": {
    label: "Não Conforme",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: Shield,
  },
  expired: {
    label: "Expirado",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    icon: Shield,
  },
} as const;

const getComplianceIcon = (status: ComplianceStatus) => {
  const config = COMPLIANCE_STATUS_CONFIG[status];
  const Icon = config.icon;
  return <Icon className={cn("h-4 w-4", config.color)} />;
};

const PERCENTAGE_MULTIPLIER = 100;
const DECIMAL_PLACES = 1;
const ANIMATION_DELAY_STEP = 0.1;
const COMPLIANCE_MAX_SCORE = 100;
const REQUIREMENT_ANIMATION_DELAY = 0.05;

const formatPercentage = (value: number): string => {
  return `${(value * PERCENTAGE_MULTIPLIER).toFixed(DECIMAL_PLACES)}%`;
};

const generateCertificateKey = (
  cert: ComplianceCertificate,
  index: number
): string => {
  return `cert-${cert.id}-${index}`;
};

const generateRequirementKey = (
  req: ComplianceRequirement,
  index: number
): string => {
  return `req-${req.id}-${index}`;
};

const getOverallComplianceStatus = (
  compliantCount: number,
  nonCompliantCount: number,
  pendingCount: number,
  totalCertificates: number
): ComplianceStatus => {
  if (compliantCount === totalCertificates && totalCertificates > 0) {
    return "compliant";
  }
  if (nonCompliantCount > 0) {
    return "non-compliant";
  }
  if (pendingCount > 0) {
    return "pending";
  }
  return "compliant";
};

export const ArtifactComplianceBadge: React.FC<
  ArtifactComplianceBadgeProps
> = ({
  certificates,
  isLoading = false,
  className,
  showExport = true,
  showDownload = true,
  onExport,
  onDownload,
  isPremiumUser = false,
}) => {
  // Calculate summary metrics
  const compliantCount = certificates.filter(
    (c) => c.status === "compliant"
  ).length;
  const pendingCount = certificates.filter(
    (c) => c.status === "pending"
  ).length;
  const nonCompliantCount = certificates.filter(
    (c) => c.status === "non-compliant"
  ).length;
  const averageScore =
    certificates.length > 0
      ? certificates.reduce((sum, c) => sum + c.score, 0) / certificates.length
      : 0;

  const overallCompliance = getOverallComplianceStatus(
    compliantCount,
    nonCompliantCount,
    pendingCount,
    certificates.length
  );

  const renderCertificateCard = (
    certificate: ComplianceCertificate,
    index: number
  ) => {
    const config = COMPLIANCE_STATUS_CONFIG[certificate.status];
    const metRequirements = certificate.requirements.filter(
      (r) => r.status === "met"
    ).length;
    const totalRequirements = certificate.requirements.length;
    const compliancePercentage =
      totalRequirements > 0
        ? (metRequirements / totalRequirements) * PERCENTAGE_MULTIPLIER
        : 0;

    return (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        key={generateCertificateKey(certificate, index)}
        transition={{ delay: index * ANIMATION_DELAY_STEP }}
      >
        <Card className={cn("border-2", config.borderColor, config.bgColor)}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-3">
                {getComplianceIcon(certificate.status)}
                <div>
                  <h4 className="font-semibold">{certificate.name}</h4>
                  <p className="text-muted-foreground text-sm">
                    {certificate.issuer}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    certificate.status === "compliant" ? "default" : "secondary"
                  }
                >
                  {config.label}
                </Badge>
                {showDownload && certificate.documentUrl && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => onDownload?.(certificate.id)}
                          size="sm"
                          variant="outline"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Baixar certificado</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Certificate Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Pontuação de Conformidade</span>
                <span className="font-bold">{certificate.score}/100</span>
              </div>
              <Progress className="h-2" value={certificate.score} />
            </div>

            {/* Requirements Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Requisitos Atendidos</span>
                <span className="font-bold">
                  {metRequirements}/{totalRequirements}
                </span>
              </div>
              <Progress className="h-2" value={compliancePercentage} />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Emitido em:</span>
                <p className="font-medium">
                  {formatDistanceToNow(certificate.issuedAt, {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </div>
              {certificate.expiresAt && (
                <div>
                  <span className="text-muted-foreground">Expira em:</span>
                  <p className="font-medium">
                    {formatDistanceToNow(certificate.expiresAt, {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Requirements List */}
            <div className="space-y-3">
              <h5 className="font-medium text-sm">Requisitos</h5>
              <div className="space-y-2">
                {certificate.requirements.map((requirement, reqIndex) => (
                  <motion.div
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 rounded-lg bg-white/50 p-2"
                    initial={{ opacity: 0, x: -10 }}
                    key={generateRequirementKey(requirement, reqIndex)}
                    transition={{
                      delay:
                        index * ANIMATION_DELAY_STEP +
                        reqIndex * REQUIREMENT_ANIMATION_DELAY,
                    }}
                  >
                    <div className="mt-0.5">
                      {requirement.status === "met" && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {requirement.status === "pending" && (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      )}
                      {requirement.status === "failed" && (
                        <Shield className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm">{requirement.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {requirement.description}
                      </p>
                      {requirement.evidence && (
                        <p className="mt-1 text-blue-600 text-xs">
                          Evidência: {requirement.evidence}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 font-semibold text-lg">
            <Award className="h-5 w-5" />
            Certificações de Conformidade
          </h3>
          <p className="text-muted-foreground text-sm">
            Verificação de conformidade regulatória para propostas solares
          </p>
        </div>
        <div className="flex items-center gap-2">
          {showExport && (
            <Button onClick={onExport} size="sm" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Exportar Relatório
            </Button>
          )}
        </div>
      </div>

      {/* Overall Status */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {getComplianceIcon(overallCompliance)}
                <span className="font-semibold text-lg">Status Geral</span>
              </div>
              <Badge
                className="text-sm"
                variant={
                  overallCompliance === "compliant" ? "default" : "secondary"
                }
              >
                {COMPLIANCE_STATUS_CONFIG[overallCompliance].label}
              </Badge>
            </div>
            <div className="text-right">
              <div className="font-bold text-2xl">
                {formatPercentage(averageScore / COMPLIANCE_MAX_SCORE)}
              </div>
              <div className="text-muted-foreground text-sm">
                Conformidade Média
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-muted-foreground text-sm">
                  Certificações
                </p>
                <p className="font-bold text-2xl">{certificates.length}</p>
              </div>
              <Award className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-muted-foreground text-sm">
                  Conformes
                </p>
                <p className="font-bold text-2xl text-green-600">
                  {compliantCount}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-muted-foreground text-sm">
                  Pendentes
                </p>
                <p className="font-bold text-2xl text-yellow-600">
                  {pendingCount}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-muted-foreground text-sm">
                  Não Conformes
                </p>
                <p className="font-bold text-2xl text-red-600">
                  {nonCompliantCount}
                </p>
              </div>
              <Shield className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Certificates List */}
      {certificates.length > 0 ? (
        <div className="space-y-6">
          {certificates.map((certificate, index) =>
            renderCertificateCard(certificate, index)
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-green-500" />
            <h4 className="mb-2 font-semibold">Nenhuma Certificação</h4>
            <p className="text-muted-foreground text-sm">
              Não há certificações de conformidade disponíveis no momento.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Premium Features */}
      {!isPremiumUser && certificates.some((c) => c.status === "compliant") && (
        <div className="rounded-lg border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-yellow-800">
            <Star className="h-5 w-5" />
            <span className="font-semibold">Recursos Premium</span>
          </div>
          <p className="text-sm text-yellow-700">
            Faça upgrade para acessar relatórios detalhados de conformidade,
            histórico completo de auditorias e alertas automáticos de expiração.
          </p>
        </div>
      )}

      {/* Loading State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-8"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-4 w-4 animate-spin" />
              <span>Verificando conformidade...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

ArtifactComplianceBadge.displayName = "ArtifactComplianceBadge";
