import {
  AggregateRepository,
  IdNotFoundError,
  InjectAggregateRepository,
} from '@aulasoftwarelibre/nestjs-eventstore'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { Password, User, UserId } from '../../domain'
import { UpdateUserCommand } from './update-user.query'

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @InjectAggregateRepository(User)
    private readonly users: AggregateRepository<User, UserId>,
  ) {}

  async execute(command: UpdateUserCommand): Promise<void> {
    const userId = UserId.with(command.id)

    const user = await this.users.find(userId)

    if (!user || user.deleted) {
      throw IdNotFoundError.withId(userId)
    }

    if (command.password) {
      const password = Password.with(command.password)
      user.updatePassword(password)
    }

    this.users.save(user)
  }
}
