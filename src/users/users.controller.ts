import { Body, Controller, Get, UseGuards, HttpException, HttpStatus, Param, Post, Query, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from './users.service';
import { CreateTeamDto } from './create-team.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
    constructor(private readonly usersService: UserService) { }


    @Post('/register_team')
    async registerTeam(@Body() createTeamDto: CreateTeamDto) {
      return this.usersService.registerTeam(createTeamDto);
    }
}
