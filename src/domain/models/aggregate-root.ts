import { AggregateRoot as BaseAggregateRoot } from '@nestjs/cqrs';

const VERSION = Symbol('Version');
export abstract class AggregateRoot extends BaseAggregateRoot {
  public static type = 'type';
  private [VERSION] = -1;
  public abstract aggregateId(): string;

  public get version(): number {
    return this[VERSION];
  }

  apply(event, isFromHistory?: boolean): void {
    this[VERSION] += 1;

    super.apply(event.withVersion(this[VERSION]), isFromHistory);
  }

  public equals(other: AggregateRoot): boolean {
    if (this.constructor !== other.constructor) {
      return false;
    }

    return this.aggregateId() === other.aggregateId();
  }
}
