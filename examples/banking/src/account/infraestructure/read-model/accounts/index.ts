import { AccountWasCreatedProjection } from './account-was-created.projection'
import { DepositWasDoneProjection } from './deposit-was-done.projection'
import { WithdrawalWasDoneProjection } from './withdrawal-was-done.projection'

export * from './account.schema'

export const projectionHandlers = [
  AccountWasCreatedProjection,
  DepositWasDoneProjection,
  WithdrawalWasDoneProjection,
]
