import { AggregateRoot as BaseAggregateRoot } from '@nestjs/cqrs';

import { Event } from './event';

const VERSION = Symbol();
export abstract class AggregateRoot extends BaseAggregateRoot<Event> {
  private [VERSION] = -1;

  public get version(): number {
    return this[VERSION];
  }

  apply(event: Event, isFromHistory?: boolean): void {
    this[VERSION] += 1;

    super.apply(event.withVersion(this[VERSION]), isFromHistory);
  }
}
