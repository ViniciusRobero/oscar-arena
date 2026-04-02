import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePredictionDto } from './dto/create-prediction.dto'
import { UpdatePredictionDto } from './dto/update-prediction.dto'

@Injectable()
export class PredictionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.prediction.findMany({
      where: { userId },
      include: {
        nomination: {
          include: { film: true, category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async create(userId: string, dto: CreatePredictionDto) {
    const nomination = await this.prisma.nomination.findUnique({
      where: { id: dto.nominationId },
    })
    if (!nomination) throw new NotFoundException('Nomination not found')

    try {
      return await this.prisma.prediction.create({
        data: { userId, nominationId: dto.nominationId },
        include: {
          nomination: { include: { film: true, category: true } },
        },
      })
    } catch (e: any) {
      if (e?.code === 'P2002') {
        throw new ConflictException('You already have a prediction for this nomination')
      }
      throw e
    }
  }

  async update(userId: string, id: string, dto: UpdatePredictionDto) {
    const prediction = await this.prisma.prediction.findUnique({ where: { id } })
    if (!prediction) throw new NotFoundException('Prediction not found')
    if (prediction.userId !== userId) throw new ForbiddenException()

    try {
      return await this.prisma.prediction.update({
        where: { id },
        data: { nominationId: dto.nominationId },
        include: {
          nomination: { include: { film: true, category: true } },
        },
      })
    } catch (e: any) {
      if (e?.code === 'P2002') {
        throw new ConflictException('You already have a prediction for this nomination')
      }
      throw e
    }
  }

  async remove(userId: string, id: string) {
    const prediction = await this.prisma.prediction.findUnique({ where: { id } })
    if (!prediction) throw new NotFoundException('Prediction not found')
    if (prediction.userId !== userId) throw new ForbiddenException()

    await this.prisma.prediction.delete({ where: { id } })
    return { message: 'Prediction deleted' }
  }
}
