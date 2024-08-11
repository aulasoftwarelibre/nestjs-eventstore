import { Event } from '@aulasoftwarelibre/nestjs-eventstore'

import { CreateUserDto } from '../../dto'

export class UserWasCreated extends Event<CreateUserDto> {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly password: string,
  ) {
    super(id, { _id: id, password, username })
  }
}
