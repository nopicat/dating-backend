import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/providers/prisma/prisma.service';
import { randomBytes } from 'crypto';
import { Prisma, User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly usersService: UsersService,
    ) {}

    public hashPassword(password: string) {
        return argon2.hash(password);
    }

    public verifyPassword(password: string, hash: string) {
        return argon2.verify(hash, password);
    }

    public async validateUser(username: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                username,
            },
        });

        if (!user) {
            return null;
        }

        const isPasswordValid = await this.verifyPassword(password, user.password);

        return isPasswordValid ? user : null;
    }

    public generateToken() {
        return randomBytes(32).toString('hex');
    }

    public createToken(userId: number, token: string) {
        return this.prisma.token.create({
            data: {
                userId,
                token,
            },
        });
    }

    public generateAndCreateToken(userId: number) {
        const generatedToken = this.generateToken();

        return this.createToken(userId, generatedToken);
    }

    public async authByAnyService(user: User | null, createInput: Prisma.UserCreateInput) {
        if (user) {
            const { token } = await this.generateAndCreateToken(user.id);

            return { token };
        }

        const newUser = await this.usersService.createUser(createInput);

        const { token } = await this.generateAndCreateToken(newUser.id);

        return { token };
    }

    public getTokenByStringIncludeUser(token: string) {
        return this.prisma.token.findUnique({
            where: {
                token,
            },
            include: {
                user: true,
            },
        });
    }

    public getUserByVkId(vkId: number) {
        return this.prisma.user.findUnique({
            where: {
                vkId,
            },
        });
    }
}
