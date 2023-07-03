import { Event } from '@aulasoftwarelibre/nestjs-eventstore';
import { CreateTransactionDto } from '../../dto/request';

export class DepositWasDone extends Event<CreateTransactionDto> {
  constructor(
    public readonly id: string,
    public readonly value: number,
    public readonly date: Date,
  ) {
    super(id, { _id: id, value, date });
  }
}
