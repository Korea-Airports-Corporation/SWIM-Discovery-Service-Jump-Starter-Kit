import { PipeTransform, BadRequestException } from '@nestjs/common';

export class QueryParamServiceCategoryValidationPipe implements PipeTransform {
  readonly allowed =  [
    'core',
    'aeronautical',
    'flight',
    'infrastructure',
    'surveillance',
    'weather',
    'world-features',
    'discovery',
    'mediation',
    'messaging',
    'security',
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
