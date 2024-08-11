import { validate, version } from 'uuid'

import { InvalidIdError } from '../exceptions'
import { ValueObject } from './value-object'

export abstract class Id extends ValueObject<{
  value: string
}> {
  protected constructor(id: string) {
    if (!validate(id) || version(id) !== 4) {
      throw InvalidIdError.withString(id)
    }

    super({ value: id })
  }

  get value(): string {
    return this.props.value
  }
}
