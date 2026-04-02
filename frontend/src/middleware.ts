import createIntlMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createIntlMiddleware({
  locales: ['pt', 'en'],
  defaultLocale: 'pt',
  localePrefix: 'always',
})

const protectedPaths = ['/dashboard', '/editions', '/predictions', '/ranking']

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const locale = pathname.match(/^\/(pt|en)/)?.[1] ?? 'pt'
  const pathnameWithoutLocale = pathname.replace(/^\/(pt|en)/, '') || '/'

  const isProtected = protectedPaths.some((p) => pathnameWithoutLocale.startsWith(p))

  if (isProtected && !request.cookies.get('auth_token')?.value) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
