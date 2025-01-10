import { Controller, Get, Param } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  // GET /leaderboard/all
  @Get('all')
  getAllScores() {
    // Returns the scores of each team across all events in descending order
    return this.leaderboardService.getAllScores();
  }

  // GET /leaderboard/:id
  @Get(':id')
  getEventScores(@Param('id') eventId: string) {
    // Returns the scores of each team in one specific event in descending order
    return this.leaderboardService.getEventScores(eventId);
  }
}
