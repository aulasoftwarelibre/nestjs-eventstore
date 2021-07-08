import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IdNotFoundError } from '@aulasoftwarelibre/nestjs-eventstore';
import { AccountId } from '../../domain';
import { AccountDto } from '../../dto';
import { ACCOUNT_FINDER, IAccountFinder } from '../services';
import { GetAccountQuery } from './get-account.query';

@QueryHandler(GetAccountQuery)
export class GetAccountHandler implements IQueryHandler<GetAccountQuery> {
  constructor(
    @Inject(ACCOUNT_FINDER) private readonly finder: IAccountFinder,
  ) {}

  async execute(query: GetAccountQuery): Promise<AccountDto> {
    const accountId = AccountId.fromString(query.id);

    const account = await this.finder.find(accountId);

    if (!account) {
      throw IdNotFoundError.withId(accountId);
    }

    return account;
  }
}
