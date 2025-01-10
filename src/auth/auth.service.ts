import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './guards/jwt.strategy';
import { addMinutes } from 'date-fns';
import { RegisterUserDto, LoginUserDto } from 'src/users/users.dto';
import { emit } from 'process';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: DatabaseService,
        private readonly userService: UsersService,
        private jwtService: JwtService
    ) { }

    private validateEmail(email: string): boolean {
        const emailRegex = /^20\d{2}[a-z]{3}\d{4}@iitrpr\.ac\.in$/;
        return emailRegex.test(email);
    }

    private async checkUserExists(
        emailId: string
    ): Promise<any> {
        try {
            const user = await this.prisma.user.findFirst({
                where: { email: emailId }
            })
        } catch (error) {
            throw new HttpException(
                error.message || 'USER NOT FOUND',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async registerUser(userDto: RegisterUserDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }> {
        try {
            const {
                name, email, password
            } = userDto;
            if (!this.validateEmail(email)) {
                return { success: false, message: 'INVALID_EMAIL', data: null };
            }
            const user = await this.prisma.user.findFirst({
                where: { email }
            })
            if (user) {
                return { success: false, message: 'USER_ALREADY_EXISTS', data: user };
            }

            const res = await this.prisma.user.upsert({
                where: { email },
                update: {
                    email, name, password
                },
                create: {
                    email, name, password
                }
            })
            if (!res) {
                throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
            }
            const token = await this._createToken(res.id);
            
            return { success: true, message: 'USER_REGISTERED', data: {res, token} };
        } catch (error) {
            console.log("error");
            throw new HttpException(
                error.message || 'USER NOT FOUND',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async loginUser(userDto: LoginUserDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }> {
        try {
            const { email, password } = userDto;
            const user = await this.prisma.user.findFirst({
                where: { email }
            })
            if (!user) {
                return {
                    success: false,
                    message: 'USER_NOT_FOUND',
                    data: null,
                };
            }
            if (password != user.password) {
                return {
                    success: false,
                    message: 'INVALID_PASSWORD',
                    data: null,
                };
            }
            const token = await this._createToken(user.id);
            return {
                success: true,
                message: 'LOGIN_SUCCESS',
                data: {
                    user,
                    token,
                },
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'USER NOT FOUND',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    private async _createToken(id: string): Promise<Token> {
        const user: JwtPayload = { id };
        const jwt_token = this.jwtService.sign(user);
        const expiresAt = addMinutes(new Date(), parseInt(process.env.EXPIRESIN));

        return {
            expiresAt,
            jwt_token,
        };
    }

    async validateUser(payload: JwtPayload): Promise<any> {
        try {
            const user = await this.userService.findByPayload(payload);
            if (!user) {
                throw new HttpException('INVALID_TOKEN', HttpStatus.UNAUTHORIZED);
            }
            return user;
        } catch (error) {
            throw new HttpException('USER_VALIDATION_FAILED', HttpStatus.BAD_REQUEST);
        }
    }
}

export interface Token {
    expiresAt: Date;
    jwt_token: string;
}