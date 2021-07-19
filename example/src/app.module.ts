import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsoleModule } from 'nestjs-console';
import { EventStoreModule } from './nestjs-eventstore';
import { AccountModule } from './account';
import {
  EventStoreModule,

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
