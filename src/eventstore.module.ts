import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { ConsoleModule } from 'nestjs-console';

import { AggregateRepository } from './aggregate.repository';
import { AggregateRoot } from './domain';
import { EventStore } from './eventstore';
import { Config } from './eventstore.config';
import { EventStoreCoreModule } from './eventstore-core.module';
import { EventStoreModuleAsyncOptions, TransformerRepo } from './interfaces';
import { EVENT_STORE_TRANSFORMERS_TOKEN } from './transformer.service';
import { getRepositoryToken } from './utils/repository';

@Module({})
export class EventStoreModule {
  public static forRoot(options: Config): DynamicModule {
    return {
      module: EventStoreModule,
      imports: [EventStoreCoreModule.forRoot(options)],
    };
  }

  public static forRootAsync(
    options: EventStoreModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: EventStoreModule,
      imports: [
        ConsoleModule,
        CqrsModule,
        EventStoreCoreModule.forRootAsync(options),
      ],
    };
  }

  public static forFeature(
    aggregateRoots: Array<Type<AggregateRoot>>,
    transformer: TransformerRepo,
  ): DynamicModule {
    const aggregateRepoProviders =
      this.createAggregateRepositoryProviders(aggregateRoots);

    const transformersProvider = {
      provide: EVENT_STORE_TRANSFORMERS_TOKEN,
      useValue: transformer,
    };

    return {
      module: EventStoreModule,
      imports: [CqrsModule],
      providers: [transformersProvider, ...aggregateRepoProviders],
      exports: [transformersProvider, ...aggregateRepoProviders],
    };
  }

  private static createAggregateRepositoryProviders(
    aggregateRoots: Array<Type<AggregateRoot>>,
  ): Provider[] {
    return aggregateRoots.map((aggregateRoot) => ({
      provide: getRepositoryToken(aggregateRoot),
      useFactory: (eventStore: EventStore, publisher: EventPublisher) =>
        new AggregateRepository(aggregateRoot, eventStore, publisher),
      inject: [EventStore, EventPublisher],
    }));
  }
}
