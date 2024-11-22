import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadInterface } from '@auth/interfaces';

export const CurrentUser = createParamDecorator(
    (key: keyof JwtPayloadInterface, ctx: ExecutionContext): JwtPayloadInterface | Partial<JwtPayloadInterface> => {
        const request = ctx.switchToHttp().getRequest();
        return key ? request.user[key] : request.user;
    },
);
