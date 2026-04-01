import { Controller } from '@nestjs/common'
import { EditionsService } from './editions.service'

@Controller('editions')
export class EditionsController {
  constructor(private readonly editionsService: EditionsService) {}
}
