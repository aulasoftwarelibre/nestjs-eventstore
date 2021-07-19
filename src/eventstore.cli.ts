import { EventStoreDBClient, FORWARDS, START } from '@eventstore/db-client';
import { Inject } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';

import { Config } from './eventstore.config';
import { EVENTSTORE_SETTINGS_TOKEN } from './eventstore.constants';
import { EventStoreMapper } from './eventstore.mapper';
import { ProjectionsService } from './services';

@Console()
export class EventStoreCli {
  private client: EventStoreDBClient;
  private category: string;

  constructor(
    private readonly mapper: EventStoreMapper,
    private readonly projections: ProjectionsService,
    @Inject(EVENTSTORE_SETTINGS_TOKEN) private readonly config: Config,
  ) {
    this.client = EventStoreDBClient.connectionString(config.connection);
    this.category = config.category;
  }

  @Command({
    command: 'eventstore:readmodel:restore',
    description: 'Restore read model',
  })
  async restore(): Promise<void> {
    const eventHandlers = this.projections.eventHandlers();

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

      const lastResolvedEvent = resolvedEvents[resolvedEvents.length - 1];
      position = this.incrementRevision(lastResolvedEvent.link.revision);

      const events = await this.mapper.resolvedEventsToDomainEvents(
        resolvedEvents,
      );

      for (const event of events) {
        const key = event.constructor.name;

        for (const eventHandler of eventHandlers[key]) {
          await eventHandler.handle(event);
        }
      }
    }

    console.log('View db has been restored!');
    process.exit(0);
  }

  private incrementRevision(revision: bigint): bigint {
    return BigInt(Number(revision) + 1);
  }
}
