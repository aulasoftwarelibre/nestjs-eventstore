import { CryptoModule } from '@akanass/nestjsx-crypto';
import {
  DynamicModule,
  Global,
  Module,
  OnModuleInit,
  Provider,
} from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { ExplorerService } from '@nestjs/cqrs/dist/services/explorer.service';
import { MongooseModule } from '@nestjs/mongoose';

import { KEYS, KeySchema, KeyService } from './crypto';
import { Event } from './domain';
import { EventStore } from './eventstore';
import { EventStoreCli } from './eventstore.cli';
import { Config } from './eventstore.config';
import { EVENT_STORE_SETTINGS_TOKEN } from './eventstore.constants';
import { EventStoreMapper } from './eventstore.mapper';
import {
  ConfigService,
  EventStoreModuleAsyncOptions,
} from './interfaces/eventstore-module.interface';
import { ProjectionsService, TransformerService } from './services';

@Global()
@Module({
  imports: [
    CryptoModule,
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: KEYS,
        schema: KeySchema,
      },
    ]),
  ],
  providers: [
    EventStore,
    EventStoreMapper,
    EventStoreCli,
    ExplorerService,
    KeyService,
    ProjectionsService,
    TransformerService,
  ],
  exports: [EventStore],
})
export class EventStoreCoreModule implements OnModuleInit {
  constructor(
    private readonly event$: EventBus<Event>,
    private readonly eventStore: EventStore,
  ) {}

  public static forRoot(config: Config): DynamicModule {
    return {
      module: EventStoreCoreModule,
      providers: [{ provide: EVENT_STORE_SETTINGS_TOKEN, useValue: config }],
      exports: [EventStore],
    };
  }

  public static forRootAsync(
    options: EventStoreModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: EventStoreCoreModule,
      providers: [this.createAsyncProvider(options)],
    };
  }

  private static createAsyncProvider(
    options: EventStoreModuleAsyncOptions,
  ): Provider {
    if ('useFactory' in options) {
      return {
        provide: EVENT_STORE_SETTINGS_TOKEN,
        ...options,
      };
    }

    return {
      provide: EVENT_STORE_SETTINGS_TOKEN,
      useFactory: async (optionsFactory: ConfigService) =>
        optionsFactory.createEventStoreConfig(),
      ...('useClass' in options
        ? { inject: [options.useClass], scope: options.scope }
        : { inject: [options.useExisting] }),
    };
  }

  onModuleInit() {
    this.eventStore.bridgeEventsTo(this.event$.subject$);
    this.event$.publisher = this.eventStore;
  }
}
