import { Id } from '@aulasoftwarelibre/nestjs-eventstore';

export class AccountId extends Id {
  public static with(id: string): AccountId {
    return new AccountId(id);
  }
}
