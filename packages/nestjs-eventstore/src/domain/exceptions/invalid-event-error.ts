import { DomainError } from './domain-error'

export class InvalidEventError extends DomainError {
  public static withType(type: string): InvalidEventError {
    return new InvalidEventError(`${type} is not a valid event.`)
  }
}
