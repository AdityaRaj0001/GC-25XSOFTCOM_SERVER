import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
    constructor(private prisma: DatabaseService) { }

    async findByPayload({ id }: any): Promise<any> {
        return await this.prisma.user.findFirst({
            where: { id:id },
        });
    }

    async getAllUsers(): Promise<any> {
        return await this.prisma.user.findMany();
    }
}
