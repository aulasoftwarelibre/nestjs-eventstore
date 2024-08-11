import { GetAccountHandler } from './get-account.handler'
import { GetAccountsHandler } from './get-accounts.handler'

export * from './get-account.query'
export * from './get-accounts.query'

export const queryHandlers = [GetAccountsHandler, GetAccountHandler]
