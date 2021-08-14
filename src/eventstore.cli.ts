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
    const resolvedEvents = await this.client.readStream(
      `$ce-${this.category}`,
      {
        direction: FORWARDS,
        fromRevision: START,
        resolveLinkTos: true,
      },
    );

    for await (const resolvedEvent of resolvedEvents) {
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
