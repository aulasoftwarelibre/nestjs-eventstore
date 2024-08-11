import { ValueObject } from '@aulasoftwarelibre/nestjs-eventstore'

import { Amount } from './amount'

export class Transaction extends ValueObject<{
  date: Date
  value: Amount
}> {
  public static with(value: Amount, date: Date) {
    return new Transaction({ date, value })
  }

  get value(): Amount {
    return this.props.value
  }

  get date(): Date {
    return this.props.date
  }
}
