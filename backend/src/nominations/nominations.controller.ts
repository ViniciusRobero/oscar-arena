import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { NominationsService } from './nominations.service'

@ApiTags('nominations')
@Controller('nominations')
export class NominationsController {
  constructor(private readonly nominationsService: NominationsService) {}

  @Get()
  @ApiOperation({ summary: 'List nominations for an edition (includes film and category)' })
  @ApiQuery({ name: 'editionId', required: true, description: 'Edition UUID' })
  @ApiResponse({ status: 200, description: 'Returns nominations with film and category data' })
  @ApiResponse({ status: 400, description: 'editionId is required' })
  findAll(@Query('editionId') editionId: string) {
    return this.nominationsService.findAll(editionId)
  }
}
