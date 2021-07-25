import {
  AppendExpectedRevision,
  END,
  ErrorType,
  EventData,
  EventStoreDBClient,
  FORWARDS,
  jsonEvent,
  JSONType,
  NO_STREAM,
  ResolvedEvent,
  START,
} from '@eventstore/db-client';
import { Inject, Injectable, Logger, Type } from '@nestjs/common';
import { IEventPublisher, IMessageSource } from '@nestjs/cqrs';
import { Subject } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { AggregateRoot, Event } from './domain';
import { Config } from './eventstore.config';
import { EVENTSTORE_SETTINGS_TOKEN } from './eventstore.constants';
import { EventStoreMapper } from './eventstore.mapper';
import { KeyService } from './services';

@Injectable()
export class EventStore
  implements IEventPublisher<Event>, IMessageSource<Event>
{
  private category: string;
  private client: EventStoreDBClient;
  private readonly logger = new Logger(EventStore.name);

  constructor(
    @Inject(EVENTSTORE_SETTINGS_TOKEN) private readonly config: Config,
    private readonly mapper: EventStoreMapper,
    private readonly keyService: KeyService,
  ) {
    this.category = config.category;
    this.client = EventStoreDBClient.connectionString(config.connection);
  }

  async publishAll<T extends Event>(events: T[]) {
    events = [...events];

    if (events.length === 0) {
      return;
    }

    const streamName = this.getStreamName(events[0]);
    const expectedRevision = this.getExpectedRevision(events[0]);

    const eventsData = [];
    for (const event of events) {
      const eventData = await this.createEventData(event);

      eventsData.push(eventData);
    }

    try {
      this.client.appendToStream(streamName, eventsData, {
        expectedRevision: expectedRevision,
      });
    } catch (e) {
      this.logger.error(`Error publishing all events: ${e.message}`);
    }
  }

  async publish<T extends Event>(event: T) {
    const streamName = this.getStreamName(event);
    const expectedRevision = this.getExpectedRevision(event);

    const eventData = await this.createEventData(event);

    try {
      await this.client.appendToStream(streamName, eventData, {
        expectedRevision: expectedRevision,
      });
    } catch (e) {
      this.logger.error(`Error publishing event: ${e.message}`);
    }
  }

  async read<T extends AggregateRoot>(
    aggregate: Type<T>,
    id: string,
  ): Promise<T> | null {
    const streamName = `${this.category}-${id}`;

    try {
      const entity = <T>Reflect.construct(aggregate, []);
      const resolvedEvents = await this.client.readStream(streamName, {
        direction: FORWARDS,
        fromRevision: START,
      });

      const events = await Promise.all(
        resolvedEvents.map<Promise<Event>>((event) =>
          this.mapper.resolvedEventToDomainEvent(event),
        ),
      );

      entity.loadFromHistory(events);

      return entity;
    } catch (error) {
      if (error?.type === ErrorType.STREAM_NOT_FOUND) {
        return null;
      }

      this.logger.error(error);
    }

    return null;
  }

  async bridgeEventsTo<T extends Event>(subject: Subject<T>) {
    const streamName = `$ce-${this.category}`;

    const onEvent = async (resolvedEvent: ResolvedEvent) => {
      subject.next(
        <T>await this.mapper.resolvedEventToDomainEvent(resolvedEvent),
      );
    };

    try {
      await this.client
        .subscribeToStream(streamName, {
          fromRevision: END,
          resolveLinkTos: true,
        })
        .on('data', onEvent);
    } catch (error) {
      this.logger.error(error);
    }
  }

  private getStreamName<T extends Event>(event: T) {
    return `${this.category}-${event.aggregateId}`;
  }

  private getExpectedRevision<T extends Event>(
    event: T,
  ): AppendExpectedRevision {
    return event.version <= 0 ? NO_STREAM : BigInt(event.version - 1);
  }

  private async createEventData<T extends Event>(event: T): Promise<EventData> {
    if (event.aggregateEncrypted) {
      event = (await this.keyService.encryptEvent(event)) as T;
    }

    return jsonEvent({
      id: uuid(),
      type: event.eventType,
      data: event.payload as JSONType,
      metadata: event.metadata,
    });
  }
}
