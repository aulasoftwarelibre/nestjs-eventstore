import { IEvent, IEventPublisher as IBaseEventPublisher } from '@nestjs/cqrs';

import { Event } from '../domain';

export interface IEventPublisher extends IBaseEventPublisher {
  publish<T extends IEvent>(event: T): any;
  publish<T extends Event<any>>(event: T): any;
}
