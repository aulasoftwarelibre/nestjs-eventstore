import { Event } from '@aulasoftwarelibre/nestjs-eventstore'

export class UserWasDeleted extends Event {
  constructor(public readonly id: string) {
    super(id)
  }
}
