import { Body, Controller, Post } from '@nestjs/common';
import { CoordinatorService } from './coordinator.service';

@Controller('coordinator')
export class CoordinatorController {
  constructor(private readonly coordinatorService: CoordinatorService) {}

  @Post('add_score')
  async addScore(
    @Body() body: { event_id: string; team_id: string; score: number },
  ) {
    return this.coordinatorService.addScore(body);
  }
}
