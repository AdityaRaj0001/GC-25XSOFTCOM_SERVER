import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateEvent } from './admin.dto';

@Injectable()
export class AdminService {
    constructor(private prisma: DatabaseService) { }

    async createEvent(data: CreateEvent): Promise<any> {
        try {
            const { title, description, rulebooks, eventStart, duration, venues, prizes, maxLimit, coordinatorId} = data;
            const validCoordinator = await this.prisma.user.findFirst({
                where: { id: coordinatorId }
            });
            if(!validCoordinator.isCoordinator) {
                throw new HttpException(
                    'INVALID_COORDINATOR',
                    HttpStatus.BAD_REQUEST,
                );
            }
            const event = await this.prisma.event.create({
                data: {
                    title,
                    description,
                    rulebooks,
                    eventStart,
                    duration:Number(duration),
                    venues,
                    prizes,
                    maxLimit:Number(maxLimit),
                    coordinatorId
                }
            });
        } catch (error) {
            throw new HttpException(
                error.message || 'ERROR_CREATING_EVENT',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async makeCoordinator(userId: string): Promise<any> {
        try {
            const user = await this.prisma.user.findFirst({
                where: { id: userId }
            });
            if(user.isCoordinator) {
                throw new HttpException(
                    'USER_ALREADY_COORDINATOR',
                    HttpStatus.BAD_REQUEST,
                );
            }
            await this.prisma.user.update({
                where: { id: userId },
                data: { isCoordinator: true }
            });
        } catch (error) {
            throw new HttpException(
                error.message || 'ERROR_MAKING_COORDINATOR',
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}
