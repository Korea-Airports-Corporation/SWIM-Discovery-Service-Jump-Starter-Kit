import { ServiceCategoryDto } from './service-category.dto';
import { ServiceAvailabilityStatusDto } from './service-availability-status.dto';
import { InterfaceTypeDto } from './interface-type.dto';

export class ServicesDto {
  "id" : string
  "name": string;
  "description" : string;
  "service-category"? : ServiceCategoryDto;
  "service-availability-status"? : ServiceAvailabilityStatusDto;
  "interface-type"? : InterfaceTypeDto;
}
