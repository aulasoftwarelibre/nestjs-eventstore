import { ValueObject } from '../../../nestjs-eventstore';
import { Amount } from './amount';

interface Props {
  value: Amount;
  date: Date;
}

export class Transaction extends ValueObject<Props> {
  public static from(value: Amount, date: Date) {
    return new Transaction({ value, date });
  }

  get value(): Amount {
    return this.props.value;
  }

  get date(): Date {
    return this.props.date;
  }
}
