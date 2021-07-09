import { ResolvedEvent } from '@eventstore/db-client';
import { Inject, Injectable } from '@nestjs/common';

import { Event, Metadata } from './domain';
import { Config } from './eventstore.config';
import { EVENT_STORE_SETTINGS_TOKEN } from './eventstore.constants';
import { TransformerService } from './services';

@Injectable()
export class EventStoreMapper {
  constructor(
    @Inject(EVENT_STORE_SETTINGS_TOKEN) private readonly config: Config,
    private readonly transformers: TransformerService,
  ) {}

  public resolvedEventToDomainEvent(
    resolvedEvent: ResolvedEvent,
  ): Event | undefined {
    if (
      resolvedEvent.event === undefined ||
      resolvedEvent.event.type.startsWith('$') ||
      !resolvedEvent.event.streamId.startsWith(this.config.category)
    ) {
      return undefined;
    }

    const metadata = resolvedEvent.event.metadata as Metadata;
    const payload = resolvedEvent.event.data;

    return this.transformers.repo[resolvedEvent.event.type]?.(
      new Event(metadata._aggregate_id, payload).withMetadata(metadata),
    );
  }

  public resolvedEventsToDomainEvents(
    resolvedEvents: ResolvedEvent[],
  ): Event[] {
    return resolvedEvents
      .map((resolvedEvent) => this.resolvedEventToDomainEvent(resolvedEvent))
      .filter((event) => event !== undefined);
  }
}
