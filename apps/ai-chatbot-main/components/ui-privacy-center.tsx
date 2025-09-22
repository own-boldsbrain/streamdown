'use client'

import { useState, memo } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Shield } from 'lucide-react'

type PrivacySettings = {
  saveHistory: boolean
  shareAnonymousData: boolean
  thirdPartyIntegrations: boolean
  cloudStorage: boolean
}

type PrivacyCenterProps = {
  initialSettings?: Partial<PrivacySettings>
  onSave?: (settings: PrivacySettings) => void
}

const defaultSettings: PrivacySettings = {
  saveHistory: true,
  shareAnonymousData: true,
  thirdPartyIntegrations: false,
  cloudStorage: true
}

const UIPrivacyCenter = memo(
  ({ initialSettings, onSave }: PrivacyCenterProps) => {
    const [open, setOpen] = useState(false)
    const [settings, setSettings] = useState<PrivacySettings>({
      ...defaultSettings,
      ...initialSettings
    })

    const handleToggle = (key: keyof PrivacySettings) => {
      setSettings(prev => ({
        ...prev,
        [key]: !prev[key]
      }))
    }

    const handleSave = () => {
      if (onSave) {
        onSave(settings)
      }
      setOpen(false)
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Privacy Settings">
            <Shield className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configurações de Privacidade</DialogTitle>
            <DialogDescription>
              Gerencie como seus dados são armazenados e compartilhados.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="save-history">Salvar histórico de chat</Label>
                <p className="text-muted-foreground text-sm">
                  Salva suas conversas para referência futura
                </p>
              </div>
              <Switch
                id="save-history"
                checked={settings.saveHistory}
                onCheckedChange={() => handleToggle('saveHistory')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="anonymous-data">Dados anônimos</Label>
                <p className="text-muted-foreground text-sm">
                  Compartilha dados anônimos para melhorar o serviço
                </p>
              </div>
              <Switch
                id="anonymous-data"
                checked={settings.shareAnonymousData}
                onCheckedChange={() => handleToggle('shareAnonymousData')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="third-party">Integrações de terceiros</Label>
                <p className="text-muted-foreground text-sm">
                  Permite o uso de seus dados em integrações externas
                </p>
              </div>
              <Switch
                id="third-party"
                checked={settings.thirdPartyIntegrations}
                onCheckedChange={() => handleToggle('thirdPartyIntegrations')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="cloud-storage">Armazenamento na nuvem</Label>
                <p className="text-muted-foreground text-sm">
                  Armazena seus dados de forma segura na nuvem
                </p>
              </div>
              <Switch
                id="cloud-storage"
                checked={settings.cloudStorage}
                onCheckedChange={() => handleToggle('cloudStorage')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSave}>
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
)

UIPrivacyCenter.displayName = 'UIPrivacyCenter'

export { UIPrivacyCenter }