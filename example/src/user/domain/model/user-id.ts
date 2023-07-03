import { Id } from '@aulasoftwarelibre/nestjs-eventstore';

export class UserId extends Id {
  public static with(id: string): UserId {
    return new UserId(id);
  }
}
