import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { AccountDto } from '../../dto'
import { ACCOUNT_FINDER, IAccountFinder } from '../services'
import { GetAccountsQuery } from './get-accounts.query'

@QueryHandler(GetAccountsQuery)
export class GetAccountsHandler implements IQueryHandler<GetAccountsQuery> {
  constructor(
    @Inject(ACCOUNT_FINDER) private readonly finder: IAccountFinder,
  ) {}

  async execute(): Promise<AccountDto[]> {
    return this.finder.findAll()
  }
}
