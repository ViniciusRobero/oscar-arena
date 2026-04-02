'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Edition, RankEntry } from '@/types'

export default function RankingPage() {
  const t = useTranslations()

  const [ranking, setRanking] = useState<RankEntry[]>([])
  const [editionName, setEditionName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = () => {
    setIsLoading(true)
    setError(false)
    api
      .get<Edition[]>('/editions')
      .then((res) => {
        const edition = res.data.find((e) => e.isCurrent) ?? res.data[0]
        if (!edition) {
          setIsLoading(false)
          return
        }
        setEditionName(edition.name)
        return api.get<RankEntry[]>(`/score?editionId=${edition.id}`)
      })
      .then((res) => {
        if (res) setRanking(res.data)
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false))
  }

  useEffect(load, [])

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
      <div>
        <h1 className="text-2xl font-bold">{t('score.title')}</h1>
        {editionName && <p className="text-sm text-muted-foreground">{editionName}</p>}
      </div>

      {ranking.length === 0 ? (
        <p className="text-muted-foreground">{t('score.empty')}</p>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="grid grid-cols-[1.5rem_1fr_3.5rem_3.5rem] gap-2 text-xs font-medium uppercase text-muted-foreground sm:grid-cols-[2rem_1fr_4rem_4rem_4rem]">
              <span>{t('score.rank')}</span>
              <span>{t('score.player')}</span>
              <span className="text-right">{t('score.correct')}</span>
              <span className="hidden text-right sm:block">{t('score.total')}</span>
              <span className="text-right">{t('score.accuracy')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y p-0">
            {ranking.map((entry) => (
              <div
                key={entry.userId}
                className="grid grid-cols-[1.5rem_1fr_3.5rem_3.5rem] items-center gap-2 px-4 py-3 sm:grid-cols-[2rem_1fr_4rem_4rem_4rem] sm:px-6"
              >
                <span className="text-sm font-semibold text-muted-foreground">{entry.rank}</span>
                <span className="truncate text-sm font-medium">{entry.name}</span>
                <span className="text-right text-sm">{entry.correctPredictions}</span>
                <span className="hidden text-right text-sm text-muted-foreground sm:block">
                  {entry.totalPredictions}
                </span>
                <span className="text-right text-sm font-medium">{entry.accuracy}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
