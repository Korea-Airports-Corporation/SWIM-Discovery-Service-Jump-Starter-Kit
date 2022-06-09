import { PipeTransform, BadRequestException } from '@nestjs/common';

export class QueryParamInterfaceTypeValidationPipe implements PipeTransform {
  readonly allowed =  [
    'message-oriented',
    'method-oriented',
    'resource-oriented',
  ]; 

  transform(parms: any) {
 
    if (parms === undefined) return ''; 

    if (!this.isParamValid(parms)) {
      throw new BadRequestException(`Unacceptable Query Parameter`);
    }

    return parms;
  }

  private isParamValid(parms: any) {
    return (this.allowed.indexOf(parms) > -1);
  }
}
