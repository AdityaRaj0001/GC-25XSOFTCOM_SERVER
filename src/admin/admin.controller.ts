import { Body, Controller, Get, UseGuards, HttpException, HttpStatus, Param, Post, Query, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminService } from './admin.service';
import { CreateEvent } from './admin.dto';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Post('create-event')
    async createEvent(@Body() data: CreateEvent) {
        return await this.adminService.createEvent(data);
    }

    @Post('make-coordinator/:id')
    async makeCoordinator(@Param('id') id: string) {
        return await this.adminService.makeCoordinator(id);
    }

    @Post('make-hall-rep/:id')
    async makeHallRep(@Param('id') id: string) {
        return await this.adminService.makeHallRepresentative(id);
    }

    @Post('create-hall')
    async createHall(@Body() data: any) {
        return await this.adminService.createHall(data);
    }

    @Get('get-all-events')
    async getAllEvents() {
        return await this.adminService.getEvents();
    }
}
