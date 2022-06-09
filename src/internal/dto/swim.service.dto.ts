export class SWIMServiceDto {
  serviceName: string;
  briefDescription: string;
  lifecycleInformation: LifecycleInformation;
  networkInterface: NetworkInterface|'NIL';
  category: Category;
  serviceVersion: string;
  providerOrganization: string;
  geographicalExtentOfService: string;
  additionalServiceDescription: string;
  accessRestriction: string;
  exchangeModels: string;
  sourcesOfInforamtion: string;
  supportAvailability: string;
  serviceValidation: string;
  protocol: string;
  messageHeader: string;
  identifier: string;
  messageExchangePattern: MessageExchangePattern|'NIL';
  filteringAvailable: boolean;
  providerOrganizationDescription: string;
  providerOrganizationWebpage: string;
  publisherId: string;
  providerPointOfContact: ProviderPointOfContact ;
  operation: Operation[]|'NIL';
  message: Message[]|'NIL';
  qualityOfService: QualityOfService|'NIL'; 
}

export interface QualityOfService {
  availability: string;
  capacity: string;
  time_behavior: string;
  recoverability: string;
  integrity: string;
  confidentiality: string;
}

export interface Message{
  "name": string;
  "description": string;
  "direction": Direction;
  "operation": string;
}

export enum Direction {
  in = "in",
  out = "out"
}

export interface Operation {
  name: string;
  description: string;
  synchronicity: Synchronicity;
  output: string;
  messageExchangePattern: MessageExchangePattern; 
  message: string;
}

export enum Synchronicity {
  asynchronous = "asynchronous",
  synchronous = "synchronous"
}


export interface ProviderPointOfContact {
  name: string;
  function: string;
  email: string;
  phone: string;
}

export enum LifecycleInformation {
  prospective = 'prospective',
  operational = 'operational',
  retired = 'retired'
}

export enum Category {
  weather = 'weather',
  aeronautical = 'aeronautical',
  flight = 'flight',
  surveillance = 'surveillance',
  infrastructure = 'infrastructure',
  world_features = 'world_features',
  messaging = 'messaging',
  mediation = 'mediation',
  discovery = 'discovery',
  security = 'security',
}

export enum NetworkInterface {
  message_oriented = 'message_oriented',
  method_oriented = 'method_oriented',
  resource_oriented = 'resource_oriented',
}

export enum MessageExchangePattern {
  request_reply = 'request_reply',
  publish_subscribe = 'publish_subscribe',
}