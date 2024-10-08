import {
  DynamicModule,
  Global,
  Module,
  OnModuleInit,
  Provider,
} from '@nestjs/common'
import { CqrsModule, EventBus } from '@nestjs/cqrs'
import { ExplorerService } from '@nestjs/cqrs/dist/services/explorer.service'
import { MongooseModule } from '@nestjs/mongoose'

import { KEYS, KeySchema } from './crypto'
import { Event } from './domain'
import { EventStore } from './eventstore'
import { EventStoreRestoreCommand } from './eventstore.cli'
import { Config } from './eventstore.config'
import {
  EVENTSTORE_KEYSTORE_CONNECTION,
  EVENTSTORE_SETTINGS_TOKEN,
} from './eventstore.constants'
import { EventStoreMapper } from './eventstore.mapper'
import { ConfigService, EventStoreModuleAsyncOptions } from './interfaces'
import { KeyService, ProjectionsService, TransformerService } from './services'

@Global()
@Module({
  exports: [EventStore, KeyService],
  imports: [
    CqrsModule,
    MongooseModule.forFeature(
      [
        {
          name: KEYS,
          schema: KeySchema,
        },
      ],
      EVENTSTORE_KEYSTORE_CONNECTION,
    ),
  ],
  providers: [
    EventStore,
    EventStoreMapper,
    EventStoreRestoreCommand,
    ExplorerService,
    KeyService,
    ProjectionsService,
    TransformerService,
  ],
})
export class EventStoreCoreModule implements OnModuleInit {
  constructor(
    private readonly event$: EventBus<Event>,
    private readonly eventStore: EventStore,
  ) {}

  public static forRoot(config: Config): DynamicModule {
    return {
      exports: [EventStore],
      module: EventStoreCoreModule,
      providers: [{ provide: EVENTSTORE_SETTINGS_TOKEN, useValue: config }],
    }
  }

  public static forRootAsync(
    options: EventStoreModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: EventStoreCoreModule,
      providers: [this.createAsyncProvider(options)],
    }
  }

  private static createAsyncProvider(
    options: EventStoreModuleAsyncOptions,
  ): Provider {
    if ('useFactory' in options) {
      return {
        provide: EVENTSTORE_SETTINGS_TOKEN,
        ...options,
      }
    }

    return {
      provide: EVENTSTORE_SETTINGS_TOKEN,
      useFactory: async (optionsFactory: ConfigService) =>
        optionsFactory.createEventStoreConfig(),
      ...('useClass' in options
        ? { inject: [options.useClass], scope: options.scope }
        : { inject: [options.useExisting] }),
    }
  }

  onModuleInit() {
    this.eventStore.bridgeEventsTo(this.event$.subject$)
    this.event$.publisher = this.eventStore
  }
}
