import { PipeTransform, BadRequestException } from '@nestjs/common';

export class QueryParamIdentifier implements PipeTransform {
  readonly allowed = {
    path2 : "112.172.247.116:8000",
    path3 : "kac-swim-service"
  } 

  transform(parms: any) {
    if (!String(parms.path2).includes(this.allowed.path2)) throw new BadRequestException(`Unacceptable Query Parameter, not a valid identifier`);
    if (!String(parms.path3).includes(this.allowed.path3)) throw new BadRequestException(`Unacceptable Query Parameter, not a valid identifier`);    
    if (String(parms.path3)===`"`) throw new BadRequestException(`Unacceptable Query Parameter, not a valid identifier`);

    return parms;
  }
}
