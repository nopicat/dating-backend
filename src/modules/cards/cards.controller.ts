import {
    Controller,
    Get,
    NotImplementedException,
    ParseIntPipe,
    Query,
    UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../../common/providers/prisma/prisma.service';
import { CardsGatewayService } from './cards.gateway.service';
import { User } from '@prisma/client';
import { UserAuth } from '../auth/decorators/user-auth.decorator';
import { TokenAuthGuard } from '../auth/guards/token.guard';
import { ApiTags } from '@nestjs/swagger';
import { IsUserActivatedGuard } from '../../common/guards/is-user-activated/is-user-activated.guard';

@UseGuards(TokenAuthGuard, IsUserActivatedGuard)
@ApiTags('Cards')
@Controller('cards')
export class CardsController {
    constructor(private readonly cardsGatewayService: CardsGatewayService) {}

    @Get('like')
    public like(@UserAuth() user: User, @Query('userId', ParseIntPipe) userId: number) {
        return this.cardsGatewayService.likeRoute({ user, userId });
    }

    @Get('dislike')
    public dislike(@UserAuth() user: User, @Query('userId', ParseIntPipe) userId: number) {
        return this.cardsGatewayService.dislikeRoute({ user, userId });
    }

    // todo
    @Get('superLike')
    public superLike() {
        throw new NotImplementedException();
    }

    @Get('getList')
    public getList(@UserAuth() user: User) {
        return this.cardsGatewayService.getListRoute({ user });
    }
}
