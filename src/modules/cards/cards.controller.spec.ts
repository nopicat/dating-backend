import { Test, TestingModule } from '@nestjs/testing';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { CardsGatewayService } from './cards.gateway.service';
import { PrismaModule } from '../../common/providers/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

describe('CardsController', () => {
    let controller: CardsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule, AuthModule],
            providers: [CardsService, CardsGatewayService],
            controllers: [CardsController],
        }).compile();

        controller = module.get<CardsController>(CardsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
