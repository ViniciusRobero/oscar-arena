import { Controller } from '@nestjs/common'
import { ScoreService } from './score.service'

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}
}
