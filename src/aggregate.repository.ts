import { Type } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { AggregateRoot, Event, Id } from './domain';
import { EventStore } from './eventstore';
import { KeyService } from './services';

export class AggregateRepository<T extends AggregateRoot, U extends Id> {
  constructor(
    private readonly Aggregate: Type<T>,
    private readonly eventStore: EventStore,
    private readonly publisher: EventPublisher<Event>,
    private readonly keyService: KeyService,
  ) {}

  public async find(id: U): Promise<T> | null {
    return this.eventStore.read<T>(this.Aggregate, id.value);
  }

  public save(entity: T) {
    entity = this.publisher.mergeObjectContext(entity);
    entity.commit();
  }

  public async delete(entity: T) {
    this.save(entity);

    await this.keyService.delete(entity.aggregateId());
  }
}
