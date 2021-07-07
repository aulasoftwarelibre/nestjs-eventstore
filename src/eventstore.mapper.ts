import { ResolvedEvent } from '@eventstore/db-client';
import { Injectable } from '@nestjs/common';

import { Event, Metadata } from './domain';
import { TransformerService } from './transformer.service';

@Injectable()
export class EventStoreMapper {
  constructor(private readonly transformers: TransformerService) {}

  public resolvedEventToDomainEvent(
    resolvedEvent: ResolvedEvent,
  ): Event | undefined {
    if (
      resolvedEvent.event === undefined ||
      resolvedEvent.event.type.startsWith('$')
    ) {
      return undefined;
    }

    const metadata = resolvedEvent.event.metadata as Metadata;
    const payload = resolvedEvent.event.data;

    return this.transformers.repo[resolvedEvent.event.type]?.(
      new Event(metadata._aggregate_id, payload).withMetadata(metadata),
    );
  }
}
