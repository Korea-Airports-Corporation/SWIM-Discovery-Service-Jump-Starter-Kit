import { DiscoveryServiceProviderContactDto } from '../dto/discovery-service-provider-contact.dto';

export class DiscoveryServiceProviderDto {
  name: string;
  description: string;
  "web page": string;
  "point of contact": DiscoveryServiceProviderContactDto;
}
