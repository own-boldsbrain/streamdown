'use client'

import { useState, memo } from 'react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

type SafetyTogglesProps = {
  className?: string
  initialSettings?: Record<string, boolean>
  onSettingsChange?: (settings: Record<string, boolean>) => void
}

const safetyCategories = [
  { id: 'hate', label: 'Hate Speech' },
  { id: 'harassment', label: 'Harassment' },
  { id: 'sexual', label: 'Sexually Explicit' },
  { id: 'dangerous', label: 'Dangerous Content' }
]

const SafetyToggles = memo(
  ({
    className,
    initialSettings = {},
    onSettingsChange
  }: SafetyTogglesProps) => {
    const [settings, setSettings] = useState(() => {
      const defaultSettings = safetyCategories.reduce(
        (acc, category) => {
          acc[category.id] = initialSettings[category.id] ?? true
          return acc
        },
        {} as Record<string, boolean>
      )
      return defaultSettings
    })

    const handleToggle = (id: string) => {
      const newSettings = { ...settings, [id]: !settings[id] }
      setSettings(newSettings)
      if (onSettingsChange) {
        onSettingsChange(newSettings)
      }
    }

    return (
      <div className={cn('grid gap-4', className)} data-testid="safety-toggles">
        {safetyCategories.map(category => (
          <div
            key={category.id}
            className="flex items-center justify-between rounded-lg border p-3 shadow-sm"
          >
            <Label htmlFor={category.id} className="cursor-pointer">
              {category.label}
            </Label>
            <Switch
              id={category.id}
              checked={settings[category.id]}
              onCheckedChange={() => handleToggle(category.id)}
              aria-label={`Toggle ${category.label} filter`}
            />
          </div>
        ))}
      </div>
    )
  }
)

SafetyToggles.displayName = 'SafetyToggles'

export { SafetyToggles }
