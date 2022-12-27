import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '../../../common/types/request/http/auth-request.interface';

export const UserAuth = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest() as AuthRequest;

    return req.user.user;
});
