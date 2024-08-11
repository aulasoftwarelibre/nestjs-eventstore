import { AggregateRoot as BaseAggregateRoot } from '@nestjs/cqrs'

import { InvalidEventError } from '../exceptions'
import { Event } from './event'

const VERSION = Symbol()
const STREAM = Symbol()

export abstract class AggregateRoot extends BaseAggregateRoot<Event> {
  protected [VERSION] = -1
  protected [STREAM] = this.constructor.name

  public abstract aggregateId(): string

  public get stream(): string {
    return this[STREAM]
  }

  public get version(): number {
    return this[VERSION]
  }

  apply<T extends Event<unknown> = Event<unknown>>(
    event: T,
    isFromHistory?: boolean,
  ): void
  apply<T extends Event<unknown> = Event<unknown>>(
    event: T,
    options?: { fromHistory?: boolean; skipHandler?: boolean },
  ): void
  apply(event: unknown, options?: unknown): void {
    this[VERSION] += 1

    if (event instanceof Event === false) {
      throw InvalidEventError.withType(typeof event)
    }

    super.apply(
      event.withStream(this[STREAM]).withVersion(this[VERSION]),
      options,
    )
  }
}

export abstract class EncryptedAggregateRoot extends AggregateRoot {
  apply<T extends Event<unknown> = Event<unknown>>(
    event: T,
    isFromHistory?: boolean,
  ): void
  apply<T extends Event<unknown> = Event<unknown>>(
    event: T,
    options?: { fromHistory?: boolean; skipHandler?: boolean },
  ): void
  apply(event: unknown, options?: unknown): void {
    if (event instanceof Event === false) {
      throw InvalidEventError.withType(typeof event)
    }

    super.apply(event.withEncryptedAggregate(), options)
  }
}
