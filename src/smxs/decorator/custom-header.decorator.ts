import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CustromHeader = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const headers = request.headers;
    return headers
  },
);