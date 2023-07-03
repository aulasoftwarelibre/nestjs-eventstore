import {
  AggregateRepository,
  IdNotFoundError,
  InjectAggregateRepository,
} from '@aulasoftwarelibre/nestjs-eventstore';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User, UserId } from '../../domain';
import { DeleteUserCommand } from './delete-user.query';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @InjectAggregateRepository(User)
    private readonly users: AggregateRepository<User, UserId>,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const userId = UserId.with(command.id);

    const user = await this.users.find(userId);

    if (!user || user.deleted) {
      throw IdNotFoundError.withId(userId);
    }

    user.delete();

    this.users.delete(user);
  }
}
