import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DepositWasDone } from '../../../domain';
import { AccountDocument, ACCOUNTS_PROJECTION } from './account.schema';

@EventsHandler(DepositWasDone)
export class DepositWasDoneProjection implements IEventHandler<DepositWasDone> {
  constructor(
    @InjectModel(ACCOUNTS_PROJECTION)
    private readonly accounts: Model<AccountDocument>,
  ) {}

  async handle(event: DepositWasDone) {
    await this.accounts
      .updateOne({ _id: event.id }, { $inc: { balance: event.value } })
      .exec();
  }
}
