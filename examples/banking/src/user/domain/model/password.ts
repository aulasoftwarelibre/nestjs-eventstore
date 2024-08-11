import { DomainError, ValueObject } from '@aulasoftwarelibre/nestjs-eventstore'

export class Password extends ValueObject<{
  value: string
}> {
  public static with(value: string): Password {
    if (value.length < 12) {
      throw DomainError.because('Password is too short (min. 12 characters)')
    }

    return new Password({ value })
  }

  get value(): string {
    return this.props.value
  }
}
