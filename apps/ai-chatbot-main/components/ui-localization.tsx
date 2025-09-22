'use client'

import { useState, createContext, useContext, useMemo, memo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'

// Define available locales and their labels
const locales = [
  { value: 'en', label: 'English' },
  { value: 'pt-br', label: 'Português (Brasil)' },
  { value: 'es', label: 'Español' }
]

// A simple dictionary for demonstration purposes
const translations: Record<string, Record<string, string>> = {
  en: {
    changeLanguage: 'Change Language'
  },
  'pt-br': {
    changeLanguage: 'Mudar Idioma'
  },
  es: {
    changeLanguage: 'Cambiar Idioma'
  }
}

type LocalizationContextType = {
  locale: string
  setLocale: (locale: string) => void
  t: (key: string) => string
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(
  undefined
)

export const useLocalization = () => {
  const context = useContext(LocalizationContext)
  if (!context) {
    throw new Error(
      'useLocalization must be used within a LocalizationProvider'
    )
  }
  return context
}

export const LocalizationProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [locale, setLocale] = useState('en')

  const t = useCallback(
    (key: string) => {
      return translations[locale]?.[key] || key
    },
    [locale]
  )

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t])

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  )
}

const UILocalization = memo(() => {
  const { locale, setLocale, t } = useLocalization()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label={t('changeLanguage')}>
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={locale} onValueChange={setLocale}>
          {locales.map(loc => (
            <DropdownMenuRadioItem key={loc.value} value={loc.value}>
              {loc.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})

UILocalization.displayName = 'UILocalization'

export { UILocalization }
