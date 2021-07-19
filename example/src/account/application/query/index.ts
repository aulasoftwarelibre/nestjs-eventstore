import { GetAccountHandler } from './get-account.handler';
import { GetAccountsHandler } from './get-accounts.handler';

export * from './get-accounts.query';
export * from './get-account.query';

export const queryHandlers = [GetAccountsHandler, GetAccountHandler];
