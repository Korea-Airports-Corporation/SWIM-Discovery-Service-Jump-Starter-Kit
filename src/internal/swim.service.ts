import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { GraphQLClient, gql } from 'graphql-request'
import graphQLConfig from '../config/graphql.json'; 
import strapiConfig from '../config/strapi.json'; 
import smxsConfig from '../config/smxs.json'; 
import { Category, LifecycleInformation, MessageExchangePattern, NetworkInterface, SWIMServiceDto } from './dto/swim.service.dto';
const graphQLNoAuthClient = new GraphQLClient(graphQLConfig.url)

@Injectable()
export class SWIMService {
  async myRegistry(token): Promise<any[]> {
    //check credential 
    const graphQLAuthClient = new GraphQLClient(graphQLConfig.url, {
      headers: {
        authorization: 'Bearer ' + token,
        },
    });

    const authQuery = gql`
    {
        me  
            {
                id
                email
                username
                role {
                    name
                }
            }
    }`;

    let authData = await graphQLAuthClient.request(authQuery);

    if(authData.me.role.name === 'swim_admin'){
    
      const findQuery = gql`
      {
        services  {
          serviceName,
          briefDescription,
          lifecycleInformation,
          category,
          serviceVersion,
          providerOrganization,
          networkInterface,
          geographicalExtentOfService,
          providerPointOfContact,
          additionalServiceDescription,
          accessRestriction,
          exchangeModels,
          serviceFunctions,
          sourcesOfInforamtion,
          supportAvailability,
          serviceValidation,
          operation,
          message,
          qualityOfService,
          messageHeader,
          filteringAvailable,
          providerOrganizationDescription,
          protocol,
          messageExchangePattern,
          providerOrganizationWebpage,
          identifier,
          status,
          reject,
          rejectReason,
          id
        }
      }`;

      let { services } = await graphQLAuthClient.request(findQuery);

      return services

    }
    else if(authData.me.role.name === 'swim_publisher'){

      let filter = `(where : {publisherId:"` + authData.me.id + `"})`;

      const findQuery = gql`
      {
        services ` + filter + ` {
          serviceName,
          briefDescription,
          lifecycleInformation,
          category,
          serviceVersion,
          providerOrganization,
          networkInterface,
          geographicalExtentOfService,
          providerPointOfContact,
          additionalServiceDescription,
          accessRestriction,
          exchangeModels,
          serviceFunctions,
          sourcesOfInforamtion,
          supportAvailability,
          serviceValidation,
          operation,
          message,
          qualityOfService,
          messageHeader,
          filteringAvailable,
          providerOrganizationDescription,
          protocol,
          messageExchangePattern,
          providerOrganizationWebpage,
          identifier,
          status,
          rejectReason,
          reject,
          id
        }
      }`;

      let { services } = await graphQLAuthClient.request(findQuery);

      return services

    } else {
      throw new UnauthorizedException(`Invalid credentials`);
    }
  }

  async updateService(token, body): Promise<any> {
    const graphQLAuthClient = new GraphQLClient(graphQLConfig.url, {
      headers: {
        authorization: 'Bearer ' + token,
        },
    });

    const authQuery = gql`
    {
        me  
            {
                id
                email
                username
                role {
                    name
                }
            }
    }`;

    
    let authData = await graphQLAuthClient.request(authQuery);

    if(authData.me.role.name === 'swim_publisher'){
      
      let form:any = new Object(); 


      let filter = `(where : {id:"` + body['id'] + `"})`;

      const query = gql`
        {
          services ` + filter + ` {
            serviceName,
            briefDescription,
            lifecycleInformation,
            category,
            serviceVersion,
            providerOrganization,
            networkInterface,
            geographicalExtentOfService,
            providerPointOfContact,
            additionalServiceDescription,
            accessRestriction,
            exchangeModels,
            serviceFunctions,
            sourcesOfInforamtion,
            supportAvailability,
            serviceValidation,
            operation,
            message,
            qualityOfService,
            messageHeader,
            filteringAvailable,
            providerOrganizationDescription,
            protocol,
            messageExchangePattern,
            providerOrganizationWebpage,
            identifier,
            status,
            reject,
            rejectReason,
            publisherId,
            previousStatus,
            id
          }
        }`;
  
      let  { services }  = await graphQLNoAuthClient.request(query);
      let service = services[0]
      if(service){
        if(!service.serviceName) throw new InternalServerErrorException('No Service Found');
        if(!service.identifier) throw new InternalServerErrorException('No Service Found');
        if(!service.publisherId) throw new InternalServerErrorException('No Service Found');   
        if(!service['id']) throw new InternalServerErrorException('No Service Found');   
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }

      if(service.serviceName){
        form.serviceName = service.serviceName;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }

      if(body.briefDescription){
        form.briefDescription = body.briefDescription;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      } 

      if(body.lifecycleInformation){
        form.lifecycleInformation = LifecycleInformation[body.lifecycleInformation];
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      } 

      if(body.networkInterface){
        form.networkInterface = NetworkInterface[body.networkInterface];
      } else {
        form.networkInterface = 'NIL';
      }

      if(body.category){
        form.category = Category[body.category];
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      } 

      if(body.serviceVersion){
        form.serviceVersion = body.serviceVersion;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      } 

      if(body.providerOrganization){
        form.providerOrganization = body.providerOrganization;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }    

      if(body.geographicalExtentOfService){
        form.geographicalExtentOfService = body.geographicalExtentOfService;
      } else { 
        form.geographicalExtentOfService = 'NIL';
      }
    
      if(body.additionalServiceDescription){
        form.additionalServiceDescription = body.additionalServiceDescription;
      } else { 
        form.additionalServiceDescription = 'NIL';
      }
    

      if(body.accessRestriction){
        form.accessRestriction = body.accessRestriction;
      }  else {
        throw new InternalServerErrorException('Internal Server Error');
      }    


      if(body.exchangeModels){
        form.exchangeModels = body.exchangeModels;
      }  else {
        throw new InternalServerErrorException('Internal Server Error');
      }    
      
      if(body.sourcesOfInforamtion){
        form.sourcesOfInforamtion = body.sourcesOfInforamtion;
      } else { 
        form.sourcesOfInforamtion = 'NIL';
      }

      if(body.supportAvailability){
        form.supportAvailability = body.supportAvailability;
      } else { 
        form.supportAvailability = 'NIL';
      }
  

      if(body.serviceValidation){
        form.serviceValidation = body.serviceValidation;
      }  else {
        form.serviceValidation = 'NIL'; 
      }    
          
      if(body.protocol){
        form.protocol = body.serviceValidation;
      }  else {
        form.protocol = 'NIL'; 
      }    

      if(body.messageHeader){
        form.messageHeader = body.messageHeader;
      }  else {
        form.messageHeader = 'NIL'; 
      }             

      if(service.identifier&&body.serviceVersion){
        form.identifier = service.identifier.toString().split("-")[0] + body.serviceVersion;
      }  else {
        throw new InternalServerErrorException('Internal Server Error');
      }    

      if(body.messageExchangePattern){
        form.messageExchangePattern = MessageExchangePattern[body.messageExchangePattern];
      }  else {
        form.messageExchangePattern = 'NIL';
      }    

      if(body.filteringAvailable){
        if(body.filteringAvailable==='true'){
          form.filteringAvailable = true;
        }else {
          form.filteringAvailable = false; 
        }
      }     

      if(body.providerOrganizationDescription){
        form.providerOrganizationDescription = body.providerOrganizationDescription;
      }  else {
        form.providerOrganizationDescription = 'NIL';
      }    

      if(body.providerOrganizationWebpage){
        form.providerOrganizationWebpage = body.providerOrganizationWebpage;
      }  else {
        form.providerOrganizationWebpage = 'NIL';
      }   
      
      if(body.providerPointOfContact){
        form.providerPointOfContact = body.providerPointOfContact;
      }  else {
        throw new InternalServerErrorException('Internal Server Error');
      }   

      if(body.operation){
        form.operation = body.operation;
      }  else {
        form.operation = 'NIL'; 
      }              
    
      if(body.operation){
        form.operation = body.operation;
      }  else {
        form.operation = 'NIL'; 
      }    

      if(body.protocol){
        form.protocol = body.protocol;
      }  else {
        form.protocol = 'NIL'; 
      }    

      if(body.qualityOfService){
        form.qualityOfService = body.qualityOfService;
      }  else {
        form.qualityOfService = 'NIL'; 
      }    

      if(body.message){
        form.message = body.message;
      }  else {
        form.message = 'NIL'; 
      }    

      form.publisherId = services[0].publisherId; 
      form.status = 'update'; 
      form.reject = false
      form.rejectReason = ''
      form.previousData = services[0]

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
      
      await axios.put(strapiConfig.url+'services/'+service['id'], JSON.stringify(form), {
        headers : headers
      }).then(resp=>{
        return resp.data
      }).catch(e => {
        console.log(e)
        throw new InternalServerErrorException(`Internal Server Error`);
      })

    } else {
      throw new UnauthorizedException(`Invalid credentials`);
    }
  }

  async deleteService(token, identifier): Promise<any> {
    const graphQLAuthClient = new GraphQLClient(graphQLConfig.url, {
      headers: {
        authorization: 'Bearer ' + token,
        },
    });

    const authQuery = gql`
    {
        me  
            {
                id
                email
                username

                role {
                    name
                }
            }
    }`;

    let authData = await graphQLAuthClient.request(authQuery);

    if(authData.me.role.name === 'swim_publisher'){
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
      
      await axios.delete(strapiConfig.url+'services/'+identifier,{
        headers : headers
      }).then(resp=>{
        return resp.data
      }).catch(e => {
        console.log(e)
        throw new InternalServerErrorException(`Internal Server Error`);
      })



    } else {
      throw new UnauthorizedException(`Invalid credentials`);
    }
  }

  async registerService(token, body): Promise<any> {
    const graphQLAuthClient = new GraphQLClient(graphQLConfig.url, {
      headers: {
        authorization: 'Bearer ' + token,
        },
    });

    const authQuery = gql`
    {
        me  
            {
                id
                email
                username
                role {
                    name
                }
            }
    }`;

    let authData = await graphQLAuthClient.request(authQuery);

    if(authData.me.role.name === 'swim_publisher'){
      
      let form:any = new Object(); 

      if(body.serviceName){
        form.serviceName = body.serviceName;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }

      let filter = `(where : {serviceName:"` + body.serviceName + `"})`;

      const query = gql`
        {
          services ` + filter + ` {
            serviceName,
            publisherId, 
            identifier, 
          }
        }`;
  
      let  { services }  = await graphQLNoAuthClient.request(query);
      if(services [0]){
        let service = services [0]
        if(service.serviceName===body.serviceName) throw new InternalServerErrorException('Duplicated Service Name Found');
        if(service.identifier===body.identifier) throw new InternalServerErrorException('Duplicated Identifier Found');
        if(service.publisherId!==body.publisherId) throw new UnauthorizedException(`Invalid Publisher`);
      }

      if(body.briefDescription){
        form.briefDescription = body.briefDescription;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      } 

      if(body.lifecycleInformation){
        form.lifecycleInformation = LifecycleInformation[body.lifecycleInformation];
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      } 

      if(body.networkInterface){
        form.networkInterface = NetworkInterface[body.networkInterface];
      } else {
        form.networkInterface = 'NIL';
      }

      if(body.category){
        form.category = Category[body.category];
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      } 

      if(body.serviceVersion){
        form.serviceVersion = body.serviceVersion;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      } 

      if(body.providerOrganization){
        form.providerOrganization = body.providerOrganization;
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }    

      if(body.geographicalExtentOfService){
        form.geographicalExtentOfService = body.geographicalExtentOfService;
      } else { 
        form.geographicalExtentOfService = 'NIL';
      }
    

      if(body.additionalServiceDescription){
        form.additionalServiceDescription = body.additionalServiceDescription;
      } else { 
        form.geographicalExtentOfService = 'NIL';
      }
    

      if(body.accessRestriction){
        form.accessRestriction = body.accessRestriction;
      }  else {
        throw new InternalServerErrorException('Internal Server Error');
      }    


      if(body.exchangeModels){
        form.exchangeModels = body.exchangeModels;
      }  else {
        throw new InternalServerErrorException('Internal Server Error');
      }    
      
      if(body.sourcesOfInforamtion){
        form.sourcesOfInforamtion = body.sourcesOfInforamtion;
      } else { 
        form.sourcesOfInforamtion = 'NIL';
      }

      if(body.supportAvailability){
        form.supportAvailability = body.supportAvailability;
      } else { 
        form.supportAvailability = 'NIL';
      }
  

      if(body.serviceValidation){
        form.serviceValidation = body.serviceValidation;
      }  else {
        form.serviceValidation = 'NIL'; 
      }    
          
      if(body.protocol){
        form.protocol = body.protocol;
      }  else {
        form.protocol = 'NIL'; 
      }    

      if(body.messageHeader){
        form.messageHeader = body.messageHeader;
      }  else {
        form.messageHeader = 'NIL'; 
      }             


      if(body.identifier){
        form.identifier = body.identifier;
      }  else {
        throw new InternalServerErrorException('Internal Server Error');
      }    

      if(body.messageExchangePattern){
        form.messageExchangePattern = MessageExchangePattern[body.messageExchangePattern];
      }  else {
        form.messageExchangePattern = 'NIL';
      }    

      if(body.filteringAvailable){
        if(body.filteringAvailable==='true'){
          form.filteringAvailable = true;
        }else {
          form.filteringAvailable = false; 
        }
      }   

      if(body.providerOrganizationDescription){
        form.providerOrganizationDescription = body.providerOrganizationDescription;
      }  else {
        form.providerOrganizationDescription = 'NIL';
      }    

      if(body.providerOrganizationWebpage){
        form.providerOrganizationWebpage = body.providerOrganizationWebpage;
      }  else {
        form.providerOrganizationWebpage = 'NIL';
      }   
      
      if(body.providerPointOfContact){
        form.providerPointOfContact = body.providerPointOfContact;
      }  else {
        throw new InternalServerErrorException('Internal Server Error');
      }   

      if(body.serviceFunctions){
        form.serviceFunctions = body.serviceFunctions;
      }  else {
        form.serviceFunctions = 'NIL'; 
      }              
    
      if(body.operation){
        form.operation = body.operation;
      }  else {
        form.operation = 'NIL'; 
      }    

      if(body.protocol){
        form.protocol = body.protocol;
      }  else {
        form.protocol = 'NIL'; 
      }    

      if(body.qualityOfService){
        form.qualityOfService = body.qualityOfService;
      }  else {
        form.qualityOfService = 'NIL'; 
      }    

      if(body.message){
        form.message = body.message;
      }  else {
        form.message = 'NIL'; 
      }    

      form.publisherId = authData.me.id ; 
      form.reject = false
      form.rejectReason = ''
      form.status = 'submit' ; 
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
      
      await axios.post(strapiConfig.url+'services', JSON.stringify(form), {
        headers : headers
      }).then(resp=>{
        return resp.data
      }).catch(e => {
        console.log(e)
        throw new InternalServerErrorException(`Internal Server Error`);
      })

    } else {
      throw new UnauthorizedException(`Invalid credentials`);
    }
  }


  async getServices(): Promise<any[]> {
      
      const query = gql`
      {
        services {
          serviceName,
          briefDescription,
          lifecycleInformation,
          category,
          serviceVersion,
          providerOrganization,
          networkInterface,
          identifier,
          status
        }
      }`;
  
      try {
        let { services } = await graphQLNoAuthClient.request(query);
        let returnServices = []
        for(let i in services){
          if(services[i].status==='approve'){
            returnServices.push(services[i]) 
          }
        }

        return returnServices;

      } catch (error){
        console.log(error);
        throw new InternalServerErrorException('Internal Server Error');
      }
    }

    async getServiceForUpdate(identifier:string, token:string): Promise<any> {
      let filter = `(where : {id:"` + identifier + `"})`;

      const graphQLAuthClient = new GraphQLClient(graphQLConfig.url, {
        headers: {
          authorization: 'Bearer ' + token,
          },
      });
  
      const authQuery = gql`
      {
          me  
              {
                  id
                  email
                  username
                  role {
                      name
                  }
              }
      }`;
  
      let authData = await graphQLAuthClient.request(authQuery);
      if(authData.me.role.name === 'swim_publisher'||authData.me.role.name === 'swim_admin'){
        const query = gql`
        {
          services ` + filter + ` {
            serviceName,
            briefDescription,
            lifecycleInformation,
            category,
            serviceVersion,
            providerOrganization,
            networkInterface,
            geographicalExtentOfService,
            providerPointOfContact,
            additionalServiceDescription,
            accessRestriction,
            exchangeModels,
            serviceFunctions,
            sourcesOfInforamtion,
            supportAvailability,
            serviceValidation,
            operation,
            message,
            qualityOfService,
            messageHeader,
            filteringAvailable,
            providerOrganizationDescription,
            protocol,
            messageExchangePattern,
            providerOrganizationWebpage,
            identifier,
            status,
            publisherId
          }
        }`;
    
        try {
          let { services } = await graphQLNoAuthClient.request(query);
          let returnServices = []
          for(let i in services){
            returnServices.push(services[i]) 
          }

          if(returnServices[0].publisherId == authData.me.id){
            return returnServices[0];
          } else if(authData.me.role.name === 'swim_admin'){
            return returnServices[0];
          }else {
            throw new UnauthorizedException(`Invalid Acesss Permission`)
          }
        } catch (error){
          console.log(error);
          throw new InternalServerErrorException('Internal Server Error');
        }
      } else {
        throw new UnauthorizedException(`Invalid Acesss Permission`)
      }
    }

    async getService(identifier:string): Promise<any> {
      let filter = `(where : {identifier:"` + identifier + `"})`;

      const query = gql`
      {
        services ` + filter + ` {
          serviceName,
          briefDescription,
          lifecycleInformation,
          category,
          serviceVersion,
          providerOrganization,
          networkInterface,
          geographicalExtentOfService,
          providerPointOfContact,
          additionalServiceDescription,
          accessRestriction,
          exchangeModels,
          serviceFunctions,
          sourcesOfInforamtion,
          supportAvailability,
          serviceValidation,
          operation,
          message,
          qualityOfService,
          messageHeader,
          filteringAvailable,
          providerOrganizationDescription,
          protocol,
          messageExchangePattern,
          providerOrganizationWebpage,
          identifier,
          status,
        }
      }`;
  
      try {
        let { services } = await graphQLNoAuthClient.request(query);
        let returnServices = []
        for(let i in services){
          if(services[i].status==='approve'){
            returnServices.push(services[i]) 
          }
        }
        return returnServices[0];
        
      } catch (error){
        console.log(error);
        throw new InternalServerErrorException('Internal Server Error');
      }
    }

    async reject(token, identifier,action, body): Promise<any> {
      const graphQLAuthClient = new GraphQLClient(graphQLConfig.url, {
        headers: {
          authorization: 'Bearer ' + token,
          },
      });
  
      const authQuery = gql`
      {
          me  
              {
                  id
                  email
                  username
                  role {
                      name
                  }
              }
      }`;
  
      let authData = await graphQLAuthClient.request(authQuery);
  
      if(authData.me.role.name === 'swim_admin'){
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
        if(action === 'update'){
          let form = Object(); 
          form.reject = true
          form.rejectReason = body.reason
          await axios.put(strapiConfig.url+'services/'+identifier, JSON.stringify(form), {
            headers : headers
          }).then(resp=>{
            return resp.data
          }).catch(e => {
            console.log(e)
            throw new InternalServerErrorException(`Internal Server Error`);
          })
        } else if(action ==='delete'){
          let form = Object(); 
          form.reject = true
          form.rejectReason = body.reason
          await axios.put(strapiConfig.url+'services/'+identifier, JSON.stringify(form), {
            headers : headers
          }).then(resp=>{
            return resp.data
          }).catch(e => {
            console.log(e)
            throw new InternalServerErrorException(`Internal Server Error`);
          })
        } else if(action ==='submit'){
          let form = Object(); 
          form.reject = true
          form.rejectReason = body.reason
          await axios.put(strapiConfig.url+'services/'+identifier, JSON.stringify(form), {
            headers : headers
          }).then(resp=>{
            return resp.data
          }).catch(e => {
            console.log(e)
            throw new InternalServerErrorException(`Internal Server Error`);
          })
        } else {
          throw new InternalServerErrorException('Internal Server Error');
        }
      } else {
        throw new UnauthorizedException(`Invalid credentials`);
      }
    }

    async approve(token, identifier,action): Promise<any> {
      const graphQLAuthClient = new GraphQLClient(graphQLConfig.url, {
        headers: {
          authorization: 'Bearer ' + token,
          },
      });
  
      const authQuery = gql`
      {
          me  
              {
                  id
                  email
                  username
                  role {
                      name
                  }
              }
      }`;
  
      let authData = await graphQLAuthClient.request(authQuery);
  
      if(authData.me.role.name === 'swim_admin'){
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
        if(action === 'update'){
          let form = Object(); 
          form.status = 'approve'
          form.reject = false
          form.rejectReason = ''
          form.previousData = {}
          await axios.put(strapiConfig.url+'services/'+identifier, JSON.stringify(form), {
            headers : headers
          }).then(resp=>{
            return resp.data
          }).catch(e => {
            console.log(e)
            throw new InternalServerErrorException(`Internal Server Error`);
          })
        } else if(action ==='delete'){
          await axios.delete(strapiConfig.url+'services/'+identifier,{
            headers : headers
          }).then(resp=>{
            return resp.data
          }).catch(e => {
            console.log(e)
            throw new InternalServerErrorException(`Internal Server Error`);
          })
        } else if(action ==='submit'){
          let form = Object(); 
          form.status = 'approve'
          form.reject = false
          form.rejectReason = ''
          await axios.put(strapiConfig.url+'services/'+identifier, JSON.stringify(form), {
            headers : headers
          }).then(resp=>{
            return resp.data
          }).catch(e => {
            console.log(e)
            throw new InternalServerErrorException(`Internal Server Error`);
          })
        } else {
          throw new InternalServerErrorException('Internal Server Error');
        }
      } else {
        throw new UnauthorizedException(`Invalid credentials`);
      }
    }

    async request(token, identifier,action): Promise<any> {
      const graphQLAuthClient = new GraphQLClient(graphQLConfig.url, {
        headers: {
          authorization: 'Bearer ' + token,
          },
      });
  
      const authQuery = gql`
      {
          me  
              {
                  id
                  email
                  username
                  role {
                      name
                  }
              }
      }`;
  
      let authData = await graphQLAuthClient.request(authQuery);
  
      if(authData.me.role.name === 'swim_publisher'){

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }

        let filter = `(where : {id:"` + identifier + `"})`;

        const query = gql`
        {
          services ` + filter + ` {
            serviceName,
            publisherId, 
            status,
            previousStatus,
            reject,
            rejectReason,
            previousData
            identifier, 
          }
        }`;
  
      let  { services }  = await graphQLNoAuthClient.request(query);
      if(services [0]){
        let service = services [0]
        if(service.publisherId!==authData.me.id) throw new UnauthorizedException(`Invalid Publisher`);
        if(action === 'update-cancel'){
          let form = Object(); 
          form = service.previousData; 
          form.previousStatus = null;
          form.status = service.previousStatus;
          form.reject = false;
          form.rejectReason = '';          
          form.previousData = {}; 
          await axios.put(strapiConfig.url+'services/'+identifier, JSON.stringify(form), {
            headers : headers
          }).then(resp=>{

            return resp.data
          }).catch(e => {
            console.log(e)
            throw new InternalServerErrorException(`Internal Server Error`);
          })
        } else if(action === 'delete'){
          let form = Object(); 
          form.previousStatus = service.status;
          form.status = 'delete';
          form.reject = false;
          form.rejectReason = '';
          await axios.put(strapiConfig.url+'services/'+identifier, JSON.stringify(form), {
            headers : headers
          }).then(resp=>{
            return resp.data
          }).catch(e => {
            console.log(e)
            throw new InternalServerErrorException(`Internal Server Error`);
          })
        } else if(action ==='delete-cancel'){
          let form = Object(); 
          form.previousStatus = null;
          form.status = service.previousStatus;
          form.reject = false;
          form.rejectReason = '';   
          await axios.put(strapiConfig.url+'services/'+identifier, JSON.stringify(form), {
            headers : headers
          }).then(resp=>{
            return resp.data
          }).catch(e => {
            console.log(e)
            throw new InternalServerErrorException(`Internal Server Error`);
          })
        } else {
          throw new InternalServerErrorException('Internal Server Error');
        }
      } else {
        throw new UnauthorizedException(`Invalid credentials`);
      }
    }
  }
}
