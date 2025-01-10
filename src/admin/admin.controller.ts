import { Body, Controller, Get, UseGuards, HttpException, HttpStatus, Param, Post, Request, Query, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
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

    @Get('search-events')
    @ApiQuery({
        name: 's',
        required: true,
        type: String,
        description: 'Search query',
    })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number',
    })
    @ApiQuery({
        name: 'resultPerPage',
        required: false,
        type: Number,
        default: 10,
        description: 'Page number',
    })
    async searchEvents(@Request() req) {
        try {
            const page : number = req.query.page ? parseInt(req.query.page, 10) : 1;
            const resultPerPage = req.query.resultPerPage ? parseInt(req.query.resultPerPage, 10) : 10;
            return await this.adminService.searchEvents(req.query.s, page, resultPerPage);
        } catch (error) {
            throw new HttpException(
                error.message || 'Error searching products',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
