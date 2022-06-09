import { DiscoveryServiceProviderDto } from '../dto/discovery-service-provider.dto';
import { DiscoveryServiceProviderContactDto } from '../dto/discovery-service-provider-contact.dto';

interface IDiscoveryServiceProviderFactory {
    setName(value: string) : void;
    setDescription(value: string) : void;
    setWebPage(value: string) : void;
    setPointOfContact(value: DiscoveryServiceProviderContactDto) : void;
    getDiscoveryServiceProviderData() : DiscoveryServiceProviderDto;
  }

export class DiscoveryServiceProviderFactory implements IDiscoveryServiceProviderFactory {
    private _name: string;
    private _description: string;
    private _webPage: string;
    private _pointOfContact: DiscoveryServiceProviderContactDto;

    constructor() {}

    setName(value) : void {
        this._name = value;
    };
    setDescription(value) : void {
        this._description = value;
    };
    setWebPage(value) : void {
        this._webPage = value;
    };
    setPointOfContact(value) : void {
        this._pointOfContact = value;
    };

    getDiscoveryServiceProviderData() : DiscoveryServiceProviderDto {
        const data = {
            name: this._name,
            description: this._description,
            "web page": this._webPage,
            "point of contact": this._pointOfContact
        }

        return data; 
    };

}