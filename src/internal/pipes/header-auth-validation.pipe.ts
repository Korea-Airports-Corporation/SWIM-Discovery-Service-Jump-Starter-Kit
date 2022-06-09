import { PipeTransform, UnauthorizedException } from '@nestjs/common';

export class HeaderAuthValidationPipe implements PipeTransform {
  readonly allowed = 'Bearer';

  transform(headers: any) {
    if (!headers.authorization) throw new UnauthorizedException(`Invalid credentials`);
    if (!this.isAuthValid(headers.authorization)) throw new UnauthorizedException(`Invalid credentials`);

    return headers.authorization.split(" ")[1];
  }

  private isAuthValid(authorization: string) {
    const type = authorization.split(" ")[0];
    if (type === this.allowed) return true;
    else return false; 
  }
}
