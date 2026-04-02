'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Edition, Nomination, Prediction } from '@/types'

interface CategoryGroup {
  categoryId: string
  categoryName: string
  nominations: Nomination[]
}

export default function EditionDetailPage() {
  const t = useTranslations()
  const { id } = useParams<{ id: string }>()

  const [edition, setEdition] = useState<Edition | null>(null)
  const [groups, setGroups] = useState<CategoryGroup[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [pending, setPending] = useState<string | null>(null)

  const loadPredictions = useCallback(() => {
    return api.get<Prediction[]>('/predictions').then((res) => setPredictions(res.data))
  }, [])

  useEffect(() => {
    Promise.all([
      api.get<Edition>(`/editions/${id}`),
      api.get<Nomination[]>(`/nominations?editionId=${id}`),
      api.get<Prediction[]>('/predictions'),
    ])
      .then(([edRes, nomRes, predRes]) => {
        setEdition(edRes.data)

        const map = new Map<string, CategoryGroup>()
        for (const n of nomRes.data) {
          if (!map.has(n.categoryId)) {
            map.set(n.categoryId, {
              categoryId: n.categoryId,
              categoryName: n.category.name,
              nominations: [],
            })
          }
          map.get(n.categoryId)!.nominations.push(n)
        }
        setGroups(Array.from(map.values()))
        setPredictions(predRes.data)
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false))
  }, [id, loadPredictions])

  const predByCategory = predictions
    .filter((p) => p.nomination.editionId === id)
    .reduce<Record<string, Prediction>>((acc, p) => {
      acc[p.nomination.categoryId] = p
      return acc
    }, {})

  const handleSelect = async (nomination: Nomination) => {
    const existing = predByCategory[nomination.categoryId]
    if (existing?.nominationId === nomination.id) return
    setPending(nomination.id)
    try {
      if (existing) {
        await api.put(`/predictions/${existing.id}`, { nominationId: nomination.id })
      } else {
        await api.post('/predictions', { nominationId: nomination.id })
      }
      await loadPredictions()
    } finally {
      setPending(null)
    }
  }

  const handleRemove = async (categoryId: string) => {
    const existing = predByCategory[categoryId]
    if (!existing) return
    setPending(existing.id)
    try {
      await api.delete(`/predictions/${existing.id}`)
      await loadPredictions()
    } finally {
      setPending(null)
    }
  }

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
      <div>
        <h1 className="text-2xl font-bold">{edition?.name}</h1>
        {edition?.isCurrent && (
          <span className="mt-1 inline-block rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
            {t('editions.current')}
          </span>
        )}
      </div>

      <div className="space-y-6">
        {groups.map(({ categoryId, categoryName, nominations }) => {
          const picked = predByCategory[categoryId]
          return (
            <section key={categoryId}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{categoryName}</h2>
                {picked && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    disabled={pending === picked.id}
                    onClick={() => handleRemove(categoryId)}
                  >
                    {t('predictions.remove')}
                  </Button>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {nominations.map((nom) => {
                  const isSelected = picked?.nominationId === nom.id
                  const isProcessing = pending === nom.id || pending === picked?.id
                  return (
                    <Card
                      key={nom.id}
                      className={`cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-primary' : 'hover:border-primary/50'
                      }`}
                      onClick={() => !isProcessing && handleSelect(nom)}
                    >
                      <CardContent className="flex items-center gap-3 p-3">
                        {nom.film.posterUrl ? (
                          <Image
                            src={nom.film.posterUrl}
                            alt={nom.film.title}
                            width={40}
                            height={60}
                            className="rounded object-cover"
                          />
                        ) : (
                          <div className="flex h-[60px] w-[40px] shrink-0 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                            ?
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{nom.film.title}</p>
                          {isSelected && (
                            <p className="mt-0.5 text-xs font-medium text-primary">
                              ✓ {t('editions.myPick')}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
