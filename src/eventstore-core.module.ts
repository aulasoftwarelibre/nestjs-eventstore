import {
  DynamicModule,
  Global,
  Module,
  OnModuleInit,
  Provider,
} from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';

import { EventStore } from './eventstore';
import { Config } from './eventstore.config';
import { EVENT_STORE_SETTINGS_TOKEN } from './eventstore.constants';
import { IEventPublisher } from './interfaces';
import {
  ConfigService,
  EventStoreModuleAsyncOptions,
} from './interfaces/eventstore-module.interface';
import { TransformerService } from './transformer.service';

@Global()
@Module({
  imports: [CqrsModule],
  providers: [EventStore, TransformerService],
  exports: [EventStore],
})
export class EventStoreCoreModule implements OnModuleInit {
  constructor(
    private readonly event$: EventBus,
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
    this.eventStore.bridgeEventsTo((this.event$ as any).subject$);
    this.event$.publisher = <IEventPublisher>this.eventStore;
  }
}
