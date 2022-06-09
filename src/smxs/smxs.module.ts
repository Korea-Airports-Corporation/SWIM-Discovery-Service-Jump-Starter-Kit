import { Module } from '@nestjs/common';
import { SmxsService } from './smxs.service';
import { SmxsController } from './smxs.controller';

@Module({
  controllers: [SmxsController],
  providers: [SmxsService]
})
export class SmxsModule {}
