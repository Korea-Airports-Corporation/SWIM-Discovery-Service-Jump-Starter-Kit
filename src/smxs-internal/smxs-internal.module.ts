import { Module } from '@nestjs/common';
import { SmxsInternalService } from './smxs-internal.service';
import { SmxsInternalController } from './smxs-internal.controller';

@Module({
  controllers: [SmxsInternalController],
  providers: [SmxsInternalService]
})
export class SmxsInternalModule {}

