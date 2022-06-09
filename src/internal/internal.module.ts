import { Module } from '@nestjs/common';
import { SWIMController } from './swim.controller';
import { SWIMService } from './swim.service';
import { UAMSWIMController } from './uam.swim.controller';
import { UAMSWIMService } from './uam.swim.service';


@Module({
  controllers: [SWIMController, UAMSWIMController],
  providers: [SWIMService, UAMSWIMService]
})
export class InternalModule {}
