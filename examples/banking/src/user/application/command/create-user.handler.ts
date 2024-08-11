import {
  AggregateRepository,
  IdAlreadyRegisteredError,
  InjectAggregateRepository,
} from '@aulasoftwarelibre/nestjs-eventstore'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { Password, User, UserId, Username } from '../../domain'
import { CreateUserCommand } from './create-user.query'

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectAggregateRepository(User)
    private readonly users: AggregateRepository<User, UserId>,
  ) {}

  async execute(command: CreateUserCommand) {
    const userId = UserId.with(command.id)
    const username = Username.with(command.username)
    const password = Password.with(command.password)

    if ((await this.users.find(userId)) instanceof User) {
      throw IdAlreadyRegisteredError.withId(userId)
    }

    const user = User.add(userId, username, password)

    this.users.save(user)
  }
}
