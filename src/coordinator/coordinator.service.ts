import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service'; // adjust path as needed


@Injectable()
export class CoordinatorService {
  constructor(private prisma: DatabaseService) { }

  async addScore(data: { event_id: string; team_id: string; score: number }) {
    const { event_id, team_id, score } = data;

    // 1. Check if the event exists and fetch registered teams
    const event = await this.prisma.event.findUnique({
      where: { id: event_id },
      select: {
        registeredTeams: {
          select: { id: true },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${event_id} not found`);
    }

    // 2. Check if the given team is registered to this event
    const isTeamInEvent = event.registeredTeams.some(
      (team) => team.id === team_id,
    );

    if (!isTeamInEvent) {
      throw new NotFoundException(
        `Team with ID ${team_id} not found in Event ${event_id}`,
      );
    }

    // 3. Update the team's score
    const updatedTeam = await this.prisma.team.update({
      where: { id: team_id },
      data: { score },
    });

    return updatedTeam;
  }
}
