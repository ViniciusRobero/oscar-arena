import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class NominationsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(editionId: string) {
    if (!editionId) throw new BadRequestException('editionId query param is required')

    return this.prisma.nomination.findMany({
      where: { editionId },
      include: {
        film: true,
        category: true,
      },
      orderBy: { category: { name: 'asc' } },
    })
  }
}
