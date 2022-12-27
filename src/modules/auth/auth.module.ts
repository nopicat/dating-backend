import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGatewayService } from './auth.gateway.service';
import { PrismaModule } from '../../common/providers/prisma/prisma.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [PrismaModule, UsersModule],
    providers: [AuthService, AuthGatewayService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
