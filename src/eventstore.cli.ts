import { EventStoreDBClient, FORWARDS, START } from '@eventstore/db-client';
import { Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { EventHandlerType, IEvent, IEventHandler } from '@nestjs/cqrs';
import { EVENTS_HANDLER_METADATA } from '@nestjs/cqrs/dist/decorators/constants';
import { ExplorerService } from '@nestjs/cqrs/dist/services/explorer.service';
import { Command, Console } from 'nestjs-console';

import { Event } from './domain';
import { Config } from './eventstore.config';
import { EVENT_STORE_SETTINGS_TOKEN } from './eventstore.constants';
import { EventStoreMapper } from './eventstore.mapper';

@Console()
export class EventStoreCli {
  private client: EventStoreDBClient;
  private category: string;

  constructor(
    @Inject(EVENT_STORE_SETTINGS_TOKEN) config: Config,
    private readonly mapper: EventStoreMapper,
    private explorer: ExplorerService,
    private moduleRef: ModuleRef,
  ) {
    this.client = EventStoreDBClient.connectionString(config.connection);
    this.category = config.category;
  }

  @Command({
    command: 'eventstore:readmodel:restore',
    description: 'Restore read model',
  })
  async restore(): Promise<void> {
    const eventHandlers = this.getEventHandlers();

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

      position = this.incrementRevision(
        resolvedEvents[resolvedEvents.length - 1].link.revision,
      );

      const events = resolvedEvents
        .map<Event>((event) => this.mapper.resolvedEventToDomainEvent(event))
        .filter((event) => event !== undefined);

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

  private getEventHandlers(): Record<string, IEventHandler[]> {
    const handlers = this.explorer.explore().events;

    return handlers.reduce((prev, handler) => {
      const instance = this.moduleRef.get(handler, { strict: false });

      if (!instance) {
        return prev;
      }

      const eventsNames = this.reflectEventsNames(handler);

      eventsNames.map((event) => {
        const key = event.name;

        prev[key] = prev[key] ? [...prev[key], instance] : [instance];
      });

      return prev;
    }, {});
  }

  private reflectEventsNames(
    handler: EventHandlerType<IEvent>,
  ): FunctionConstructor[] {
    return Reflect.getMetadata(EVENTS_HANDLER_METADATA, handler);
  }

  private incrementRevision(revision: bigint): bigint {
    return BigInt(Number(revision) + 1);
  }
}
