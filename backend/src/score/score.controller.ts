import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ScoreService } from './score.service'

@ApiTags('score')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Get()
  @ApiOperation({ summary: 'Get ranking for an edition' })
  @ApiQuery({ name: 'editionId', required: true, description: 'Edition UUID' })
  @ApiResponse({ status: 200, description: 'Returns ranked list of users with prediction scores' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Edition not found' })
  getRanking(@Query('editionId') editionId: string) {
    return this.scoreService.getRanking(editionId)
  }
}
