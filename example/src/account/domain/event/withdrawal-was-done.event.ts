import { Event } from '../../../nestjs-eventstore';
import { CreateTransactionDto } from '../../dto/request';

export class WithdrawalWasDone extends Event<CreateTransactionDto> {
  constructor(
    public readonly id: string,
    public readonly value: number,
    public readonly date: Date,
  ) {
    super(id, { _id: id, value, date });
  }
}
