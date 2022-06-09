import { Taxonomy } from './../enum/taxonomy.enum';
import { InterfaceTypeDto } from "../dto/interface-type.dto";
import { ServiceAvailabilityStatusDto } from "../dto/service-availability-status.dto";
import { ServiceCategoryDto } from "../dto/service-category.dto";
import { ServicesDto } from '../dto/services.dto';
import { AvailabilityStatus } from '../enum/availability-status';
import { InterfaceType } from '../enum/interface-type';
import { ServiceCategory } from '../enum/service-category';

interface IServicesFactory {
    setId(value: string) : void;
    setName(value: string) : void;
    setDescription(value: string) : void;
    setServiceCategory(value: string) : void;
    setServiceAvailabilityStatus(value: string) : void;
    setInterfaceType(value: string) : void;

    getServicesData() : ServicesDto;
  }

export class ServicesFactory implements IServicesFactory {
  
    private _id : string;
    private _name: string;
    private _description : string;
    private _serviceCategory : any = [];
    private _serviceAvailabilityStatus : any = [];
    private _interfaceType : any = [];

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
    
    getServicesData() : ServicesDto {

        const data = {
            "id" : this._id ,
            "name": this._name,
            "description" : this._description 
        }

        if(this._serviceCategory){
            data["service-category"] = this._serviceCategory ;
        }

        if(this._serviceAvailabilityStatus){
            data["service-availability-status"] = this._serviceAvailabilityStatus;
        }

        if(this._interfaceType){
            data["interface-type"] = this._interfaceType ;
        }

        
      
        return data; 
    };

}
