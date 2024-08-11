import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'

import {
  CreateAccountCommand,
  CreateDepositCommand,
  CreateWidthdrawalCommand,
  GetAccountQuery,
  GetAccountsQuery,
} from '../../application'
import { AccountDto, CreateAccountDto, CreateTransactionDto } from '../../dto'

@Injectable()
export class AccountService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async getAccounts(): Promise<AccountDto[]> {
    return this.queryBus.execute(new GetAccountsQuery())
  }

  async getAccount(id: string): Promise<AccountDto> {
    return this.queryBus.execute(new GetAccountQuery(id))
  }

  async createAccount(accountDto: CreateAccountDto): Promise<AccountDto> {
    await this.commandBus.execute(
      new CreateAccountCommand(accountDto._id, accountDto.title),
    )

    return new AccountDto(accountDto._id, accountDto.title, 0)
  }

  async createDeposit(id: string, transactionDto: CreateTransactionDto) {
    await this.commandBus.execute(
      new CreateDepositCommand(id, transactionDto.value, transactionDto.date),
    )
  }

  async createWithdrawal(id: string, transactionDto: CreateTransactionDto) {
    await this.commandBus.execute(
      new CreateWidthdrawalCommand(
        id,
        transactionDto.value,
        transactionDto.date,
      ),
    )
  }
}
