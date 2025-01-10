import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class HallRepService {
  constructor(private readonly prisma: DatabaseService) {}

  getHallRep(): string {
    return 'This is the HallRepService';
  }

  getHallRepById(id: string): string {
    return `This is the HallRepService with id ${id}`;
  }

  createHallRep(): string {
    return 'This is the HallRepService';
  }

  // Can select teams to move forward for an event representing the hall.
  async approveTeam(teamId: string) {
    try {
      const team = await this.prisma.team.findUniqueOrThrow({
        where: { id: teamId },
        include: { teamLeader: true, event: true },
      });
      
      // if already approved
      if (team.approved) {
        throw new HttpException(
          'Team already approved',
          HttpStatus.BAD_REQUEST,
        );
      }

      const teamHallId = team.teamLeader.hallId;

      // check if the number of teams allowed in the event from a hall are exceeded or not
      // check the number of existing registered teams from the hall -> h for event -> e
      const teamsFromHall = await this.prisma.team.count({
        where: { eventId: team.eventId, teamLeader: { hallId: teamHallId } },
      });

      if(teamsFromHall >= team.event.maxLimit){
        throw new HttpException(
          'Maximum limit reached for the hall',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.prisma.team.update({
        where: { id: teamId },
        data: { approved: true },
      });

      return { success: true, message: 'Team approved', data: team };
    } catch (error) {
      if ((error.code == 'P2025')) {
        throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
