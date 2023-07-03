import { EventStoreDBClient, FORWARDS, START } from '@eventstore/db-client';
import { Inject, Logger } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';

import { Event } from './domain';
import { Config } from './eventstore.config';
import { EVENTSTORE_SETTINGS_TOKEN } from './eventstore.constants';
import { EventStoreMapper } from './eventstore.mapper';
import { ProjectionsService } from './services';

@Command({
  name: 'eventstore:readmodel:restore',
  description: 'Restore read model',
})
export class EventStoreRestoreCommand extends CommandRunner {
  private readonly client: EventStoreDBClient;
  private readonly logger = new Logger(EventStoreRestoreCommand.name);
  private readonly eventHandlers;

  constructor(
    private readonly mapper: EventStoreMapper,
    projections: ProjectionsService,
    @Inject(EVENTSTORE_SETTINGS_TOKEN) config: Config,
  ) {
    super();
    this.client = EventStoreDBClient.connectionString(config.connection);
    this.eventHandlers = projections.eventHandlers();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
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
