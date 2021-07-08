export class DomainError extends Error {
  protected constructor(stack?: string) {
    super(stack);
  }

  public static withString(value: string): DomainError {
    return new DomainError(`${value} is not a valid uuid v4.`);
  }
}
