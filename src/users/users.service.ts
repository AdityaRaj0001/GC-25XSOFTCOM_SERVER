import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
    constructor(private prisma: DatabaseService) { }

    async findByPayload({ id }: any): Promise<any> {
        return await this.prisma.user.findFirst({
            where: { id:id },
        });
    }

    async getAllUsers(): Promise<any> {
        return await this.prisma.user.findMany();
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
}
