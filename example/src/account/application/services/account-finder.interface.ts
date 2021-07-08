import { AccountId } from '../../domain';
import { AccountDto } from '../../dto';

export const ACCOUNT_FINDER = 'ACCOUNT_FINDER';

export interface IAccountFinder {
  findAll(): Promise<AccountDto[]>;
  find(id: AccountId): Promise<AccountDto>;
}
