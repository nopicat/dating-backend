import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-vkontakte';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VKStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
    ) {
        super(
            {
                clientID: configService.get('VK_CLIENT_ID'),
                clientSecret: configService.get('VK_CLIENT_SECRET'),
                callbackURL: configService.get('APP_URL') + '/api/auth/vk/callback',
                scope: ['offline'],
                profileFields: ['bdate', 'photo_max_orig'],
                lang: 'ru',
            },
            (accessToken, refreshToken, params, profile, done) =>
                this.validate(accessToken, refreshToken, profile, done),
        );
    }

    public validate(accessToken: string, refreshToken: string, profile: Profile, done: Function) {
        return done(null, {
            vk: profile,
        });
    }
}
