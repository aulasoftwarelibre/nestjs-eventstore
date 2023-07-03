import { AggregateRoot } from '@aulasoftwarelibre/nestjs-eventstore';
import { AccountWasCreated, DepositWasDone, WithdrawalWasDone } from '../event';
import { AccountId } from './account-id';
import { Amount } from './amount';
import { Title } from './title';
import { Transaction } from './transaction';

export class Account extends AggregateRoot {
  private _accountId: AccountId;
  private _title: Title;
  private _transactions: Transaction[];

  public static add(accountId: AccountId, title: Title): Account {
    const account = new Account();

    account.apply(new AccountWasCreated(accountId.value, title.value));

    return account;
  }

  aggregateId(): string {
    return this.id.value;
  }

  get id(): AccountId {
    return this._accountId;
  }

  get title(): Title {
    return this._title;
  }

  public deposit(amount: Amount, date: Date) {
    this.apply(new DepositWasDone(this._accountId.value, amount.value, date));
  }

  public widthdrawal(amount: Amount, date: Date) {
    this.apply(
      new WithdrawalWasDone(this._accountId.value, amount.value, date),
    );
  }

  private onAccountWasCreated(event: AccountWasCreated) {
    this._accountId = AccountId.with(event.id);
    this._title = Title.with(event.title);
    this._transactions = [];
  }

  private onDepositWasDone(event: DepositWasDone) {
    this._transactions.push(
      Transaction.with(Amount.with(event.value), event.date),
    );
  }

  private onWithdrawalWasDone(event: WithdrawalWasDone) {
    this._transactions.push(
      Transaction.with(Amount.with(event.value).negative(), event.date),
    );
  }
}
