'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useAuth } from '@/contexts/AuthContext'
import { LocaleSwitcher } from './LocaleSwitcher'
import { ThemeToggle } from './ThemeToggle'
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

  const linkClass = (href: string) =>
    `rounded-md px-3 py-1.5 text-sm transition-colors ${
      pathname.startsWith(href)
        ? 'bg-accent text-accent-foreground font-medium'
        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
    }`

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      {/* Main row */}
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4">
        <Link
          href={`/${locale}/dashboard`}
          className="shrink-0 text-base font-semibold tracking-tight hover:opacity-80"
        >
          Oscar Arena
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden flex-1 items-center gap-1 sm:flex">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className={linkClass(href)}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Controls */}
        <div className="ml-auto flex items-center gap-1 sm:ml-0">
          <ThemeToggle />
          <LocaleSwitcher />
          {user && (
            <>
              <span className="hidden text-sm text-muted-foreground lg:inline">{user.name}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                {t('logout')}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile nav row */}
      <nav className="flex border-t sm:hidden">
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex-1 py-2 text-center text-xs font-medium transition-colors ${
              pathname.startsWith(href)
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
