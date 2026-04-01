import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class FilmsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.film.findMany({ orderBy: { title: 'asc' } })
  }
}
