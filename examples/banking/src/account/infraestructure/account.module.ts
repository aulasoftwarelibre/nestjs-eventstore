import { Event, EventStoreModule } from '@aulasoftwarelibre/nestjs-eventstore'
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { MongooseModule } from '@nestjs/mongoose'

import { commandHandlers, queryHandlers } from '../application'
import {
  Account,
  AccountWasCreated,
  DepositWasDone,
  WithdrawalWasDone,
} from '../domain'
import { CreateAccountDto, CreateTransactionDto } from '../dto/request'
import { accountProviders } from './account.providers'
import { AccountController } from './controller'
import {
  ACCOUNTS_PROJECTION,
  AccountSchema,
  projectionHandlers,
} from './read-model'
import { AccountService } from './services/account.service'

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
