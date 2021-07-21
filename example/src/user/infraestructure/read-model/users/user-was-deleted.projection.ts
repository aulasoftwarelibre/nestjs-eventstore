import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserWasDeleted } from '../../../domain';
import { UserDocument, USERS_PROJECTION } from './user.schema';

@EventsHandler(UserWasDeleted)
export class UserWasDeletedProjection implements IEventHandler<UserWasDeleted> {
  constructor(
    @InjectModel(USERS_PROJECTION)
    private readonly users: Model<UserDocument>,
  ) {}

  async handle(event: UserWasDeleted) {
    this.users.findByIdAndDelete(event.aggregateId).exec();
  }
}
