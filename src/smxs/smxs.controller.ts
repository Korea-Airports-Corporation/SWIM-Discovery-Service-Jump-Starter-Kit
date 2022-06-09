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
import { SmxsService } from './smxs.service';
import { CustromHeader } from './decorator/custom-header.decorator';
import { DiscoveryServiceDto } from './dto/discovery-service.dto';
import { PeersDto } from './dto/peers.dto';
import { ServicesWrapperDto } from './dto/services-wrapper.dto';
import { ServiceWrapperDto } from './dto/service-wrapper.dto';
import { HeaderAuthValidationPipe } from './pipes/header-auth-validation.pipe';
import { QueryParamServiceCategoryValidationPipe } from './pipes/query-param-service-cateogry-validation-pipe';
import { QueryParamInterfaceTypeValidationPipe } from './pipes/query-param-interface-type-validation-pipe';
import { QueryParamAvailabilityStatusValidationPipe } from './pipes/query-param-availability-status-validation-pipe';
import { QueryParamIdentifier } from './pipes/query-param-identifier-pipe';

import { BASIC_URL } from '../config/smxs.json'
import { PeersWrapperDto } from './dto/peers-wrapper';


@Controller('smxs')
export class SmxsController {
constructor(private readonly appService: SmxsService) {}

    @Get('discovery-service')
    getDiscoveryService(
        @CustromHeader(HeaderValidationPipe) headers:any
    ): Promise<DiscoveryServiceDto> {
        return this.appService.getDiscoveryService();
    }

    @Get('peers')
    getPeers(
        @CustromHeader(HeaderValidationPipe) headers:any
    ): Promise<PeersWrapperDto> {
        return this.appService.getPeers();
    }

    @Get('services')
    getServices(
        @CustromHeader(HeaderValidationPipe) headers:any,
        @Query('service-category', QueryParamServiceCategoryValidationPipe) serviceCategory : string,
        @Query('interface-type', QueryParamInterfaceTypeValidationPipe) interfaceType : string,
        @Query('availability-status', QueryParamAvailabilityStatusValidationPipe) availabilityStatus : string
    ): Promise<ServicesWrapperDto> {
        return this.appService.getServices(serviceCategory,interfaceType,availabilityStatus);
    }

    @Get('services/:path1/*/:path2/:path3/:path4')
    getService(
        @CustromHeader(HeaderValidationPipe) headers:any,
        @CustromHeader(HeaderAuthValidationPipe) token:string,
        @Param(QueryParamIdentifier) params: any,
        ): Promise<ServiceWrapperDto> {
        
        return this.appService.getService(token, String(params.path4).replace(`"`,""));
    }

}
  