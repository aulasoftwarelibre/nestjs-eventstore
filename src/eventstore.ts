import {
  END,
  ErrorType,
  EventStoreDBClient,
  FORWARDS,
  jsonEvent,
  NO_STREAM,
  ResolvedEvent,
  START,
} from '@eventstore/db-client';
import { Inject, Injectable, Logger, Type } from '@nestjs/common';
import { Subject } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { AggregateRoot, Event, Metadata, Payload } from './domain';
import { Config } from './eventstore.config';
import { EVENT_STORE_SETTINGS_TOKEN } from './eventstore.constants';
import { IEventPublisher, IMessageSource } from './interfaces';
import { TransformerService } from './transformer.service';

@Injectable()
export class EventStore implements IEventPublisher, IMessageSource {
  private category: string;
  private client: EventStoreDBClient;
  private readonly logger = new Logger(EventStore.name);

  constructor(
    @Inject(EVENT_STORE_SETTINGS_TOKEN)
    private readonly config: Config,
    private readonly transformers: TransformerService,
  ) {
    this.category = config.category;
    this.client = EventStoreDBClient.connectionString(config.connection);
  }

  async getEvents(): Promise<Event<any>[]> {
    const resolvedEvents = await this.client.readAll({
      direction: FORWARDS,
      fromPosition: START,
    });

    return resolvedEvents
      .filter((resolvedEvent) => !resolvedEvent.event.type.startsWith('$'))
      .map<Event<any>>((event) => this.convertEvent(event));
  }

  async publish<T extends Event<any>>(event: T) {
    const streamName = `${this.category}-${event.aggregateId}`;
    const expectedRevision =
      event.version <= 0 ? NO_STREAM : BigInt(event.version - 1);

    const eventData = jsonEvent({
      id: uuid(),
      type: event.eventType,
      data: event.payload,
      metadata: event.metadata,
    });

    await this.client.appendToStream(streamName, eventData, {
      expectedRevision: expectedRevision,
    });
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

      const events = resolvedEvents.map<Event<any>>((event) =>
        this.convertEvent(event),
      );

      entity.loadFromHistory(events);

      return entity;
    } catch (err) {
      if (err.type === ErrorType.STREAM_NOT_FOUND) {
        return null;
      }

      this.logger.debug(err);
    }

    return null;
  }

  async bridgeEventsTo<T extends Event<any>>(subject: Subject<T>) {
    const streamName = `$ce-${this.category}`;

    const onEvent = async (resolvedEvent: ResolvedEvent) => {
      subject.next(<T>this.convertEvent(resolvedEvent));
    };

    try {
      await this.client
        .subscribeToStream(streamName, {
          fromRevision: END,
          resolveLinkTos: true,
        })
        .on('data', onEvent);
    } catch (err) {
      this.logger.debug(err);
    }
  }

  public convertEvent(resolvedEvent: ResolvedEvent): Event<any> | undefined {
    if (
      resolvedEvent.event === undefined ||
      resolvedEvent.event.type.startsWith('$')
    ) {
      return undefined;
    }

    const metadata = resolvedEvent.event.metadata as Metadata;
    const payload = resolvedEvent.event.data as Payload;

    return this.transformers.repo[resolvedEvent.event.type]?.(
      new Event(payload).withMetadata(metadata),
    );
  }
}
