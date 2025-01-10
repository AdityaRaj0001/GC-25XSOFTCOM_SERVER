import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class LeaderboardService {
  constructor(private readonly db: DatabaseService) {}

  // 1. Returns the scores of each team across ALL events in descending order
  async getAllScores() {
    const allTeams = await this.db.team.findMany({
      select: {
        id: true,
        score: true,
        event: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        score: 'desc',
      },
    });

    return allTeams;
  }

  // 2. Returns the scores of each team in ONE event in descending order
  async getEventScores(eventId: string) {
    // Optionally, verify that the event actually exists
    const eventExists = await this.db.event.findUnique({
      where: { id: eventId },
      select: { id: true },
    });

    if (!eventExists) {
      throw new NotFoundException(`Event with ID ${eventId} not found.`);
    }

    const eventTeams = await this.db.team.findMany({
      where: { eventId },
      select: {
        id: true,
        score: true,
        event: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        score: 'desc',
      },
    });

    return eventTeams;
  }
}
