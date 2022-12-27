import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class IsUserActivatedGuard implements CanActivate {
    public canActivate(context: ExecutionContext) {
        const user = context.switchToHttp().getRequest().user.user as User;

        return user.isActivated;
    }
}
