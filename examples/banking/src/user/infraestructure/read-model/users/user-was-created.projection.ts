import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { UserWasCreated } from '../../../domain'
import { UserDocument, USERS_PROJECTION } from './user.schema'

@EventsHandler(UserWasCreated)
export class UserWasCreatedProjection implements IEventHandler<UserWasCreated> {
  constructor(
    @InjectModel(USERS_PROJECTION)
    private readonly users: Model<UserDocument>,
  ) {}

  async handle(event: UserWasCreated) {
    const user = new this.users({
      ...event.payload,
    })

    await user.save()
  }
}
