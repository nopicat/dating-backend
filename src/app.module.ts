import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { CardsModule } from './modules/cards/cards.module';
import { PrismaModule } from './common/providers/prisma/prisma.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { GeocoderModule } from './modules/geocoder/geocoder.module';
import { UsersModule } from './modules/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './modules/auth/strategies/local.strategy';
import { TokenStrategy } from './modules/auth/strategies/token.strategy';
import { VKStrategy } from './modules/auth/strategies/vk.strategy';
import { UploadsModule } from './modules/uploads/uploads.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
    imports: [
        PassportModule,
        PrismaModule,
        CardsModule,
        GeocoderModule,
        UsersModule,
        AuthModule,
        UploadsModule,
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                NODE_ENV: Joi.string()
                    .valid('development', 'production', 'test', 'provision')
                    .default('development'),
                APP_URL: Joi.string(),
                VK_CLIENT_SECRET: Joi.string(),
                VK_CLIENT_ID: Joi.number(),
            }),
        }),
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor,
        },
        LocalStrategy,
        TokenStrategy,
        VKStrategy,
    ],
})
export class AppModule {}
