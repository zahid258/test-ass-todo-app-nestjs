import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ITokenUser } from '../models';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ITokenUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as ITokenUser;
  },
);