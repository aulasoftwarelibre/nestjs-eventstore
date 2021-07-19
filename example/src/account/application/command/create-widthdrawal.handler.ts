import {
  AggregateRepository,
  InjectAggregateRepository,
} from '../../../nestjs-eventstore';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Account, AccountId, Amount } from '../../domain';
import { CreateWidthdrawalCommand } from './create-widthdrawal.command';

@CommandHandler(CreateWidthdrawalCommand)
export class CreateWidthdrawalHandler
  implements ICommandHandler<CreateWidthdrawalCommand>
{
  constructor(
    @InjectAggregateRepository(Account)
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {}

  async execute(command: CreateWidthdrawalCommand) {
    const accountId = AccountId.with(command.accountId);
    const value = Amount.with(command.value);
    const date = command.date;

    const account = await this.accounts.find(accountId);

    if (false === account instanceof Account) {
      throw new Error(`Account ${command.accountId} not found`);
    }

    account.widthdrawal(value, date);

    this.accounts.save(account);
  }
}
