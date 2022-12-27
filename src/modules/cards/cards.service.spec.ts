import { Test, TestingModule } from '@nestjs/testing';
import { CardsService } from './cards.service';
import { PrismaModule } from '../../common/providers/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

describe('CardsService', () => {
    let service: CardsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule, AuthModule],
            providers: [CardsService],
        }).compile();

        service = module.get<CardsService>(CardsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
