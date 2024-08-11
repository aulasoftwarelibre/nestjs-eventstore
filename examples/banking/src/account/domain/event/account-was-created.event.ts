import { Event } from '@aulasoftwarelibre/nestjs-eventstore'

import { CreateAccountDto } from '../../dto/request'

export class AccountWasCreated extends Event<CreateAccountDto> {
  constructor(
    public readonly id: string,
    public readonly title: string,
  ) {
    super(id, { _id: id, title })
  }
}
