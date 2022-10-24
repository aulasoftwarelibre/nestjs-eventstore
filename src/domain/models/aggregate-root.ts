import { AggregateRoot as BaseAggregateRoot } from '@nestjs/cqrs';

import { Event } from './event';

const VERSION = Symbol();
const STREAM = Symbol();

export abstract class AggregateRoot extends BaseAggregateRoot<Event> {
  protected [VERSION] = -1;
  protected [STREAM] = this.constructor.name;

  public abstract aggregateId(): string;

  public get stream(): string {
    return this[STREAM];
  }

  public get version(): number {
    return this[VERSION];
  }

  override apply(event: Event, isFromHistory?: boolean): void {
    this[VERSION] += 1;

    super.apply(
      event.withStream(this[STREAM]).withVersion(this[VERSION]),
      isFromHistory,
    );
  }
}

export abstract class EncryptedAggregateRoot extends AggregateRoot {
  override apply(event: Event, isFromHistory?: boolean): void {
    super.apply(event.withEncryptedAggregate(), isFromHistory);
  }
}
