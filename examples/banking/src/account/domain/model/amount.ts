import { ValueObject } from '@aulasoftwarelibre/nestjs-eventstore'

export class Amount extends ValueObject<{
  value: number
}> {
  public static with(value: number): Amount {
    return new Amount({ value })
  }

  get value(): number {
    return this.props.value
  }

  public negative(): Amount {
    return Amount.with(-this.value)
  }
}
