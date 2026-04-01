import { Controller } from '@nestjs/common'
import { NominationsService } from './nominations.service'

@Controller('nominations')
export class NominationsController {
  constructor(private readonly nominationsService: NominationsService) {}
}
