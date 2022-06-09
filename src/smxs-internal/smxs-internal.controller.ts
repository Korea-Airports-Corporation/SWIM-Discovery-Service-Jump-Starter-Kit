import { Controller, Get, ValidationPipe, Param, Query, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CustromHeader } from './decorator/custom-header.decorator';
import { SmxsInternalService } from './smxs-internal.service';
import { GraphQLClient, gql } from 'graphql-request'
import { DiscoveryServiceDto } from 'src/smxs-internal/dto/discovery-service.dto';
import { HeaderValidationPipe } from './pipes/header-validation.pipe';
import graphQLConfig from '../config/graphql.json'; 
import { QueryParamServiceCategoryValidationPipe } from './pipes/query-param-service-cateogry-validation-pipe';
import { QueryParamInterfaceTypeValidationPipe } from './pipes/query-param-interface-type-validation-pipe';
import { QueryParamAvailabilityStatusValidationPipe } from './pipes/query-param-availability-status-validation-pipe';
const graphQLNoAuthClient = new GraphQLClient(graphQLConfig.url)

const axios = require('axios').default;

let discoveryServices = []; 
let discoveryServicesList = []; 

// Init //
async function getDiscoveryService (){
    console.log('Started Initialization...'); 
    const query = gql`
    {
        discoveryServices {
            name,
            isEnabled,
            description,
            provider,
            endPoint
        }
    }`

    let data = await graphQLNoAuthClient.request(query);
    discoveryServicesList = data.discoveryServices; 
	
    for(let index in discoveryServicesList){
        if(discoveryServicesList[index].isEnabled===true){
	   if(discoveryServicesList[index].endPoint==='http://swim-registry.kr:8001/smxs'){
	                discoveryServicesList[index].endPoint = 'http://localhost:8001/smxs';
                                 }
            let url = discoveryServicesList[index].endPoint + '/discovery-service'; 
            let config = {
                headers : {
                    Accept : 'application/json' 
                }
            }
    
            await axios.get(url, config).then(function (response) {
                let tmp = JSON.stringify(response.data).replace(/\\n/g, '')
                tmp = tmp.replace(/\\r/g, '')
                tmp = tmp.replace(/\\/g, '')

                let regex = /\,(?!\s*?[\{\[\"\'\w])/g;
                tmp = tmp.replace(regex, '');

                if(tmp[0]==='"'){
                    tmp = tmp.substring(1, tmp.length-1);
                }
    
                discoveryServices.push(JSON.parse(tmp)); 
            })
            .catch(function (error) {
                console.log(error);
                throw new InternalServerErrorException('Caught Error');
            })
        }
    } 
    console.log(discoveryServices); 
    console.log('Finished Initialization...');    
}

getDiscoveryService(); 

// Controller // 
@Controller('smxs-internal')
export class SmxsInternalController {
    constructor(private readonly appService: SmxsInternalService) {
    }

    @Get('discovery-service-list')
    getDiscoveryService(
      //  @CustromHeader(HeaderValidationPipe) headers:any
    ): DiscoveryServiceDto[] {
        return discoveryServices;
    }
    @Get('service/:target')
    getService(
     //   @CustromHeader(HeaderValidationPipe) headers:any,
        @Query('') query : any,
        @Param() param: any,
    ): Promise<[]>  {
        //Find Endpoint 

        let endpoint = ''; 
        let serviceId = Object.keys(query); 

        for(let i in discoveryServicesList){
            let registry = {
                target : '' 
            }; 

            registry.target = discoveryServicesList[i].provider.toString().toLowerCase().replace(/ /gi, '-') 
            if(JSON.stringify(param) === JSON.stringify(registry)){
                endpoint = discoveryServicesList[i].endPoint;
            }
        }

        // 테스트 코드 

        if(param.target==='faa-swim-program'){
            endpoint = 'http://nsrr.noblis.org/smxs'
        }

        if(endpoint !== ''){
            return this.appService.getService(endpoint,String(serviceId[0]));
        } else {
            throw new BadRequestException('No Endpoint Found');
        }
    }   

    @Get('services/:target')
    getServices(
      //  @CustromHeader(HeaderValidationPipe) headers:any,
        @Param() target: object,
        @Query('service-cateogry', QueryParamServiceCategoryValidationPipe) serviceCategory : string,
        @Query('interface-type', QueryParamInterfaceTypeValidationPipe) interfaceType : string,
        @Query('availability-status', QueryParamAvailabilityStatusValidationPipe) availabilityStatus : string,
        @Query('') service : string
    ): Promise<[]>  {
        //Find Endpoint 

        let endpoint = ''; 
        let serviceName = Object.keys(service); 
        let serviceValue = Object.values(service); 
        
        for(let i in discoveryServicesList){
            let registry = {
                target : '' 
            }; 

            registry.target = discoveryServicesList[i].provider.toString().toLowerCase().replace(/ /gi, '-') 
            if(JSON.stringify(target) === JSON.stringify(registry)){
                endpoint = discoveryServicesList[i].endPoint;
            }
        }

        if(endpoint !== ''){
            if((serviceValue.length===0)&&((serviceName.length===0))){
                return this.appService.getServices(endpoint,serviceCategory,interfaceType,availabilityStatus)
            }             
            else if((serviceValue.length===1)&&((serviceName.length===1))){
                return this.appService.getServices(endpoint,serviceCategory,interfaceType,availabilityStatus)
            } 
            else if((serviceValue.length===2)&&((serviceName.length===2))){
                return this.appService.getServices(endpoint,serviceCategory,interfaceType,availabilityStatus)
            } 
            else if((serviceValue.length===3)&&((serviceName.length===3))){
                return this.appService.getServices(endpoint,serviceCategory,interfaceType,availabilityStatus)
            } 
            else {
                return this.appService.getService(endpoint,serviceName[0])
    
        }
        } else {
            throw new BadRequestException('No Endpoint Found');
        }
    }    

    @Get('peers/:target')
    getPeers(
      //  @CustromHeader(HeaderValidationPipe) headers:any,
        @Param() target: object,
    ): Promise<[]>  {
        //Find Endpoint 
        let endpoint = ''; 
        for(let i in discoveryServicesList){
            let registry = {
                target : ''
            }; 

            registry.target = discoveryServicesList[i].provider.toString().toLowerCase().replace(/ /gi, '-') 
            if(JSON.stringify(target) === JSON.stringify(registry)){

                if(discoveryServicesList[i].isEnabled){
                    endpoint = discoveryServicesList[i].endPoint;
                } else { 
                    throw new InternalServerErrorException('Target Discovery Service is not available');  
                }
                
            }
        }

        if(endpoint !== ''){
            return this.appService.getPeers(endpoint)
        } else {
            throw new BadRequestException('No Endpoint Found');
        }
    }    
}
