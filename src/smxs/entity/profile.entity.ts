import { ProfileDto } from "../dto/profile.dto";
import { Taxonomy } from './../enum/taxonomy.enum';
import { InterfaceTypeDto } from "../dto/interface-type.dto";
import { ServiceAvailabilityStatusDto } from "../dto/service-availability-status.dto";
import { ServiceCategoryDto } from "../dto/service-category.dto";
import { AvailabilityStatus } from '../enum/availability-status';
import { InterfaceType } from '../enum/interface-type';
import { ServiceCategory } from '../enum/service-category';

interface IProfileFactory {
    setServideId(value: string) : void;
    setName(value: string) : void;
    setDescription(value: string) : void;
    setVersion(value: string) : void;
    setProviderName(value: string) : void;
    setProviderDescription(value: string) : void;
    setProviderWebpage(value: string) : void;
    setProviderPointOfContactName(value: string) : void;
    setProviderPointOfContactFunction(value: string) : void;
    setProviderPointOfContactPhoneNumber(value: string) : void;
    setProviderPointOfContactEmail(value: string) : void;    
    setServiceCategory(value: string) : void;
    setServiceAvailabilityStatus(value: string) : void;
    setInterfaceType(value: string) : void;
    setFunction(value:object) : void; 

    getProfileData() : ProfileDto;
  }

export class ProfileFactory implements IProfileFactory {
  
    private _serviceId : string;
    private _name: string;
    private _description: string;    
    private _version : string;
    private _providerName : string;
    private _providerDescription : string;
    private _providerWebpage : string;
    private _providerPointOfContactName : string;
    private _providerPointOfContactFunction : string;
    private _providerPointOfContactPhoneNumber : string;
    private _providerPointOfContactEmail : string;
    private _serviceCategory : any = [];
    private _serviceAvailabilityStatus : any = [];
    private _interfaceType : any = [];
    private _function : any = [];   

    constructor() {}

    setServideId(value) : void {
        this._serviceId = value;
    };

    setName(value) : void {
        this._name = value;
    };

    setVersion(value) : void {
        this._version = value;
    };

    setDescription(value) : void {
        this._description = value;
    };

    setProviderName(value) : void {
        this._providerName = value;
    };

    setProviderDescription(value) : void {
        this._providerDescription = value;
    };

    setProviderWebpage(value) : void {
        this._providerWebpage = value;
    };

    setProviderPointOfContactName(value) : void {
        this._providerPointOfContactName = value;
    };

    setProviderPointOfContactFunction(value) : void {
        this._providerPointOfContactFunction = value;
    };

    setProviderPointOfContactPhoneNumber(value) : void {
        this._providerPointOfContactPhoneNumber = value;
    };

    setProviderPointOfContactEmail(value) : void {
        this._providerPointOfContactEmail = value;
    };

    setServiceCategory(value) : void {
        let obj = new ServiceCategoryDto(); 
        let code = ServiceCategory[value.toUpperCase()]; 
        obj.code = Taxonomy.SERVICE_CATEGORY+ "#" + code; 
        obj.taxonomy = Taxonomy.SERVICE_CATEGORY; 
        this._serviceCategory.push(obj);
    };

    setServiceAvailabilityStatus(value) : void {
        let obj = new ServiceAvailabilityStatusDto(); 
        let code = AvailabilityStatus[value.toUpperCase()]; 
        obj.code = Taxonomy.AVAILABILITY_STATUS+ "#" + code; 
        obj.taxonomy = Taxonomy.AVAILABILITY_STATUS; 
        this._serviceAvailabilityStatus.push(obj);
    };

    setInterfaceType(value) : void {
        let obj = new InterfaceTypeDto(); 
        let code = InterfaceType[value.toUpperCase()]; 
        obj.code = Taxonomy.INTERFACE_TYPE + "#" + code; 
        obj.taxonomy = Taxonomy.INTERFACE_TYPE;
        this._interfaceType.push(obj);
    };

    setFunction(value) : void {
        for(let i in value){
            let obj : any = new Object(); 
            obj.description = value[i].name; 
            obj['real-world-effect'] = value[i].description; 
            this._function.push(obj); 
        }
    }

    getProfileData() : ProfileDto {

        const provider = {
            "name": this._providerName,
            "description": this._providerDescription,     
            "point-of-contact" : new Array()    
        };

        if(this._providerWebpage){
            provider["web-page"] = this._providerWebpage;
        };

        const providerPointOfContact = { 
            "name": this._providerPointOfContactName,
            "function": this._providerPointOfContactFunction,  
            "email": this._providerPointOfContactEmail               
        }

        if(this._providerPointOfContactPhoneNumber){
            providerPointOfContact["phone-number"] = this._providerPointOfContactPhoneNumber;
        };

        provider["point-of-contact"].push(providerPointOfContact);

        const data = {
            "service-id" : this._serviceId,
            "name": this._name,
            "version": this._version,         
            "provider": provider
        };

        
        if(this._serviceCategory){
            data["service-category"] = this._serviceCategory ;
        }

        if(this._serviceAvailabilityStatus){
            data["service-availability-status"] = this._serviceAvailabilityStatus;
        }

        if(this._interfaceType){
            data["interface-type"] = this._interfaceType ;
        }

        if(this._description){
            data["description"] = this._description;
        };

        if(this._function){
            data["function"] = this._function;           
        }

        return data; 
    };
}
