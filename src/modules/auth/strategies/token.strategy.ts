import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UniqueTokenStrategy } from 'passport-unique-token';
import { AuthService } from '../auth.service';

@Injectable()
export class TokenStrategy extends PassportStrategy(UniqueTokenStrategy) {
    constructor(private readonly authService: AuthService) {
        super();
    }

    public async validate(token: string, done: Function) {
        const tokenInDatabase = await this.authService.getTokenByStringIncludeUser(token);

        if (!tokenInDatabase) {
            throw new UnauthorizedException();
        }

        return { user: tokenInDatabase.user };
    }
}
