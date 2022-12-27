import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';
import { VKAuth } from './decorators/vk-auth.decorator';
import { UserAuth } from './decorators/user-auth.decorator';
import { VKProfile } from '../../common/types/vk-profile.interface';
import { AuthGatewayService } from './auth.gateway.service';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authGatewayService: AuthGatewayService) {}

    @UseGuards(AuthGuard('local'))
    @Get('login')
    public login(@UserAuth() user: User) {
        return this.authGatewayService.loginRoute({ user });
    }

    @UseGuards(AuthGuard('vkontakte'))
    @Get('vk')
    public vk() {}

    @UseGuards(AuthGuard('vkontakte'))
    @ApiExcludeEndpoint()
    @Get('vk/callback')
    public vkCallback(@VKAuth() vkProfile: VKProfile) {
        return this.authGatewayService.vkCallbackRoute({ vkProfile });
    }
}
