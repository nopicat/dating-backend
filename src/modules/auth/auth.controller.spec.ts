import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../../common/providers/prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthGatewayService } from './auth.gateway.service';

describe('AuthController', () => {
    let controller: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule, UsersModule],
            providers: [AuthService, AuthGatewayService],
            controllers: [AuthController],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
