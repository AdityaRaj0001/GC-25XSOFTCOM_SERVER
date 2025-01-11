import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsNotEmpty()
  @IsString()
  eventId: string;

  @IsNotEmpty()
  @IsString()
  leaderId: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  members: string[]; // List of member IDs

}
