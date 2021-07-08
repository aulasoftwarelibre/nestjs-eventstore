export class InvalidTitleError extends Error {
  private constructor(stack?: string) {
    super(stack);
  }

  public static becauseEmpty(): InvalidTitleError {
    return new InvalidTitleError(`Title cannot be empty`);
  }
}
