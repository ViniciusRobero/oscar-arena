import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { EditionsService } from './editions.service'

@ApiTags('editions')
@Controller('editions')
export class EditionsController {
  constructor(private readonly editionsService: EditionsService) {}

  @Get()
  @ApiOperation({ summary: 'List all Oscar editions' })
  @ApiResponse({ status: 200, description: 'Returns all editions ordered by year desc' })
  findAll() {
    return this.editionsService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single edition by ID' })
  @ApiResponse({ status: 200, description: 'Returns the edition' })
  @ApiResponse({ status: 404, description: 'Edition not found' })
  findOne(@Param('id') id: string) {
    return this.editionsService.findOne(id)
  }
}
