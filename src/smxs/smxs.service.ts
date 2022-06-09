import { Injectable, UnauthorizedException } from '@nestjs/common';

import { GraphQLClient, gql } from 'graphql-request'
import { DiscoveryServiceDto } from './dto/discovery-service.dto';
import { DiscoveryServiceFactory } from './entity/discovery-service.entity';
import { DiscoveryServiceProviderFactory } from './entity/discovery-service-provider.entity';
import { DiscoveryServiceOperationsFactory } from './entity/discovery-service-operations.entity';
import { DiscoveryServiceProviderContactFactory } from './entity/discovery-service-provider-contact.entity';
import { PeersDto } from './dto/peers.dto';
import { PeersFactory } from './entity/peers.entity';
import { ServicesDto } from './dto/services.dto';
import { ProfileDto } from './dto/profile.dto';
import { ServiceDto } from './dto/service.dto';
import { ServicesWrapperDto } from './dto/services-wrapper.dto';
import { ServiceWrapperDto } from './dto/service-wrapper.dto';
import { ServicesFactory } from './entity/services.entity';
import { ServiceFactory } from './entity/service.entity';
import { ProfileFactory } from './entity/profile.entity';
import graphQLConfig from '../config/graphql.json'
const graphQLNoAuthClient = new GraphQLClient(graphQLConfig.url)

import { BASIC_URL } from '../config/smxs.json'
import { PeersWrapperDto } from './dto/peers-wrapper';

@Injectable()
export class SmxsService {

  async getDiscoveryService(): Promise<DiscoveryServiceDto> {

    const queryKacDiscoveryService = gql`
    {
      kacDiscoveryService{
        endPoint,
        name,
        description,
        version,
        seeAlso,
      }
    }`
    
    const queryKacDiscoveryServiceProvider = gql`
    {
      kacDiscoveryServiceProvider{
        name,
        description,
        webPage
      }
    }`

    const queryKacDiscoveryServiceProviderContact = gql`
    {
      kacDiscoveryServiceProviderContact{
        name,
        function,
        email
      }
    }`

    const queryKacDiscoveryServiceOperations = gql`
    {
      kacDiscoveryServiceOperations{
        name,
        securityConstraint
      }
    }`

    let { kacDiscoveryService } = await graphQLNoAuthClient.request(queryKacDiscoveryService);
    let { kacDiscoveryServiceProvider } = await graphQLNoAuthClient.request(queryKacDiscoveryServiceProvider);
    let { kacDiscoveryServiceProviderContact } = await graphQLNoAuthClient.request(queryKacDiscoveryServiceProviderContact);
    let { kacDiscoveryServiceOperations } = await graphQLNoAuthClient.request(queryKacDiscoveryServiceOperations);


    let kacDiscoveryServiceProviderContactFactory = new DiscoveryServiceProviderContactFactory();
    kacDiscoveryServiceProviderContactFactory.setName(kacDiscoveryServiceProviderContact.name);
    kacDiscoveryServiceProviderContactFactory.setEmail(kacDiscoveryServiceProviderContact.function);
    kacDiscoveryServiceProviderContactFactory.setFunction(kacDiscoveryServiceProviderContact.email);

    let kacDiscoveryServiceProviderFactory = new DiscoveryServiceProviderFactory();    
    kacDiscoveryServiceProviderFactory.setName(kacDiscoveryServiceProvider.name);
    kacDiscoveryServiceProviderFactory.setDescription(kacDiscoveryServiceProvider.description);
    kacDiscoveryServiceProviderFactory.setWebPage(kacDiscoveryServiceProvider.webPage);
    kacDiscoveryServiceProviderFactory.setPointOfContact(kacDiscoveryServiceProviderContactFactory.getDiscoveryServiceProviderContactData());

    let kacDiscoveryServiceOperationsFactory = new DiscoveryServiceOperationsFactory();    
    for(let i in kacDiscoveryServiceOperations){
      kacDiscoveryServiceOperationsFactory.setValue(kacDiscoveryServiceOperations[i].name,kacDiscoveryServiceOperations[i].securityConstraint);
    }

    let kacDiscoveryServiceFactory = new DiscoveryServiceFactory();
    kacDiscoveryServiceFactory.setId(kacDiscoveryService.endPoint);
    kacDiscoveryServiceFactory.setName(kacDiscoveryService.name);
    kacDiscoveryServiceFactory.setProvider(kacDiscoveryServiceProviderFactory.getDiscoveryServiceProviderData());
    kacDiscoveryServiceFactory.setDescription(kacDiscoveryService.description);
    kacDiscoveryServiceFactory.setVersion(kacDiscoveryService.version);
    kacDiscoveryServiceFactory.setOperations(kacDiscoveryServiceOperationsFactory.getDiscoveryServiceOperationData());
    kacDiscoveryServiceFactory.setSeeAlso(kacDiscoveryService.seeAlso);

    return kacDiscoveryServiceFactory.getDiscoveryServiceData();
  }

  async getPeers(): Promise<PeersWrapperDto> {

    const query = gql`
    {
      discoveryServices {
        name,
        isEnabled,
        endPoint,
        serviceId
      }
    }`

    let { discoveryServices } = await graphQLNoAuthClient.request(query);
    let peers : PeersDto[] = new Array();
    
    for(let index in discoveryServices) {
      let factory = new PeersFactory();
      factory.setServiceId(discoveryServices[index]['serviceId']);
      factory.setEndpoint(discoveryServices[index]['endPoint']);
      peers.push(factory.getPeersData())

      if(discoveryServices[index]['isSds'] === true){

      }
    }
    let wrapper = new PeersWrapperDto();
    wrapper['peers'] = peers; 

    return wrapper;

  }

  async getServices( serviceCategory? : string, interfaceType? : string, availabilityStatus? : string): Promise<ServicesWrapperDto> {

    let filter = ``;

    if(serviceCategory === '' && interfaceType === '' && availabilityStatus === '') {
    } else {
      filter = `(where :`;  
    }

    if(serviceCategory!=='') {
      let values = serviceCategory.split(',');
      filter = filter + `{category:"` + values + `"`;
    }

    if(interfaceType!=='') {
      let values = interfaceType.split(',');

      if(filter === `(where :`) {
        filter = filter +  `{networkInterface:"` + values + `"`;
      } else {
        filter = filter + `,networkInterface:"` + values + `"`;
      }
    }

    if(availabilityStatus!=='') {
      let values = availabilityStatus.split(',');

      if(filter === `(where :`) {
        filter = filter + `{lifecycleInformation:"` + values + `"`;
      } else {
        filter = filter + `,lifecycleInformation:"` + values + `"`;
      }
    }

    if (filter ===``){
      filter =  `(where : {status : "approve"})`
    } else {
      filter = filter +`, status : "approve"})`; 
    }
    
    const query = gql`
    {
      services ` + filter + ` {
        serviceName,
        briefDescription,
        lifecycleInformation,
        category,
        networkInterface,
        identifier
      }
    }`;

    try {
      let { services } = await graphQLNoAuthClient.request(query);
      let list : ServicesDto[] = new Array();
      
      for(let index in services) {
        let factory = new ServicesFactory();
        
        factory.setId(BASIC_URL+services[index]['identifier']);
        factory.setName(services[index]['serviceName']);
        factory.setDescription(services[index]['briefDescription']);

        if(services[index]['category']) {
          factory.setServiceCategory(services[index]['category']);
        }

        if(services[index]['lifecycleInformation']) {
          factory.setServiceAvailabilityStatus(services[index]['lifecycleInformation']);
        } 

        if(services[index]['networkInterface']) {
          factory.setInterfaceType(services[index]['networkInterface']);
        }

        list.push(factory.getServicesData());
        
      }
      let wrapper = new ServicesWrapperDto();
      wrapper.services = list; 
      return wrapper;

    } catch (error){
      console.log(error);
      if(JSON.stringify(error).includes('Invalid token')) {
        throw new UnauthorizedException('Invalid credentials');
      }
    }
  }

  async getService(token : string, identifier : string): Promise<ServiceWrapperDto> {
     
    const graphQLAuthClient = new GraphQLClient(graphQLConfig.url, {
        headers: {
          authorization: 'Bearer ' + token,
        },
    });

    let filter = `(where : {identifier:"` + identifier + `", status:"approve"})`;

    const query = gql`
    {
      services ` + filter + ` {
        serviceName,
        briefDescription,
        lifecycleInformation,
        category,
        serviceVersion,
        networkInterface,
        providerOrganization,
        providerOrganizationWebpage,
        providerOrganizationDescription,
        providerPointOfContact,
        operation,
        identifier
      }
    }`;
    
    try {

      let { services } = await graphQLNoAuthClient.request(query);
  
      let profileFactory = new ProfileFactory();

      profileFactory.setServideId(BASIC_URL + services[0].identifier);
 
      profileFactory.setName(services[0].serviceName);

      if(services[0].briefDescription){
        profileFactory.setDescription(services[0].briefDescription);
      } 

      profileFactory.setVersion(services[0].serviceVersion);
      profileFactory.setProviderName(services[0].providerOrganization);
      profileFactory.setProviderDescription(services[0].providerOrganizationDescription);

      if(services[0].providerOrganizationWebpage){
        profileFactory.setProviderWebpage(services[0].providerOrganizationWebpage);
      }

      profileFactory.setProviderPointOfContactName(services[0].providerPointOfContact.name);

      if(services[0].providerPointOfContact.phone){
        profileFactory.setProviderPointOfContactPhoneNumber(services[0].providerPointOfContact.phone);
      }

      profileFactory.setProviderPointOfContactEmail(services[0].providerPointOfContact.email);
      profileFactory.setProviderPointOfContactFunction(services[0].providerPointOfContact.function);

      if(services[0]['category']) {
        profileFactory.setServiceCategory(services[0]['category']);
      }

      if(services[0]['lifecycleInformation']) {
        profileFactory.setServiceAvailabilityStatus(services[0]['lifecycleInformation']);
      } 

      if(services[0]['networkInterface']) {
        profileFactory.setInterfaceType(services[0]['networkInterface']);
      }

      if(services[0]['operation']) {
        profileFactory.setFunction(services[0]['operation']);
      }

      let profile : ProfileDto = profileFactory.getProfileData();

      let serviceFactory = new ServiceFactory();

      serviceFactory.setServideId(BASIC_URL + services[0].identifier);
      serviceFactory.setProfile(profile); 

      let service : ServiceDto = serviceFactory.getServiceData(); 

      let wrapper = new ServiceWrapperDto();
      wrapper['service-description'] = service; 

      return wrapper;

    } catch (error){
      console.log(error);
      if(JSON.stringify(error).includes('Invalid token')) {
        throw new UnauthorizedException('Invalid credentials');
      }
    }
  }
}
