import {
    Controller,
    Get,
    Post,
    Body,
    Query,
    Req,
    ValidationPipe,
    Param,
  } from '@nestjs/common';

import { HeaderValidationPipe } from './pipes/header-validation.pipe';
import { CustromHeader } from './decorator/custom-header.decorator';
import { SWIMService } from './swim.service';
import { HeaderAuthValidationPipe } from './pipes/header-auth-validation.pipe';

@Controller('swim')
export class SWIMController {
    constructor(private readonly appService: SWIMService) {}

    @Get('services')
    getServices(
        @CustromHeader(HeaderValidationPipe) headers:any
    ): Promise<any[]> {
        return this.appService.getServices();
    }
    
    @Get('services/:identifier')
    getService(
        @Param() identifier: any,
       ): Promise<any>  {
        return this.appService.getService(identifier.identifier)
    }    

    @Post('register')
    registerService (
        @CustromHeader (HeaderAuthValidationPipe) token:string,
        @Body() body,
    ): Promise<any>  {
        return this.appService.registerService(token, body)
    }    

    @Post('update')
    updateService (
        @CustromHeader (HeaderAuthValidationPipe) token:string,
        @Body() body,
    ): Promise<any>  {
        return this.appService.updateService(token, body)
    }    

    @Get('update/:identifier')
    getServiceForUpdate(
        @Param() identifier: any,
        @CustromHeader (HeaderAuthValidationPipe) token:string,
       ): Promise<any>  {
        return this.appService.getServiceForUpdate(identifier.identifier, token)
    }  

    @Get('approve/:action/:identifier/')
    approve (
        @CustromHeader (HeaderAuthValidationPipe) token:string,
        @Param() param: any,
    ): Promise<any>  {
        return this.appService.approve(token, param.identifier, param.action)
    }    

    @Post('reject/:action/:identifier')
    reject (
        @CustromHeader (HeaderAuthValidationPipe) token:string,
        @Param() param: any,
        @Body() body,
    ): Promise<any>  {
        return this.appService.reject(token, param.identifier, param.action, body)
    }    

    @Get('request/:action/:identifier')
    request (
        @CustromHeader (HeaderAuthValidationPipe) token:string,
        @Param() param: any,
    ): Promise<any>  {
        return this.appService.request(token, param.identifier, param.action)
    }    

    @Get('my-registry')
    myRegistry (
        @CustromHeader (HeaderAuthValidationPipe) token:string,
    ): Promise<any>  {
        return this.appService.myRegistry(token)
    } 
}
