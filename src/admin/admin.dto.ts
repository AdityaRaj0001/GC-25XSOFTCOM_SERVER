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
  IsDate,
} from 'class-validator';

export class CreateEvent {
    @ApiProperty({
        description: "Name of the event",
        example: "Hackathon"
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        description: "Description of the event",
        example: "Hackathon duhhh"
    })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({
        description: "Rulebook of the event",
        example: "http://somelink.com"
    })
    @IsNotEmpty()
    @IsString()
    rulebooks: string;

    @ApiProperty({
        description: "Event start time",
        example: "2021-09-01T00:00:00.000Z"
    })
    @IsNotEmpty()
    @IsDate()
    eventStart: string;

    @ApiProperty({
        description: "Duration of the event",
        example: "2"
    })
    @IsNotEmpty()
    @IsNumber()
    duration: string;

    @ApiProperty({
        description: "Venue of the event",
        example: "M1"
    })
    @IsNotEmpty()
    @IsString()
    venues: string;

    @ApiProperty({
        description: "Prizes of the event",
        example: "agle sem aaega"
    })
    @IsNotEmpty()
    @IsString()
    prizes: string;

    @ApiProperty({
        description: "Max limit of the event",
        example: "1"
    })
    @IsNotEmpty()
    @IsNumber()
    maxLimit: string;

    @ApiProperty({
        description: "Coordinator of the event",
        example: "[cuid]"
    })
    @IsNotEmpty()
    @IsString()
    coordinatorId: string;
}

export class CreateHall {
    @ApiProperty({
        description: "HallName",
        example: "H1/Beas"
    })
    @IsNotEmpty()
    @IsString()
    hallName: string;

    @ApiProperty({
        description: "HallRep Id",
        example: "[cuid]"
    })
    @IsNotEmpty()
    @IsString()
    hallRepId: string;
}