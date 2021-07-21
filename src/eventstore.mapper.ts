import { JSONType, ResolvedEvent } from '@eventstore/db-client';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { Event, Metadata } from './domain';
import { KeyNotFoundError } from './errors';
import { Config } from './eventstore.config';
import { EVENTSTORE_SETTINGS_TOKEN } from './eventstore.constants';
import { KeyService, TransformerService } from './services';

@Injectable()
export class EventStoreMapper {
  private readonly logger = new Logger(EventStoreMapper.name);

  constructor(
    @Inject(EVENTSTORE_SETTINGS_TOKEN) private readonly config: Config,
    private readonly transformers: TransformerService,
    private readonly keyService: KeyService,
  ) {}

  public async resolvedEventToDomainEvent(
    resolvedEvent: ResolvedEvent,
  ): Promise<Event> | null {
    if (
      resolvedEvent.event === undefined ||
      resolvedEvent.event.type.startsWith('$') ||
      !resolvedEvent.event.streamId.startsWith(this.config.category)
    ) {
      return null;
    }

    try {
      const metadata = resolvedEvent.event.metadata as Metadata;
      const payload = await this.extractPayload(resolvedEvent);
      const transformer =
        this.transformers.getTransformerToEvent(resolvedEvent);

      const event = transformer?.(
        new Event(metadata._aggregate_id, payload),
      ).withMetadata(metadata);

      return event;
    } catch (error) {
      if (error instanceof KeyNotFoundError) {
        this.logger.error(
          `Error during decrypting ${resolvedEvent.event.type}: ${error.message}`,
        );

        return null;
      }

      throw error;
    }
  }

  private async extractPayload(
    resolvedEvent: ResolvedEvent,
  ): Promise<JSONType | Uint8Array> {
    const metadata = resolvedEvent.event.metadata as Metadata;
    return metadata._aggregate_encrypted
      ? await this.keyService.decryptPayload(
          metadata._aggregate_id,
          metadata._encrypted_payload,
        )
      : resolvedEvent.event.data;
  }
}
