import { DiscoveryServiceDto } from '../dto/discovery-service.dto';

interface IDiscoveryServiceFactory {
    setId(value: string) : void;
    setName(value: string) : void;
    setDescription(value: string) : void;
    setVersion(value: string) : void;
    setProvider(value: string) : void;
    setOperations(value: string) : void;
    setSeeAlso(value: string) : void;
    getDiscoveryServiceData() : DiscoveryServiceDto;
  }

export class DiscoveryServiceFactory implements IDiscoveryServiceFactory {
    private _id: string;
    private _name: string;
    private _description: string;
    private _version: string;
    private _provider: string;
    private _operations: string;
    private _seeAlso: string;

    constructor() {}
    setId(value) : void {
        this._id = value;
    };
    setName(value) : void {
        this._name = value;
    };
    setDescription(value) : void {
        this._description = value;
    };
    setVersion(value) : void {
        this._version = value;
    };
    setProvider(value) : void {
        this._provider = value;
    };
    setOperations(value) : void {
        this._operations = value;
    };
    setSeeAlso(value) : void {
        this._seeAlso = value;
    };

    getDiscoveryServiceData() : DiscoveryServiceDto {

        const data = {
            id: this._id,
            name: this._name,
            description: this._description,
            version: this._version,
            provider: this._provider,
            operations: this._operations,
            "see also" : this._seeAlso,
        }

        return data; 
    };

}