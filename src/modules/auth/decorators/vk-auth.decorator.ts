import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const VKAuth = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    return req.user.vk;
});
