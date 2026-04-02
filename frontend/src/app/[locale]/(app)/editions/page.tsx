'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Edition } from '@/types'

export default function EditionsPage() {
  const t = useTranslations()
  const locale = useLocale()

  const [editions, setEditions] = useState<Edition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    api
      .get<Edition[]>('/editions')
      .then((res) => setEditions(res.data))
      .catch(() => setError(true))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) return <p className="text-muted-foreground">{t('common.loading')}</p>

  if (error)
    return (
      <div className="space-y-2">
        <p className="text-destructive">{t('common.error')}</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          {t('common.tryAgain')}
        </Button>
      </div>
    )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('editions.title')}</h1>

      {editions.length === 0 ? (
        <p className="text-muted-foreground">{t('editions.empty')}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {editions.map((edition) => (
            <Card key={edition.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  {edition.name}
                  {edition.isCurrent && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                      {t('editions.current')}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm text-muted-foreground">{edition.year}</p>
                <Button asChild size="sm" variant="outline" className="w-full">
                  <Link href={`/${locale}/editions/${edition.id}`}>
                    {t('editions.viewDetails')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
