import { IEvent } from '@nestjs/cqrs';
import clone = require('clone');
import * as uuid from 'uuid';

export type Metadata = {
  _aggregate_id: string;
  _aggregate_version: number;
  _ocurred_on: number;
};

export class Event<P = unknown> implements IEvent {
  public readonly eventId: string;
  public readonly eventType: string;
  public readonly payload: P;
  private _metadata: Metadata;

  public constructor(aggregateId: string, payload: P) {
    this.eventId = uuid.v4();
    this.payload = Object.assign({}, payload);
    this.eventType = Object.getPrototypeOf(this).constructor.name;
    this._metadata = {
      _aggregate_id: aggregateId,
      _aggregate_version: -2,
      _ocurred_on: new Date().getTime(),
    };
  }

  get metadata(): Readonly<Metadata> {
    return this._metadata;
  }

  get aggregateId(): string {
    return this._metadata._aggregate_id;
  }

  get version(): number {
    return this._metadata._aggregate_version;
  }

  get ocurredOn(): number {
    return this._metadata._ocurred_on;
  }

  withMetadata(metadata: Metadata): Event<P> {
    const event = clone(this);
    event._metadata = Object.assign({}, metadata);

    return event;
  }

  withVersion(version: number): Event<P> {
    const event = clone(this);
    event._metadata = {
      ...this._metadata,
      _aggregate_version: version,
    };

    return event;
  }
}
