import { HttpException, HttpStatus, Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateTeamDto } from './create-team.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: DatabaseService) {}

  async findByPayload({ id }: any): Promise<any> {
    return await this.prisma.user.findFirst({
        where: { id:id },
    });
  }

  async registerTeam(createTeamDto: CreateTeamDto) {
    const { eventId, leaderId, members } = createTeamDto;

    // Check if leader is already registered in the event
    const existingTeam = await this.prisma.team.findFirst({
      where: { eventId, members: { some: { id: leaderId } } },
    });

    if (existingTeam) {
      throw new BadRequestException('Leader is already registered in this event.');
    }

    // Get the hall of the leader
    const leader = await this.prisma.user.findUnique({
      where: { id: leaderId },
      include: { userHall: true },
    });

    if (!leader?.userHall) {
      throw new BadRequestException('Leader must belong to a hall.');
    }

    // Check the number of teams registered from the hall for the event
    const hallTeams = await this.prisma.team.count({
      where: {
        eventId,
        members: { some: { userHall: { id: leader.userHall.id } } },
      },
    });

    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (hallTeams >= event.maxLimit) {
      throw new BadRequestException('Hall has reached the maximum team limit for this event.');
    }

    // Create the team
    const team = await this.prisma.team.create({
      data: {
        event: { connect: { id: eventId } },  // Ensure the event is correctly connected
        approved: false,  // Pending approval by Hall Rep
        score: 0,
        teamLeader: { connect: { id: leaderId } },  // Connect the team leader correctly
        members: { connect: members.map((id) => ({ id })) },  // Connect the team members correctly
      },
    });

    return { success: true, message: 'Team registered successfully. Pending approval by Hall Rep.' };
  }

    async getEvents(): Promise<any> {
        try {
            return await this.prisma.event.findMany();
        } catch (error) {
            throw new HttpException(
                error.message || 'ERROR_FETCHING_EVENTS',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async getEventById(eventId: string): Promise<any> {
        try {
            return await this.prisma.event.findFirst({
                where: { id: eventId }
            });
        } catch (error) {
            throw new HttpException(
                error.message || 'ERROR_FETCHING_EVENT',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async searchEvents(query: string, page: number, resultPerPage: number): Promise<any> {
        try {
            const eventCount = await this.prisma.event.count({
                where: {
                    OR: [
                        {title : {contains: query}},
                        {description : {contains: query}},
                        {prizes : {contains: query}},
                        {venues : {contains: query}},
                    ]
                }
            })
            const events = await this.prisma.event.findMany({
                where: {
                    OR: [
                        {title : {contains: query}},
                        {description : {contains: query}},
                        {prizes : {contains: query}},
                        {venues : {contains: query}},
                    ]
                },
                skip: (page - 1) * resultPerPage,
                take: resultPerPage
            });
            return {
                success: true,
                message: 'Products retrieved successfully',
                data: events,
                page: page,
                total: events.length,
                lastPage: Math.ceil(eventCount / resultPerPage)
            }
        } catch (error) {
            throw new HttpException(
                error.message || 'ERROR_SEARCHING_EVENTS',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async getCoordinators(): Promise<any> {
        try {
            return await this.prisma.user.findMany({
                where: { isCoordinator: true }
            });
        } catch (error) {
            throw new HttpException(
                error.message || 'ERROR_FETCHING_COORDINATORS',
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}
