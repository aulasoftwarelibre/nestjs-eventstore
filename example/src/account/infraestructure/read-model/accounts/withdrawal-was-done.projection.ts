import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WithdrawalWasDone } from '../../../domain';
import { AccountDocument, ACCOUNTS_PROJECTION } from './account.schema';

@EventsHandler(WithdrawalWasDone)
export class WithdrawalWasDoneProjection
  implements IEventHandler<WithdrawalWasDone>
{
  constructor(
    @InjectModel(ACCOUNTS_PROJECTION)
    private readonly accounts: Model<AccountDocument>,
  ) {}

  async handle(event: WithdrawalWasDone) {
    await this.accounts
      .updateOne({ _id: event.id }, { $inc: { balance: -event.value } })
      .exec();
  }
}
