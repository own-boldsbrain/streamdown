"use client";

import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Download,
  Share2,
  Eye,
  Copy,
  Mail,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ActionType = "export" | "share" | "view";

export type ArtifactActionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  actionType: ActionType;
  artifactType: "risk" | "anomaly" | "compliance" | "tool";
  data?: Record<string, unknown>;
};

// --- Constantes para Magic Numbers ---
const COPIED_TIMEOUT_MS = 2000;

const ACTION_CONFIG = {
  export: {
    title: "Exportar Relatório",
    description: "Escolha o formato e baixe o relatório.",
    icon: Download,
    color: "text-blue-600",
  },
  share: {
    title: "Compartilhar Análise",
    description: "Compartilhe este relatório com sua equipe.",
    icon: Share2,
    color: "text-green-600",
  },
  view: {
    title: "Visualizar Detalhes",
    description: "Veja informações detalhadas sobre este item.",
    icon: Eye,
    color: "text-purple-600",
  },
} as const;

const ARTIFACT_LABELS = {
  risk: "Análise de Risco",
  anomaly: "Relatório de Anomalias",
  compliance: "Certificações de Conformidade",
  tool: "Inspetor de Ferramentas IA",
} as const;

export const ArtifactActionModal = memo<ArtifactActionModalProps>(
  ({ isOpen, onClose, actionType, artifactType, data }) => {
    const [exportFormat, setExportFormat] = useState<"pdf" | "csv" | "json">(
      "pdf"
    );
    const [shareMethod, setShareMethod] = useState<
      "email" | "link" | "slack" | "teams"
    >("email");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [copied, setCopied] = useState(false);

    const config = ACTION_CONFIG[actionType];
    const artifactLabel = ARTIFACT_LABELS[artifactType];
    const Icon = config.icon;

    const handleExport = () => {
      // Simulação de export
      const filename = `${artifactType}-report-${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      alert(`Exportando ${filename}...`);
      onClose();
    };

    const handleShare = () => {
      // Simulação de compartilhamento
      const shareUrl = `https://app.streamdown.com/share/${artifactType}/${Date.now()}`;

      switch (shareMethod) {
        case "email":
          if (email) {
            alert(`Enviando email para ${email} com link: ${shareUrl}`);
          }
          break;
        case "link":
          navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), COPIED_TIMEOUT_MS);
          return;
        case "slack":
        case "teams":
          alert(`Compartilhando no ${shareMethod}: ${shareUrl}`);
          break;
        default:
          break;
      }
      onClose();
    };

    const handleViewDetails = () => {
      // Simulação de visualização detalhada
      alert(`Visualizando detalhes de ${artifactLabel}:\n${JSON.stringify(data, null, 2)}`);
      onClose();
    };

    const renderContent = () => {
      switch (actionType) {
        case "export":
          return (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="format">Formato de Exportação</Label>
                <select
                  id="format"
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as typeof exportFormat)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  aria-label="Formato de Exportação"
                >
                  <option value="pdf">PDF (Recomendado)</option>
                  <option value="csv">CSV (Dados)</option>
                  <option value="json">JSON (Dados Brutos)</option>
                </select>
              </div>
              <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20">
                <p className="text-blue-800 text-sm dark:text-blue-200">
                  O relatório incluirá todos os dados atuais, gráficos e recomendações.
                </p>
              </div>
            </div>
          );

        case "share":
          return (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="method">Método de Compartilhamento</Label>
                <select
                  id="method"
                  value={shareMethod}
                  onChange={(e) => setShareMethod(e.target.value as typeof shareMethod)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  aria-label="Método de Compartilhamento"
                >
                  <option value="email">Email</option>
                  <option value="link">Link</option>
                  <option value="slack">Slack</option>
                  <option value="teams">Microsoft Teams</option>
                </select>
              </div>

              {shareMethod === "email" && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email do Destinatário</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem (Opcional)</Label>
                <Textarea
                  id="message"
                  placeholder="Adicione uma mensagem personalizada..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
              </div>

                <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 dark:bg-green-950/20">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <p className="text-green-800 text-sm dark:text-green-200">
                    Link copiado para a área de transferência!
                  </p>
                </div>
            </div>
          );

        case "view":
          return (
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50">
                <h4 className="mb-2 font-semibold">{artifactLabel}</h4>
                <pre className="whitespace-pre-wrap text-gray-600 text-xs dark:text-gray-400">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
              <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-950/20">
                <p className="text-purple-800 text-sm dark:text-purple-200">
                  Esta visualização mostra os dados brutos do artefato. Para uma análise mais detalhada, considere exportar o relatório completo.
                </p>
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    const handleAction = () => {
      switch (actionType) {
        case "export":
          handleExport();
          break;
        case "share":
          handleShare();
          break;
        case "view":
          handleViewDetails();
          break;
        default:
          break;
      }
    };

    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Icon className={cn("h-5 w-5", config.color)} />
              {config.title}
            </SheetTitle>
            <SheetDescription>
              {config.description}
            </SheetDescription>
          </SheetHeader>

          <div className="py-4">
            <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-900/50">
              <p className="font-medium text-sm">{artifactLabel}</p>
              <p className="text-gray-600 text-xs dark:text-gray-400">
                {new Date().toLocaleDateString("pt-BR")}
              </p>
            </div>

            {renderContent()}
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleAction}>
              {actionType === "export" && (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </>
              )}
              {actionType === "share" &&
                (shareMethod === "link" ? (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    {copied ? "Copiado!" : "Copiar Link"}
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Compartilhar
                  </>
                ))}
              {actionType === "view" && (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Fechar
                </>
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }
);

ArtifactActionModal.displayName = "ArtifactActionModal";