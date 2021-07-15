import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConsoleModule } from 'nestjs-console';
import { EventStoreModule } from './eventstore';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountModule } from './account/infraestructure/account.module';

@Module({
  imports: [
    CqrsModule,
    ConsoleModule,
    EventStoreModule.forRoot({
      category: 'example',
      connection: 'esdb://localhost:2113?tls=false',
    }),
    MongooseModule.forRoot('mongodb://localhost/projections'),
    AccountModule,
  ],
})
export class AppModule {}
