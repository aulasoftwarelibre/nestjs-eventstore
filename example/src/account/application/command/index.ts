import { CreateAccountHandler } from './create-account.handler';
import { CreateDepositHandler } from './create-deposit.handler';
import { CreateWidthdrawalHandler } from './create-widthdrawal.handler';

export * from './create-account.command';
export * from './create-deposit.command';
export * from './create-widthdrawal.command';

export const commandHandlers = [
  CreateAccountHandler,
  CreateDepositHandler,
  CreateWidthdrawalHandler,
];
