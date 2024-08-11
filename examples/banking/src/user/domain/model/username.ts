import { DomainError, ValueObject } from '@aulasoftwarelibre/nestjs-eventstore'

export class Username extends ValueObject<{
  value: string
}> {
  public static with(value: string): Username {
    if (value.length === 0) {
      throw DomainError.because('Username cannot be empty')
    }

    return new Username({ value })
  }

  get value(): string {
    return this.props.value
  }
}
