import { Module } from '@nestjs/common';
import { SmxsModule } from './smxs/smxs.module';

@Module({
  imports: [SmxsModule],
})

export class AppModule {}
