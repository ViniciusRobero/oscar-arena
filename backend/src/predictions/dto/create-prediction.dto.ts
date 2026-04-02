import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreatePredictionDto {
  @ApiProperty({ description: 'Nomination UUID to predict as winner' })
  @IsString()
  nominationId: string
}
