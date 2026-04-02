import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UpdatePredictionDto {
  @ApiProperty({ description: 'New nomination UUID' })
  @IsString()
  nominationId: string
}
