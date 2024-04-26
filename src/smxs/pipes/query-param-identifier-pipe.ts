import { PipeTransform, BadRequestException } from '@nestjs/common';

export class QueryParamIdentifier implements PipeTransform {
  readonly allowed = {
    path1 : "swim-registry.kr",
    path2 : "swim-registry.kr:8000",
    path3 : "swim-service-description"
  } 

  transform(parms: any) {
    if (!(String(parms.path2).includes(this.allowed.path2)||String(parms.path2).includes(this.allowed.path1))) throw new BadRequestException(`Unacceptable Query Parameter, not a valid identifier`);
    if (!String(parms.path3).includes(this.allowed.path3)) throw new BadRequestException(`Unacceptable Query Parameter, not a valid identifier`);    
    if (String(parms.path3)===`"`) throw new BadRequestException(`Unacceptable Query Parameter, not a valid identifier`);

    return parms;
  }
}
