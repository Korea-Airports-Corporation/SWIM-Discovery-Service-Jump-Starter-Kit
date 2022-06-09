import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';

const axios = require('axios').default;
const nsrr = require('../../src/config/nsrr.json');
const btoa = require('btoa');
@Injectable()
export class SmxsInternalService {

    async getServices(endpoint : string, serviceCategory? : string, interfaceType? : string, availabilityStatus? : string): Promise<[]> {

        const urlBaseline = endpoint + '/services'; 
        let query = '?'
        
        if(serviceCategory.length>0){
          query = query + 'service-category=' + serviceCategory;
        }
  
        if(availabilityStatus.length>0){
          if(query!=='?'){
            query = query+ '&'+ 'availability-status=' + availabilityStatus;
          } else {
            query = query + 'availability-status=' + availabilityStatus;
          }
        }
  
        if(interfaceType.length>0){
          if(query!=='?'){
            query =  query+ '&'+ 'interface-type=' + interfaceType;
          } else {
            query = query + 'interface-type=' + interfaceType;        
          }
        }
  
        let url = ''
  
        if(query !=='?'){
          url = urlBaseline + query
        } else {
          url = urlBaseline
        }

        let config = {
            headers : {
                Accept : 'application/json' 
            },
        }

        let data = await axios.get(url, config).then(function (response) {
            let data = JSON.stringify(response.data).replace(/\\n/g, '')
            data = data.replace(/\\r/g, '')
            data = data.replace(/\\/g, '')
            if(data[0]==='"'){
                data = data.substring(1, data.length-1);
            }
            return data; 
        })
        .catch(function (error) {
            console.log(error);
            throw new InternalServerErrorException('Caught Error');
        })

        return data;  
      }

      async getService(endpoint : string, serviceId : string ): Promise<[]> {
        //let url = endpoint + '/services/"'+serviceId+'"'; 

        //테스트용
        let url = "";
        let serviceGrid = String(serviceId).replace("http://nsrr.faa.gov/services/","");
        //
        let config = new Object();

        //테스트용
        if(endpoint==='http://nsrr.noblis.org/smxs'){
          url = endpoint + '/services/'+ serviceGrid; 
          config = {
            headers : {
                Accept : 'application/json',
                Authorization:'Basic '+ btoa('kac'+':'+'Nsrr4u3!now#')
            },
          }
        } else if(endpoint==='http://192.168.1.112:8002/smxs') { 
          url = endpoint + '/services/"'+serviceId+'"'; 
          config = {
            headers : {
                Accept : 'application/json',
                Authorization : 'Bearer ' +'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjI2NDE4NjE3LCJleHAiOjE2MjkwMTA2MTd9.B1kNAdqGVqqFD8UztMWfnXWA7Bn5AALMLp76Gu_Y_Hg'
            },
          }
        }
        
        let data = await axios.get(url, config).then(function (response) {
            let data = JSON.stringify(response.data).replace(/\\n/g, '')
            data = data.replace(/\\r/g, '')
            data = data.replace(/\\/g, '')
            if(data[0]==='"'){
                data = data.substring(1, data.length-1);
            }
            return data; 
        })
        .catch(function (error) {
            console.log(error);
            throw new InternalServerErrorException('Caught Error');
        })

        return data;  
      }

      async getPeers(endpoint : string): Promise<[]> {
        let url = endpoint + '/peers'; 
        let config = {
            headers : {
                Accept : 'application/json' ,
            },
        }

        let data = await axios.get(url, config).then(function (response) {
            let data = JSON.stringify(response.data).replace(/\\n/g, '')
            data = data.replace(/\\r/g, '')
            data = data.replace(/\\/g, '')
            if(data[0]==='"'){
                data = data.substring(1, data.length-1);
            }
            return data; 
        })
        .catch(function (error) {
            console.log(error);
            throw new InternalServerErrorException('Caught Error');
        })

        return data;  
      }

}
