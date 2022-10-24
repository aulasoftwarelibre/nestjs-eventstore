import { EventStoreDBClient, FORWARDS, START } from '@eventstore/db-client';
import { Inject, Logger } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';

import { Event } from './domain';
import { Config } from './eventstore.config';
import { EVENTSTORE_SETTINGS_TOKEN } from './eventstore.constants';
import { EventStoreMapper } from './eventstore.mapper';
import { ProjectionsService } from './services';

@Console()
export class EventStoreCli {
  private readonly client: EventStoreDBClient;
  private readonly logger = new Logger(EventStoreCli.name);
  private readonly eventHandlers;

  constructor(
    private readonly mapper: EventStoreMapper,
    projections: ProjectionsService,
    @Inject(EVENTSTORE_SETTINGS_TOKEN) config: Config,
  ) {
    this.client = EventStoreDBClient.connectionString(config.connection);
    this.eventHandlers = projections.eventHandlers();
  }

  @Command({
    command: 'eventstore:readmodel:restore',
    description: 'Restore read model',
  })
  async restore(): Promise<void> {
    const resolvedEvents = this.client.readAll({
      direction: FORWARDS,
      fromPosition: START,
      resolveLinkTos: false,
    });

    for await (const resolvedEvent of resolvedEvents) {
      if (resolvedEvent.event?.type.startsWith('$')) {
        continue;
      }

      const event = await this.mapper.resolvedEventToDomainEvent(resolvedEvent);

      if (!event) continue;

      await this.handleEvent(event);
    }

    this.logger.log('Projections have been restored!');
    process.exit(0);
  }

  private async handleEvent(event: Event) {
    const key = event.constructor.name;
    for (const eventHandler of this.eventHandlers[key]) {
      await eventHandler.handle(event);
    }
  }
}
