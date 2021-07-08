import { ValueObject } from '@aulasoftwarelibre/nestjs-eventstore';

interface Props {
  value: number;
}

export class Amount extends ValueObject<Props> {
  public static fromNumber(value: number): Amount {
    return new Amount({ value });
  }

  get value(): number {
    return this.props.value;
  }

  public negative(): Amount {
    return Amount.fromNumber(-this.value);
  }
}
