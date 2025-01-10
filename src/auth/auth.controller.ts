import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/users/users.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() registerUserDto: RegisterUserDto) {
        return await this.authService.registerUser(registerUserDto);
    }
}
