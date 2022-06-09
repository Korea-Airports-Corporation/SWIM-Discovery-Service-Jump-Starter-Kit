import { PipeTransform, BadRequestException } from '@nestjs/common';

export class HeaderValidationPipe implements PipeTransform {
  readonly allowed = 'application/json';

  transform(headers: any) {
    if (!this.isHeaderValid(headers.accept)) {
      throw new BadRequestException(`Only application/json is acceptable`);
    }
    return true;
  }

  private isHeaderValid(accept: any) {
    if (accept === this.allowed) return true;
    else return false; 
  }
}
