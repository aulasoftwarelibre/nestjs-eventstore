import { DomainError } from '@aulasoftwarelibre/nestjs-eventstore'

export class InvalidTitleError extends DomainError {
  private constructor(stack?: string) {
    super(stack)
  }

  public static becauseEmpty(): InvalidTitleError {
    return new InvalidTitleError(`Title cannot be empty`)
  }
}
