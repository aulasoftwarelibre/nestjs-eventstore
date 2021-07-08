import { Event, EventStoreModule } from '@aulasoftwarelibre/nestjs-eventstore';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CreateAccountHandler,
  CreateDepositHandler,
  CreateWidthdrawalHandler,
  GetAccountHandler,
  GetAccountsHandler,
} from '../application';
import {
  Account,
  AccountWasCreated,
  DepositWasDone,
  WithdrawalWasDone,
} from '../domain';
import { CreateAccountDto, CreateTransactionDto } from '../dto/request';
import { accountProviders } from './account.providers';
import { AccountService } from './account.service';
import { AccountController } from './controller/account.controller';
import {
  AccountSchema,
  ACCOUNTS_PROJECTION,
  projectionHandlers,
} from './read-model';

const commandHandlers = [
  CreateAccountHandler,
  CreateDepositHandler,
  CreateWidthdrawalHandler,
];

const queryHandlers = [GetAccountsHandler, GetAccountHandler];

@Module({
  controllers: [AccountController],
  imports: [
    CqrsModule,
    EventStoreModule.forFeature([Account], {
      AccountWasCreated: (event: Event<CreateAccountDto>) =>
        new AccountWasCreated(event.payload._id, event.payload.title),
      DepositWasDone: (event: Event<CreateTransactionDto>) =>
        new DepositWasDone(
          event.payload._id,
          event.payload.value,
          event.payload.date,
        ),
      WithdrawalWasDone: (event: Event<CreateTransactionDto>) =>
        new WithdrawalWasDone(
          event.payload._id,
          event.payload.value,
          event.payload.date,
        ),
    }),
    MongooseModule.forFeature([
      {
        name: ACCOUNTS_PROJECTION,
        schema: AccountSchema,
      },
    ]),
  ],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    ...projectionHandlers,
    ...accountProviders,
    AccountService,
  ],
})
export class AccountModule {}
