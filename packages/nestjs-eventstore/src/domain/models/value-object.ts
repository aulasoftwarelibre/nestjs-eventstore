import { shallowEqual } from 'shallow-equal-object'

interface ValueObjectProperties {
  [index: string]: unknown
}

export abstract class ValueObject<T extends ValueObjectProperties> {
  public readonly props: T

  protected constructor(properties: T) {
    this.props = Object.freeze(properties)
  }

  public equals(other: ValueObject<T>): boolean {
    if (this.constructor !== other.constructor) {
      return false
    }

    return shallowEqual(this.props, other.props)
  }
}
