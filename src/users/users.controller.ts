import { Body, Controller, Get, UseGuards, HttpException, HttpStatus, Param, Post, Query, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async get() {
        return this.usersService.getAllUsers();
    }
}
