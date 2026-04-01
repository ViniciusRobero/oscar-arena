'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

const locales = [
  { code: 'pt', label: 'PT', flag: '🇧🇷' },
  { code: 'en', label: 'EN', flag: '🇺🇸' },
]

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <div className="flex gap-1">
      {locales.map(({ code, label, flag }) => (
        <button
          key={code}
          onClick={() => switchLocale(code)}
          className={`rounded px-2 py-1 text-sm font-medium transition-colors ${
            locale === code
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          {flag} {label}
        </button>
      ))}
    </div>
  )
}
