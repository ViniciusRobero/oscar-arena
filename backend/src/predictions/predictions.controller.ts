import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetUser } from '../auth/decorators/get-user.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreatePredictionDto } from './dto/create-prediction.dto'
import { UpdatePredictionDto } from './dto/update-prediction.dto'
import { PredictionsService } from './predictions.service'

@ApiTags('predictions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('predictions')
export class PredictionsController {
  constructor(private readonly predictionsService: PredictionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all predictions for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Returns predictions with nomination, film and category',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@GetUser() user: { id: string }) {
    return this.predictionsService.findAll(user.id)
  }

  @Post()
  @ApiOperation({ summary: 'Create a prediction' })
  @ApiResponse({ status: 201, description: 'Prediction created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Nomination not found' })
  @ApiResponse({ status: 409, description: 'Prediction already exists for this nomination' })
  create(@GetUser() user: { id: string }, @Body() dto: CreatePredictionDto) {
    return this.predictionsService.create(user.id, dto)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a prediction (swap nominated film)' })
  @ApiResponse({ status: 200, description: 'Prediction updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — not your prediction' })
  @ApiResponse({ status: 404, description: 'Prediction not found' })
  @ApiResponse({ status: 409, description: 'Prediction already exists for the new nomination' })
  update(
    @GetUser() user: { id: string },
    @Param('id') id: string,
    @Body() dto: UpdatePredictionDto,
  ) {
    return this.predictionsService.update(user.id, id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a prediction' })
  @ApiResponse({ status: 200, description: 'Prediction deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — not your prediction' })
  @ApiResponse({ status: 404, description: 'Prediction not found' })
  remove(@GetUser() user: { id: string }, @Param('id') id: string) {
    return this.predictionsService.remove(user.id, id)
  }
}
