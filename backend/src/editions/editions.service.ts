import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class EditionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.edition.findMany({ orderBy: { year: 'desc' } })
  }

  async findOne(id: string) {
    const edition = await this.prisma.edition.findUnique({ where: { id } })
    if (!edition) throw new NotFoundException('Edition not found')
    return edition
  }
}
