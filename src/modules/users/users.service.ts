import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/providers/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    public createUser(data: Prisma.UserCreateInput) {
        return this.prisma.user.create({
            data,
        });
    }
}
