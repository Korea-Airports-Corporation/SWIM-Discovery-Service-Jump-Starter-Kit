import { DiscoveryServiceProviderContactDto } from '../dto/discovery-service-provider-contact.dto';

interface IDiscoveryServiceFactory {
    setName(value: string) : void;
    setFunction(value: string) : void;
    setEmail(value: string) : void;
    getDiscoveryServiceProviderContactData() : DiscoveryServiceProviderContactDto;
  }

export class DiscoveryServiceProviderContactFactory implements IDiscoveryServiceFactory {
    private _name: string;
    private _function: string;
    private _email: string;


    constructor() {}

    setName(value) : void {
        this._name = value;
    };
    setFunction(value) : void {
        this._function = value;
    };
    setEmail(value) : void {
        this._email = value;
    };
 

    getDiscoveryServiceProviderContactData() : DiscoveryServiceProviderContactDto {

        const data = {
            name: this._name,
            function: this._function,
            email: this._email,
        }

        return data; 
    };

}