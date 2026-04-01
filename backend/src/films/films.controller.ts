import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FilmsService } from './films.service'

@ApiTags('films')
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  @ApiOperation({ summary: 'List all films' })
  @ApiResponse({ status: 200, description: 'Returns all films ordered by title' })
  findAll() {
    return this.filmsService.findAll()
  }
}
