import { ValueObject } from '@aulasoftwarelibre/nestjs-eventstore'

import { InvalidTitleError } from '../exception'

export class Title extends ValueObject<{
  value: string
}> {
  public static with(value: string) {
    if (value.length === 0) {
      throw InvalidTitleError.becauseEmpty()
    }

    return new Title({ value })
  }

  get value(): string {
    return this.props.value
  }
}
