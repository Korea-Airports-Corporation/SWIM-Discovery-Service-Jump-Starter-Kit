import { PeersDto } from '../dto/peers.dto';

interface IPeersFactory {
    setServiceId(value: string) : void;
    setEndpoint(value: string) : void;
    getPeersData() : PeersDto;
  }

export class PeersFactory implements IPeersFactory {
    private _serviceId: string;
    private _endPoint: string;
  
    constructor() {}
    setServiceId(value) : void {
        this._serviceId = value;
    };
    setEndpoint(value) : void {
        this._endPoint = value;
    };
  

    getPeersData() : any {

        const data = {
            "service-id": this._serviceId,
            "endpoint" :  this._endPoint
        }

        return data; 
    };

}