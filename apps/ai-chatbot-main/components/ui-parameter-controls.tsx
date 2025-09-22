'use client'

import { useState, memo } from 'react'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

type ParameterControlsProps = {
  className?: string
  initialTemperature?: number
  initialTopP?: number
  onParameterChange?: (params: { temperature: number; topP: number }) => void
}

const ParameterControls = memo(
  ({
    className,
    initialTemperature = 0.7,
    initialTopP = 0.9,
    onParameterChange
  }: ParameterControlsProps) => {
    const [temperature, setTemperature] = useState(initialTemperature)
    const [topP, setTopP] = useState(initialTopP)

    const handleTemperatureChange = (value: number[]) => {
      const newTemp = value[0]
      setTemperature(newTemp)
      if (onParameterChange) {
        onParameterChange({ temperature: newTemp, topP })
      }
    }

    const handleTopPChange = (value: number[]) => {
      const newTopP = value[0]
      setTopP(newTopP)
      if (onParameterChange) {
        onParameterChange({ temperature, topP: newTopP })
      }
    }

    return (
      <div className={cn('grid gap-4', className)} data-testid="parameter-controls">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="temperature">Temperature</Label>
            <span className="text-muted-foreground text-sm">{temperature.toFixed(2)}</span>
          </div>
          <Slider
            id="temperature"
            min={0}
            max={1}
            step={0.01}
            value={[temperature]}
            onValueChange={handleTemperatureChange}
            aria-label="Temperature"
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="top-p">Top P</Label>
            <span className="text-muted-foreground text-sm">{topP.toFixed(2)}</span>
          </div>
          <Slider
            id="top-p"
            min={0}
            max={1}
            step={0.01}
            value={[topP]}
            onValueChange={handleTopPChange}
            aria-label="Top P"
          />
        </div>
      </div>
    )
  }
)

ParameterControls.displayName = 'ParameterControls'

export { ParameterControls }
