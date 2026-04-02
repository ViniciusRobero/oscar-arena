'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Prediction } from '@/types'

export default function PredictionsPage() {
  const t = useTranslations()

  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)

  const load = () => {
    setIsLoading(true)
    api
      .get<Prediction[]>('/predictions')
      .then((res) => setPredictions(res.data))
      .catch(() => setError(true))
      .finally(() => setIsLoading(false))
  }

  useEffect(load, [])

  const handleRemove = async (id: string) => {
    setRemoving(id)
    try {
      await api.delete(`/predictions/${id}`)
      setPredictions((prev) => prev.filter((p) => p.id !== id))
    } finally {
      setRemoving(null)
    }
  }

  if (isLoading) return <p className="text-muted-foreground">{t('common.loading')}</p>

  if (error)
    return (
      <div className="space-y-2">
        <p className="text-destructive">{t('common.error')}</p>
        <Button variant="outline" size="sm" onClick={load}>
          {t('common.tryAgain')}
        </Button>
      </div>
    )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('predictions.title')}</h1>

      {predictions.length === 0 ? (
        <p className="text-muted-foreground">{t('predictions.empty')}</p>
      ) : (
        <div className="space-y-3">
          {predictions.map((p) => (
            <Card key={p.id}>
              <CardContent className="flex items-center gap-4 p-4">
                {p.nomination.film.posterUrl ? (
                  <Image
                    src={p.nomination.film.posterUrl}
                    alt={p.nomination.film.title}
                    width={36}
                    height={54}
                    className="rounded object-cover"
                  />
                ) : (
                  <div className="flex h-[54px] w-[36px] shrink-0 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                    ?
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{p.nomination.film.title}</p>
                  <p className="text-sm text-muted-foreground">{p.nomination.category.name}</p>
                  {p.nomination.isWinner && (
                    <span className="mt-1 inline-block rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                      {t('predictions.correct')}
                    </span>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-muted-foreground"
                  disabled={removing === p.id}
                  onClick={() => handleRemove(p.id)}
                >
                  {t('predictions.remove')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
