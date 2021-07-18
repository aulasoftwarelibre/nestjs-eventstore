import {
  AggregateRepository,
  InjectAggregateRepository,
} from '../../../nestjs-eventstore';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Account, AccountId, Amount } from '../../domain';
import { CreateDepositCommand } from './create-deposit.command';

@CommandHandler(CreateDepositCommand)
export class CreateDepositHandler
  implements ICommandHandler<CreateDepositCommand>
{
  constructor(
    @InjectAggregateRepository(Account)
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {}

  async execute(command: CreateDepositCommand) {
    const accountId = AccountId.fromString(command.accountId);
    const value = Amount.fromNumber(command.value);
    const date = command.date;

    const account = await this.accounts.find(accountId);

    if (false === account instanceof Account) {
      throw new Error(`Account ${command.accountId} not found`);
    }

    account.deposit(value, date);

    this.accounts.save(account);
  }
}
