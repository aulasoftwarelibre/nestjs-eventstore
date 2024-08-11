import { DynamicModule, Module, Provider, Type } from '@nestjs/common'
import { CqrsModule, EventPublisher } from '@nestjs/cqrs'

import { AggregateRepository } from './aggregate.repository'
import { AggregateRoot } from './domain'
import { EventStore } from './eventstore'
import { Config } from './eventstore.config'
import { EventStoreCoreModule } from './eventstore-core.module'
import { EventStoreModuleAsyncOptions, TransformerRepo } from './interfaces'
import { EVENT_STORE_TRANSFORMERS_TOKEN, KeyService } from './services'
import { getRepositoryToken } from './utils'

@Module({})
export class EventStoreModule {
  public static forRoot(options: Config): DynamicModule {
    return {
      imports: [EventStoreCoreModule.forRoot(options)],
      module: EventStoreModule,
    }
  }

  public static forRootAsync(
    options: EventStoreModuleAsyncOptions,
  ): DynamicModule {
    return {
      imports: [CqrsModule, EventStoreCoreModule.forRootAsync(options)],
      module: EventStoreModule,
    }
  }

  public static forFeature(
    aggregateRoots: Array<Type<AggregateRoot>>,
    transformer: TransformerRepo,
  ): DynamicModule {
    const aggregateRepoProviders =
      this.createAggregateRepositoryProviders(aggregateRoots)

    const transformersProvider = {
      provide: EVENT_STORE_TRANSFORMERS_TOKEN,
      useValue: transformer,
    }

    return {
      exports: [transformersProvider, ...aggregateRepoProviders],
      imports: [CqrsModule],
      module: EventStoreModule,
      providers: [transformersProvider, ...aggregateRepoProviders],
    }
  }

  private static createAggregateRepositoryProviders(
    aggregateRoots: Array<Type<AggregateRoot>>,
  ): Provider[] {
    return aggregateRoots.map((aggregateRoot) => ({
      inject: [EventStore, EventPublisher, KeyService],
      provide: getRepositoryToken(aggregateRoot),
      useFactory: (
        eventStore: EventStore,
        publisher: EventPublisher,
        keyService: KeyService,
      ) =>
        new AggregateRepository(
          aggregateRoot,
          eventStore,
          publisher,
          keyService,
        ),
    }))
  }
}
