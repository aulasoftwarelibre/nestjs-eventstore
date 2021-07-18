import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConsoleModule } from 'nestjs-console';
import { EventStoreModule } from './nestjs-eventstore';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountModule } from './account/infraestructure/account.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `.env.${process.env.NODE_ENV}.local`,
        `.env.${process.env.NODE_ENV}`,
        '.env.local',
        '.env',
      ],
      isGlobal: true,
    }),
    CqrsModule,
    ConsoleModule,
    EventStoreModule.forRoot({
      category: 'example',
      connection: process.env.EVENTSTORE_URI,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AccountModule,
  ],
})
export class AppModule {}
