import { PipeTransform, BadRequestException } from '@nestjs/common';

export class QueryParamaAvailabilityStatusValidationPipe implements PipeTransform {
  readonly allowed =  [
    'operational',
    'prospective',
    'retired'
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
