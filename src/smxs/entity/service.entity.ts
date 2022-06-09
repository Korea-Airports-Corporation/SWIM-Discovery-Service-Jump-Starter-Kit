import { ProfileDto } from './../dto/profile.dto';
import { ModelDto } from '../dto/model.dto';
import { GroundingDto } from '../dto/grounding.dto';
import { ServiceDto } from '../dto/service.dto';

interface IServiceFactory {
    setServideId(value: string) : void;
    setModel(value: ModelDto) : void;
    setProfile(value: ProfileDto) : void;
    setGrounding(value: GroundingDto) : void;
    getServiceData() : ServiceDto;
  }

export class ServiceFactory implements IServiceFactory {
  
    private _serviceId : string;
    private _profile: ProfileDto;
    private _model : ModelDto;
    private _grounding : GroundingDto;
    
    constructor() {}

    setServideId(value) : void {
        this._serviceId = value;
    };

    setModel(value) : void {
        this._model = value;
    };

    setProfile(value) : void {
        this._profile = value;
    };

    setGrounding(value) : void {
        this._grounding = value;
    };

    
    getServiceData() : ServiceDto {

        const data = {
            "service-id" : this._serviceId ,
            "profile": this._profile,
        }

        if(this._model){
            data["model"] = this._model;
        }

        if(this._grounding){
            data["grounding"] = this._grounding;
        }
      
        return data; 
    };

}
