import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ScoreService {
  constructor(private readonly prisma: PrismaService) {}

  async getRanking(editionId: string) {
    const edition = await this.prisma.edition.findUnique({ where: { id: editionId } })
    if (!edition) throw new NotFoundException('Edition not found')

    const predictions = await this.prisma.prediction.findMany({
      where: { nomination: { editionId } },
      include: {
        user: { select: { id: true, name: true } },
        nomination: { select: { isWinner: true } },
      },
    })

    const map = new Map<string, { userId: string; name: string; total: number; correct: number }>()

    for (const p of predictions) {
      if (!map.has(p.userId)) {
        map.set(p.userId, { userId: p.userId, name: p.user.name, total: 0, correct: 0 })
      }
      const entry = map.get(p.userId)!
      entry.total++
      if (p.nomination.isWinner) entry.correct++
    }

    return Array.from(map.values())
      .map((e) => ({
        userId: e.userId,
        name: e.name,
        totalPredictions: e.total,
        correctPredictions: e.correct,
        accuracy: e.total > 0 ? Math.round((e.correct / e.total) * 100) : 0,
      }))
      .sort((a, b) => b.correctPredictions - a.correctPredictions || b.accuracy - a.accuracy)
      .map((e, i) => ({ rank: i + 1, ...e }))
  }
}
