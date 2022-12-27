import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { PrismaModule } from '../../common/providers/prisma/prisma.module';
import { CardsGatewayService } from './cards.gateway.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [CardsController],
    providers: [CardsService, CardsGatewayService],
})
export class CardsModule {}
