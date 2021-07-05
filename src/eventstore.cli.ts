import { ModuleRef } from '@nestjs/core';
import { EventHandlerType, IEvent } from '@nestjs/cqrs';
import { ExplorerService } from '@nestjs/cqrs/dist/services/explorer.service';
import { Command, Console } from 'nestjs-console';

import { EventStore } from './eventstore';

export const EVENTS_HANDLER_METADATA = '__eventsHandler';

@Console()
export class EventStoreCli {
  constructor(
    private eventstore: EventStore,
    private explorer: ExplorerService,
    private moduleRef: ModuleRef,
  ) {}

  @Command({
    command: 'eventstore:readmodel:restore',
    description: 'Restore read model',
  })
  async restore(): Promise<void> {
    const handlers = this.explorer.explore().events;
    const projections = handlers.reduce((prev, handler) => {
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

    const events = await this.eventstore.getEvents();
    for (const event of events) {
      const key = event.constructor.name;

      for (const projection of projections[key]) {
        await projection.handle(event);
      }
    }

    console.log('View db has been restored!');
    process.exit(0);
  }

  private reflectEventsNames(
    handler: EventHandlerType<IEvent>,
  ): FunctionConstructor[] {
    return Reflect.getMetadata(EVENTS_HANDLER_METADATA, handler);
  }
}
