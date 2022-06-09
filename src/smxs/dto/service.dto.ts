import { GroundingDto } from "./grounding.dto";
import { ModelDto } from "./model.dto";
import { ProfileDto } from "./profile.dto";

export class ServiceDto {
  "service-id" : string;
  "profile": ProfileDto;
  "model"? : ModelDto;
  "grounding"? : GroundingDto;
}
