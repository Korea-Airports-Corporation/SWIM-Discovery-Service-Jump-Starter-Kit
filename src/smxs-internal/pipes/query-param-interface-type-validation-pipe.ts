import { PipeTransform, BadRequestException } from '@nestjs/common';

export class QueryParamInterfaceTypeValidationPipe implements PipeTransform {
  readonly allowed =  [
    'message-oriented',
    'method-oriented',
    'resource-oriented',
  ]; 

  transform(parms: any) {
    let str ="";
    let arr = String(parms).split(",");
    if (parms === undefined) return ''; 

    for(let i in arr){
      if (!this.isParamValid(arr[i])) {
        throw new BadRequestException(`Unacceptable Query Parameter`);
      } else {
        if(str ===""){
          str = arr[i];
        } else {
          str = str + "," + arr[i];
        }
      }
    }

    return str;
  }

  private isParamValid(parms: any) {
    return (this.allowed.indexOf(parms) > -1);
  }
}
