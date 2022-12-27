import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/providers/prisma/prisma.service';
import { AuthService } from './auth.service';
import { AuthLoginGatewayRouteInput, AuthVkCallbackGatewayRouteInput } from './auth.gateway.input';
import { Gender } from '@prisma/client';

@Injectable()
export class AuthGatewayService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly authService: AuthService,
    ) {}

    public loginRoute({ user }: AuthLoginGatewayRouteInput) {
        return this.authService.generateAndCreateToken(user.id);
    }

    public async vkCallbackRoute({ vkProfile }: AuthVkCallbackGatewayRouteInput) {
        const user = await this.authService.getUserByVkId(+vkProfile.id);

        const photoUrl = vkProfile.photos.find((photo) => photo.type === 'photo_max_orig').value;

        if (photoUrl.includes('camera_400')) {
            // todo import photo from vk
        }

        return this.authService.authByAnyService(user, {
            vkId: +vkProfile.id,
            firstName: vkProfile.name.givenName,
            lastName: vkProfile.name.familyName,
            gender: vkProfile.gender
                ? vkProfile.gender === 'female'
                    ? Gender.FEMALE
                    : Gender.MALE
                : null,
            birthday: vkProfile.birthday ? new Date(vkProfile.birthday) : null,
            profilePhotos: {},
        });
    }
}
