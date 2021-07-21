import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PasswordWasUpdated } from '../../../domain';
import { UserDocument, USERS_PROJECTION } from './user.schema';

@EventsHandler(PasswordWasUpdated)
export class PasswordWasUpdatedProjection
  implements IEventHandler<PasswordWasUpdated>
{
  constructor(
    @InjectModel(USERS_PROJECTION)
    private readonly users: Model<UserDocument>,
  ) {}

  async handle(event: PasswordWasUpdated) {
    this.users
      .findByIdAndUpdate(event.aggregateId, {
        password: event.password,
      })
      .exec();
  }
}
