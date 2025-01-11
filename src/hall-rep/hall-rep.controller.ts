import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { HallRepService } from './hall-rep.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('hall-rep')
@UseGuards(JwtAuthGuard)
export class HallRepController {
  constructor(private readonly hallRepService: HallRepService) {}

  @Get('approve-team/:teamId')
  async approveTeam(@Param('teamId') teamId: string) {
    return await this.hallRepService.approveTeam(teamId);
  }

}
