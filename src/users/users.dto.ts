import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsEmail,
  IsUUID,
  IsNumber,
  IsPhoneNumber,
  IsEnum,
} from 'class-validator';

export class RegisterUserDto {
    @ApiProperty({
        description: "Name of the person",
        example: "John Doe"
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: "Email of the person",
        example: "20xxcsbxxxx@iitrpr.ac.in"
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({
        description: "Hall id of the person",
        example: "H1"
    })
    @IsNotEmpty()
    @IsString()
    hall: string;
}

export class LoginUserDto {
    @ApiProperty({
        description: "Email of the person",
        example: "20xxcsbxxxx@iitrpr.ac.in"
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}