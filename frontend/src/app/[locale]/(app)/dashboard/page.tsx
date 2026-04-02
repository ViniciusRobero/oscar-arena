'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import api from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Edition, Prediction } from '@/types'

export default function DashboardPage() {
  const t = useTranslations()
  const locale = useLocale()
  const { user } = useAuth()

  const [edition, setEdition] = useState<Edition | null>(null)
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    Promise.all([api.get<Edition[]>('/editions'), api.get<Prediction[]>('/predictions')])
      .then(([edRes, predRes]) => {
        setEdition(edRes.data.find((e) => e.isCurrent) ?? edRes.data[0] ?? null)
        setPredictions(predRes.data)
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return <p className="text-muted-foreground">{t('common.loading')}</p>
  }

  if (error) {
    return (
      <div className="space-y-2">
        <p className="text-destructive">{t('common.error')}</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          {t('common.tryAgain')}
        </Button>
      </div>
    )
  }

  const editionPredictions = edition
    ? predictions.filter((p) => p.nomination.editionId === edition.id)
    : []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{user ? `Olá, ${user.name}` : t('nav.home')}</h1>

      {edition ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              {t('dashboard.currentEdition')}
              {edition.isCurrent && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {t('editions.current')}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xl font-semibold">{edition.name}</p>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.myPredictions')}:{' '}
              <span className="font-medium text-foreground">{editionPredictions.length}</span>
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm">
                <Link href={`/${locale}/editions/${edition.id}`}>
                  {t('dashboard.makePredictions')}
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/${locale}/ranking`}>{t('dashboard.viewRanking')}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className="text-muted-foreground">{t('dashboard.noCurrentEdition')}</p>
      )}
    </div>
  )
}
