import { IEvent, IMessageSource as IBaseMessageSource } from '@nestjs/cqrs';
import { Subject } from 'rxjs';

import { Event } from '../domain';

export interface IMessageSource extends IBaseMessageSource {
  bridgeEventsTo<T extends IEvent>(subject: Subject<T>): any;
  bridgeEventsTo<T extends Event<any>>(subject: Subject<T>): any;
}
