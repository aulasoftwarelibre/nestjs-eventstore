import {
  EventStoreDBClient,
  FORWARDS,
  ResolvedEvent,
  START,
} from '@eventstore/db-client';
import { Inject, Logger } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';

import { Event } from './domain';
import { Config } from './eventstore.config';
import { EVENTSTORE_SETTINGS_TOKEN } from './eventstore.constants';
import { EventStoreMapper } from './eventstore.mapper';
import { ProjectionsService } from './services';

@Console()
export class EventStoreCli {
  private readonly category: string;
  private readonly client: EventStoreDBClient;
  private readonly logger = new Logger(EventStoreCli.name);
  private readonly eventHandlers;

  constructor(
    private readonly mapper: EventStoreMapper,
    projections: ProjectionsService,
    @Inject(EVENTSTORE_SETTINGS_TOKEN) config: Config,
  ) {
    this.client = EventStoreDBClient.connectionString(config.connection);
    this.category = config.category;
    this.eventHandlers = projections.eventHandlers();
  }

  @Command({
    command: 'eventstore:readmodel:restore',
    description: 'Restore read model',
  })
  async restore(): Promise<void> {
    let position: any = START;
    const MAX_COUNT = 1000;

    while (true) {
      const resolvedEvents = await this.client.readStream(
        `$ce-${this.category}`,
        {
          direction: FORWARDS,
          fromRevision: position,
          maxCount: MAX_COUNT,
          resolveLinkTos: true,
        },
      );

      if (resolvedEvents.length === 0) {
        break;
      }

      await this.handleResolvedEvents(resolvedEvents);
      position = this.calculateNextPosition(resolvedEvents);
    }

    this.logger.log('Projections have been restored!');
    process.exit(0);
  }

  private async handleResolvedEvents(resolvedEvents: ResolvedEvent[]) {
    for (const resolvedEvent of resolvedEvents) {
      const event = await this.mapper.resolvedEventToDomainEvent(resolvedEvent);

      if (!event) continue;

      await this.handleEvent(event);
    }
  }

  private async handleEvent(event: Event) {
    const key = event.constructor.name;
    for (const eventHandler of this.eventHandlers[key]) {
      await eventHandler.handle(event);
    }
  }

  private calculateNextPosition(resolvedEvents: ResolvedEvent[]): bigint {
    const lastResolvedEvent = resolvedEvents[resolvedEvents.length - 1];
    const revision = lastResolvedEvent.link.revision;

    return BigInt(Number(revision) + 1);
  }
}
