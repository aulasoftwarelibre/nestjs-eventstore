import { Id } from '../../../nestjs-eventstore';

export class AccountId extends Id {
  public static fromString(id: string): AccountId {
    return new AccountId(id);
  }
}
