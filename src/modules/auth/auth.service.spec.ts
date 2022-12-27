import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaModule } from '../../common/providers/prisma/prisma.module';
import { UsersModule } from '../users/users.module';

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule, UsersModule],
            providers: [AuthService],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
