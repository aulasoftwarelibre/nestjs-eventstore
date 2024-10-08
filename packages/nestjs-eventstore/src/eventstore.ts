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
} from '@eventstore/db-client'
import { Inject, Injectable, Logger, Type } from '@nestjs/common'
import { IEventPublisher, IMessageSource } from '@nestjs/cqrs'
import { Subject } from 'rxjs'
import { v4 as uuid } from 'uuid'

import { AggregateRoot, Event } from './domain'
import { type Config } from './eventstore.config'
import { EVENTSTORE_SETTINGS_TOKEN } from './eventstore.constants'
import { EventStoreMapper } from './eventstore.mapper'
import { KeyService } from './services'

@Injectable()
export class EventStore
  implements IEventPublisher<Event>, IMessageSource<Event>
{
  private client: EventStoreDBClient
  private readonly logger = new Logger(EventStore.name)

  constructor(
    @Inject(EVENTSTORE_SETTINGS_TOKEN) private readonly config: Config,
    private readonly mapper: EventStoreMapper,
    private readonly keyService: KeyService,
  ) {
    this.client = EventStoreDBClient.connectionString(config.connection)
  }

  async publishAll<T extends Event>(events: T[]) {
    events = [...events]

    if (events.length === 0) {
      return
    }

    const streamName = this.getStreamName(events[0])
    const expectedRevision = this.getExpectedRevision(events[0])

    const eventsData = []
    for (const event of events) {
      const eventData = await this.createEventData(event)

      eventsData.push(eventData)
    }

    try {
      this.client.appendToStream(streamName, eventsData, {
        expectedRevision: expectedRevision,
      })
    } catch (error) {
      this.logger.error(`Error publishing all events: ${error.message}`)
    }
  }

  async publish<T extends Event>(event: T) {
    const streamName = this.getStreamName(event)
    const expectedRevision = this.getExpectedRevision(event)

    const eventData = await this.createEventData(event)

    try {
      await this.client.appendToStream(streamName, eventData, {
        expectedRevision: expectedRevision,
      })
    } catch (error) {
      this.logger.error(`Error publishing event: ${error.message}`)
    }
  }

  async read<T extends AggregateRoot>(
    aggregate: Type<T>,
    id: string,
  ): Promise<T> | null {
    const streamName = `${aggregate.name}-${id}`

    try {
      const entity = <T>Reflect.construct(aggregate, [])
      const resolvedEvents = await this.client.readStream(streamName, {
        direction: FORWARDS,
        fromRevision: START,
      })

      const events = [] as Event[]

      for await (const event of resolvedEvents) {
        events.push(await this.mapper.resolvedEventToDomainEvent(event))
      }

      entity.loadFromHistory(events)

      return entity
    } catch (error) {
      if (error?.type === ErrorType.STREAM_NOT_FOUND) {
        return null
      }

      this.logger.error(error)
    }

    return null
  }

  async bridgeEventsTo<T extends Event>(subject: Subject<T>) {
    const onEvent = async (resolvedEvent: ResolvedEvent) => {
      if (resolvedEvent.event?.type.startsWith('$')) {
        return
      }

      subject.next(
        <T>await this.mapper.resolvedEventToDomainEvent(resolvedEvent),
      )
    }

    try {
      await this.client
        .subscribeToAll({
          fromPosition: END,
        })
        .on('data', onEvent)
    } catch (error) {
      this.logger.error(error)
    }
  }

  private getStreamName<T extends Event>(event: T) {
    return `${event.stream}-${event.aggregateId}`
  }

  private getExpectedRevision<T extends Event>(
    event: T,
  ): AppendExpectedRevision {
    return event.version <= 0 ? NO_STREAM : BigInt(event.version - 1)
  }

  private async createEventData<T extends Event>(event: T): Promise<EventData> {
    if (event.aggregateEncrypted) {
      event = (await this.keyService.encryptEvent(event)) as T
    }

    return jsonEvent({
      data: event.payload as JSONType,
      id: uuid(),
      metadata: event.metadata,
      type: event.eventType,
    })
  }
}
