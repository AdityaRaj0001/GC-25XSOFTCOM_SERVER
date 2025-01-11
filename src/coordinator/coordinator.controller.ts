import { Body, Controller, Post } from '@nestjs/common';
import { CoordinatorService } from './coordinator.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller('coordinator')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CoordinatorController {
  constructor(private readonly coordinatorService: CoordinatorService) {}

  @Post('add_score')
  async addScore(
    @Body() body: { event_id: string; team_id: string; score: number },
  ) {
    return this.coordinatorService.addScore(body);
  }
}
