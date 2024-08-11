import {
  EVENTSTORE_KEYSTORE_CONNECTION,
  EventStoreModule,
} from '@aulasoftwarelibre/nestjs-eventstore'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CqrsModule } from '@nestjs/cqrs'
import { MongooseModule } from '@nestjs/mongoose'

import { AccountModule } from './account'
import { UserModule } from './user'

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
    EventStoreModule.forRoot({
      connection: process.env.EVENTSTORE_URI,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, {}),
    MongooseModule.forRoot(process.env.KEYSTORE_URI, {
      connectionName: EVENTSTORE_KEYSTORE_CONNECTION,
    }),
    AccountModule,
    UserModule,
  ],
})
export class AppModule {}
