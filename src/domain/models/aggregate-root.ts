import { AggregateRoot as BaseAggregateRoot } from '@nestjs/cqrs';

import { Event } from './event';

const VERSION = Symbol();

export abstract class AggregateRoot extends BaseAggregateRoot<Event> {
  protected [VERSION] = -1;

  public abstract aggregateId(): string;

  public get version(): number {
    return this[VERSION];
  }

  override apply(event: Event, isFromHistory?: boolean): void {
    this[VERSION] += 1;

    super.apply(event.withVersion(this[VERSION]), isFromHistory);
  }
}

export abstract class EncryptedAggregateRoot extends AggregateRoot {
  override apply(event: Event, isFromHistory?: boolean): void {
    super.apply(event.withEncryptedAggregate(), isFromHistory);
  }
}
