import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { ScoreController } from './score.controller'
import { ScoreService } from './score.service'

@Module({
  imports: [AuthModule],
  controllers: [ScoreController],
  providers: [ScoreService],
})
export class ScoreModule {}
