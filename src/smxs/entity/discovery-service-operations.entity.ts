import { DiscoveryServiceOperationDto } from '../dto/discovery-service-operation.dto';

interface IDiscoveryServiceOperationsFactory {
    setValue(_name: string, _securityConstraint?: string) : void;
    getDiscoveryServiceOperationData() : DiscoveryServiceOperationDto[];
  }

export class DiscoveryServiceOperationsFactory implements IDiscoveryServiceOperationsFactory {
    private _tmp = [];
    constructor() {}

    setValue(name, securityConstraint) : void {
        let tmpObj:any = new Object();

        tmpObj.name = name; 

        if(securityConstraint){
            tmpObj["security-constraint"] = securityConstraint; 
        }

        this._tmp.push(tmpObj)
    };

    getDiscoveryServiceOperationData() : DiscoveryServiceOperationDto[] {
        return this._tmp; 
    };

}