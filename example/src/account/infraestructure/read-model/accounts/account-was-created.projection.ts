import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountWasCreated } from '../../../domain';
import { AccountDto } from '../../../dto';
import { AccountDocument, ACCOUNTS_PROJECTION } from './account.schema';

@EventsHandler(AccountWasCreated)
export class AccountWasCreatedProjection
  implements IEventHandler<AccountWasCreated>
{
  constructor(
    @InjectModel(ACCOUNTS_PROJECTION)
    private readonly accounts: Model<AccountDocument>,
  ) {}

  async handle(event: AccountWasCreated) {
    const account = new this.accounts({ ...event.payload, balance: 0 });

    return account.save();
  }
}
