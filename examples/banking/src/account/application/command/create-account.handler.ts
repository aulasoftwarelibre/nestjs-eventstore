import {
  AggregateRepository,
  IdAlreadyRegisteredError,
  InjectAggregateRepository,
} from '@aulasoftwarelibre/nestjs-eventstore'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { Account, AccountId } from '../../domain'
import { Title } from '../../domain/model/title'
import { CreateAccountCommand } from './create-account.command'

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler
  implements ICommandHandler<CreateAccountCommand>
{
  constructor(
    @InjectAggregateRepository(Account)
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {}

  async execute(command: CreateAccountCommand) {
    const accountId = AccountId.with(command.id)
    const title = Title.with(command.title)

    if ((await this.accounts.find(accountId)) instanceof Account) {
      throw IdAlreadyRegisteredError.withId(accountId)
    }

    const account = Account.add(accountId, title)

    this.accounts.save(account)
  }
}
