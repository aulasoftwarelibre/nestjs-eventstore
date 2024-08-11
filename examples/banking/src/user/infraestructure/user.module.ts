import { Event, EventStoreModule } from '@aulasoftwarelibre/nestjs-eventstore'
import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { MongooseModule } from '@nestjs/mongoose'

import { commandHandlers, queryHandlers } from '../application'
import {
  PasswordWasUpdated,
  PasswordWasUpdatedProps,
  User,
  UserWasCreated,
  UserWasDeleted,
} from '../domain'
import { CreateUserDto } from '../dto'
import { UserController } from './controller'
import { projectionHandlers, USERS_PROJECTION, UserSchema } from './read-model'
import { UserService } from './services'
import { userProviders } from './user.providers'

@Module({
  controllers: [UserController],
  imports: [
    CqrsModule,
    EventStoreModule.forFeature([User], {
      PasswordWasUpdated: (event: Event<PasswordWasUpdatedProps>) =>
        new PasswordWasUpdated(event.aggregateId, event.payload.password),
      UserWasCreated: (event: Event<CreateUserDto>) =>
        new UserWasCreated(
          event.aggregateId,
          event.payload.username,
          event.payload.password,
        ),
      UserWasDeleted: (event: Event) => new UserWasDeleted(event.aggregateId),
    }),
    MongooseModule.forFeature([
      {
        name: USERS_PROJECTION,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    ...projectionHandlers,
    ...userProviders,
    UserService,
  ],
})
export class UserModule {}
