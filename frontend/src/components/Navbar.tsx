'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useAuth } from '@/contexts/AuthContext'
import { LocaleSwitcher } from './LocaleSwitcher'
import { Button } from './ui/button'

export function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const navLinks = [
    { href: `/${locale}/dashboard`, label: t('home') },
    { href: `/${locale}/predictions`, label: t('predictions') },
    { href: `/${locale}/ranking`, label: t('ranking') },
  ]

  const handleLogout = () => {
    logout()
    router.push(`/${locale}/login`)
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-4">
        <Link
          href={`/${locale}/dashboard`}
          className="text-base font-semibold tracking-tight hover:opacity-80"
        >
          Oscar Arena
        </Link>

        <nav className="flex flex-1 items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                pathname.startsWith(href)
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          {user && (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">{user.name}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                {t('logout')}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
