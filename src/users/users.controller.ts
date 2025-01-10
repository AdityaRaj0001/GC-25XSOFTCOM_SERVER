import { Body, Controller, Get, UseGuards, HttpException, HttpStatus, Request, Param, Post, Query, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateTeamDto } from './create-team.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }


    @Post('/register_team')
    async registerTeam(@Body() createTeamDto: CreateTeamDto) {
      return this.usersService.registerTeam(createTeamDto);
    }

    @Get('get-all-events')
    async getAllEvents() {
        return await this.usersService.getEvents();
    }

    @Get('get-event/:id')
    async getEventById(@Param('id') id: string) {
        return await this.usersService.getEventById(id);
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
            return await this.usersService.searchEvents(req.query.s, page, resultPerPage);
        } catch (error) {
            throw new HttpException(
                error.message || 'Error searching products',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
