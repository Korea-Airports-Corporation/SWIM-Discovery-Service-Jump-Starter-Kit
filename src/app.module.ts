import { Module } from '@nestjs/common';
import { SmxsModule } from './smxs/smxs.module';
import { SmxsInternalModule } from './smxs-internal/smxs-internal.module';
import { AuthModule } from './auth/auth.module';
import { InternalModule } from './internal/internal.module';

@Module({
  imports: [SmxsModule, SmxsInternalModule, AuthModule, InternalModule],
})
export class AppModule {}
