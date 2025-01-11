import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';

@Module({
  imports: [],
  controllers: [LeaderboardController],
  providers: [LeaderboardService, DatabaseService],
})
export class LeaderboardModule {}
