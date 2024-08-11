export class KeyNotFoundError extends Error {
  public static withId(id: string) {
    return new KeyNotFoundError(`Decrypt key for [${id}] does not exists`)
  }
}
