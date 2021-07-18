import { ResolvedEvent } from '@eventstore/db-client';
import { Inject, Injectable } from '@nestjs/common';

import { KeyService } from './crypto';
import { Event, Metadata } from './domain';
import { Config } from './eventstore.config';
import { EVENT_STORE_SETTINGS_TOKEN } from './eventstore.constants';
import { TransformerService } from './services';

@Injectable()
export class EventStoreMapper {
  constructor(
    @Inject(EVENT_STORE_SETTINGS_TOKEN) private readonly config: Config,
    private readonly transformers: TransformerService,
    private readonly keyService: KeyService,
  ) {}

  public resolvedEventToDomainEvent(
    resolvedEvent: ResolvedEvent,
  ): Promise<Event> | undefined {
    if (
      resolvedEvent.event === undefined ||
      resolvedEvent.event.type.startsWith('$') ||
      !resolvedEvent.event.streamId.startsWith(this.config.category)
    ) {
      return undefined;
    }

    const metadata = resolvedEvent.event.metadata as Metadata;
    const payload = resolvedEvent.event.data;

    const event = this.transformers.repo[resolvedEvent.event.type]?.(
      new Event(metadata._aggregate_id, payload),
    ).withMetadata(metadata);

    return this.keyService.decrypt(event);
  }

  public async resolvedEventsToDomainEvents(
    resolvedEvents: ResolvedEvent[],
  ): Promise<Event[]> {
    return await Promise.all(
      resolvedEvents
        .map((resolvedEvent) => this.resolvedEventToDomainEvent(resolvedEvent))
        .filter((event) => event !== undefined),
    );
  }
}
