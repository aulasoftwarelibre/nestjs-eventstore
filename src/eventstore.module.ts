import { DynamicModule, Module, Provider } from '@nestjs/common';
import { CqrsModule, EventPublisher } from '@nestjs/cqrs';
import { ExplorerService } from '@nestjs/cqrs/dist/services/explorer.service';
import { ConsoleModule } from 'nestjs-console';

import { AggregateRepository } from './aggregate.repository';
import { EventStore } from './eventstore';
import { EventStoreCli } from './eventstore.cli';
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
      providers: [EventStoreCli, ExplorerService],
    };
  }

  public static forFeature(
    aggregateRoots: Function[],
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
    aggregateRoots: Function[],
  ): Provider[] {
    return aggregateRoots.map((aggregateRoot) => ({
      provide: getRepositoryToken(aggregateRoot),
      useFactory: (eventStore: EventStore, publisher: EventPublisher) =>
        new AggregateRepository(aggregateRoot as any, eventStore, publisher),
      inject: [EventStore, EventPublisher],
    }));
  }
}
