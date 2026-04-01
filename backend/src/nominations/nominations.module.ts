import { Module } from '@nestjs/common'
import { NominationsController } from './nominations.controller'
import { NominationsService } from './nominations.service'

@Module({
  controllers: [NominationsController],
  providers: [NominationsService],
})
export class NominationsModule {}
