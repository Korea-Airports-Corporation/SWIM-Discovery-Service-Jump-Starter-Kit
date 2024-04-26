import * as fs from 'fs';
import * as path from 'path';
import { Injectable, UnauthorizedException } from '@nestjs/common';
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
import { PeersWrapperDto } from './dto/peers-wrapper';
// Uncomment this line to import GraphQL
// import { GraphQLClient, gql } from 'graphql-request';

@Injectable()
export class SmxsService {

  async getDiscoveryService(): Promise<DiscoveryServiceDto> {
    // Sample code to create GraphQLClient without authorization (jwt token) 
    /*
      const graphQLClient = new GraphQLClient(YOUR_GRAPHQL_SERVER);
    */

    /* Sample query code to GraphQLServer 
      const queryDiscoveryService = gql`
      {
        discoveryService{
          endPoint,
          name,
          description,
          version,
          seeAlso,
        }
      }`
      
      const queryDiscoveryServiceProvider = gql`
      {
        discoveryServiceProvider{
          name,
          description,
          webPage
        }
      }`

      const queryDiscoveryServiceProviderContact = gql`
      {
        discoveryServiceProviderContact{
          name,
          function,
          email
        }
      }`

      const queryDiscoveryServiceOperations = gql`
      {
        discoveryServiceOperations{
          name,
          securityConstraint
        }
      }`

      try {
        const { discoveryService } = await graphQLClient.request(queryDiscoveryService);
        const { discoveryServiceProvider } = await graphQLClient.request(queryDiscoveryServiceProvider);
        const { discoveryServiceProviderContact } = await graphQLClient.request(queryDiscoveryServiceProviderContact);
        const { discoveryServiceOperations } = await graphQLClient.request(queryDiscoveryServiceOperations);      
      } catch (error){
        console.log(error);
      }
    */

    // Import Sample Data from File
    const discoveryServicePath = path.resolve(__dirname, './sample/discoveryService/discoveryService.json');
    const discoveryServiceProviderPath = path.resolve(__dirname, './sample/discoveryService/provider.json');
    const discoveryServiceProviderContactPath = path.resolve(__dirname, './sample/discoveryService/providerContact.json');
    const discoveryServiceOperationsPath = path.resolve(__dirname, './sample/discoveryService/operations.json');
    const discoveryService = JSON.parse(fs.readFileSync(discoveryServicePath,'utf-8'));
    const discoveryServiceProvider = JSON.parse(fs.readFileSync(discoveryServiceProviderPath,'utf-8'));
    const discoveryServiceProviderContact = JSON.parse(fs.readFileSync(discoveryServiceProviderContactPath,'utf-8'));
    const discoveryServiceOperations = JSON.parse(fs.readFileSync(discoveryServiceOperationsPath,'utf-8'));

    // Generate Return Data
    const discoveryServiceProviderContactFactory = new DiscoveryServiceProviderContactFactory();
    discoveryServiceProviderContactFactory.setName(discoveryServiceProviderContact.name);
    discoveryServiceProviderContactFactory.setEmail(discoveryServiceProviderContact.function);
    discoveryServiceProviderContactFactory.setFunction(discoveryServiceProviderContact.email);

    const discoveryServiceProviderFactory = new DiscoveryServiceProviderFactory();    
    discoveryServiceProviderFactory.setName(discoveryServiceProvider.name);
    discoveryServiceProviderFactory.setDescription(discoveryServiceProvider.description);
    discoveryServiceProviderFactory.setWebPage(discoveryServiceProvider.webPage);
    discoveryServiceProviderFactory.setPointOfContact(discoveryServiceProviderContactFactory.getDiscoveryServiceProviderContactData());

    const discoveryServiceOperationsFactory = new DiscoveryServiceOperationsFactory();    
    for(let i in discoveryServiceOperations){
      discoveryServiceOperationsFactory.setValue(discoveryServiceOperations[i].name, discoveryServiceOperations[i].securityConstraint);
    }

    const discoveryServiceFactory = new DiscoveryServiceFactory();
    discoveryServiceFactory.setId(discoveryService.endPoint);
    discoveryServiceFactory.setName(discoveryService.name);
    discoveryServiceFactory.setProvider(discoveryServiceProviderFactory.getDiscoveryServiceProviderData());
    discoveryServiceFactory.setDescription(discoveryService.description);
    discoveryServiceFactory.setVersion(discoveryService.version);
    discoveryServiceFactory.setOperations(discoveryServiceOperationsFactory.getDiscoveryServiceOperationData());
    discoveryServiceFactory.setSeeAlso(discoveryService.seeAlso);

    return discoveryServiceFactory.getDiscoveryServiceData();
  }

  async getPeers(): Promise<PeersWrapperDto> {
    // Sample code to create GraphQLClient without authorization (jwt token) 
    /*
      const graphQLClient = new GraphQLClient(YOUR_GRAPHQL_SERVER);
    */

    /* Sample query code to GraphQLServer 
      const query = gql`
      {
        discoveryServices {
          name,
          isEnabled,
          endPoint,
          serviceId
        }
      }`
      try {
        const { discoveryServices } = await graphQLClient.request(query);
      } catch (error){
        console.log(error);
      }

    */

    // Import Sample Data from File
    const discoveryServicesPath = path.resolve(__dirname, './sample/peers/discoveryServices.json');
    const discoveryServices = JSON.parse(fs.readFileSync(discoveryServicesPath,'utf-8'));

    // Generate Return Data
    let peers : PeersDto[] = new Array();
    
    for(let index in discoveryServices) {
      const peersFactory = new PeersFactory();
      peersFactory.setServiceId(discoveryServices[index]['serviceId']);
      peersFactory.setEndpoint(discoveryServices[index]['endPoint']);
      peers.push(peersFactory.getPeersData())
    }

    let peersWrapper = new PeersWrapperDto();
    peersWrapper['peers'] = peers; 

    return peersWrapper;
  }

  async getServices( serviceCategory? : string, interfaceType? : string, availabilityStatus? : string): Promise<ServicesWrapperDto> {
    // Sample code to create GraphQLClient without authorization (jwt token) 
    /*
      const graphQLClient = new GraphQLClient(YOUR_GRAPHQL_SERVER);
    */ 
   
    /* Sample query code with parameters to GraphQLServer 
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
        const { services } = await graphQLClient.request(query);
      } catch (error){
        console.log(error);
      }
    */

    // Import Sample Data from File
    const servicesPath = path.resolve(__dirname, './sample/services/services.json');
    const services = JSON.parse(fs.readFileSync(servicesPath,'utf-8'));

    // Generate Return Data
    let list : ServicesDto[] = new Array();
    
    for(let index in services) {
      //Check Filters
      let isFiltered = true; 
      
      if(serviceCategory){
        if(!serviceCategory.split(',').includes(services[index]['category'])){
          isFiltered = false; 
        }
      }

      if(interfaceType){
        if(!interfaceType.split(',').includes(services[index]['networkInterface'])){
          isFiltered = false; 
        }
      }

      if(availabilityStatus){
        if(!availabilityStatus.split(',').includes(services[index]['lifecycleInformation'])){
          isFiltered = false; 
        }
      }

      if(isFiltered){
        let factory = new ServicesFactory();
      
        factory.setId("http://swim-registry.kr/swim-service-description/" + services[index]['identifier']);
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
    }

    let wrapper = new ServicesWrapperDto();
    wrapper.services = list; 
    return wrapper;
  }

  //Uncomment this line if you want to check jwt token
  //async getService(token : string, identifier : string): Promise<ServiceWrapperDto> {
  async getService(identifier : string): Promise<ServiceWrapperDto> {
    // Sample code to create GraphQLClient with authorization (jwt token) 
    /*
    const graphQLClient = new GraphQLClient(YOUR_GRAPHQL_SERVER, {
        headers: {
          authorization: 'Bearer ' + token,
        },
    });
    */

    /* Sample query code with parameters to GraphQLServer 
      let filter = `(where : {identifier:"` + identifier + `"})`;

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
        const { services } = await graphQLClient.request(query);
      } catch (error){
        console.log(error);
      }
    */
    
    // Import Sample Data from File
    const servicesPath = path.resolve(__dirname, './sample/services/services.json');
    const services = JSON.parse(fs.readFileSync(servicesPath,'utf-8'));

    // Generate Return Data
    let targetService = null; 
    for (let i in services){
      if(identifier.match(services[i].identifier)){
        targetService = services[i]; 
        break;
      }
    }
    
    if(!targetService) return null; 

    let profileFactory = new ProfileFactory();

    profileFactory.setServideId("http://swim-registry.kr/swim-service-description/" + targetService.identifier);

    profileFactory.setName(targetService.serviceName);

    if(targetService.briefDescription){
      profileFactory.setDescription(targetService.briefDescription);
    } 

    profileFactory.setVersion(targetService.serviceVersion);
    profileFactory.setProviderName(targetService.providerOrganization);
    profileFactory.setProviderDescription(targetService.providerOrganizationDescription);

    if(targetService.providerOrganizationWebpage){
      profileFactory.setProviderWebpage(targetService.providerOrganizationWebpage);
    }

    profileFactory.setProviderPointOfContactName(targetService.providerPointOfContact.name);

    if(targetService.providerPointOfContact.phone){
      profileFactory.setProviderPointOfContactPhoneNumber(targetService.providerPointOfContact.phone);
    }

    profileFactory.setProviderPointOfContactEmail(targetService.providerPointOfContact.email);
    profileFactory.setProviderPointOfContactFunction(targetService.providerPointOfContact.function);

    if(targetService['category']) {
      profileFactory.setServiceCategory(targetService['category']);
    }

    if(targetService['lifecycleInformation']) {
      profileFactory.setServiceAvailabilityStatus(targetService['lifecycleInformation']);
    } 

    if(targetService['networkInterface']) {
      profileFactory.setInterfaceType(targetService['networkInterface']);
    }

    if(targetService['operation']) {
      profileFactory.setFunction(targetService['operation']);
    }

    let profile : ProfileDto = profileFactory.getProfileData();

    let serviceFactory = new ServiceFactory();

    serviceFactory.setServiceId("http://swim-registry.kr/swim-service-description/"  + targetService.identifier);
    serviceFactory.setProfile(profile); 

    let service : ServiceDto = serviceFactory.getServiceData(); 

    let wrapper = new ServiceWrapperDto();
    wrapper['service-description'] = service; 

    return wrapper;
  }
}
