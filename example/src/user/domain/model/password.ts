import { DomainError, ValueObject } from '@aulasoftwarelibre/nestjs-eventstore';

interface Props {
  value: string;
}

export class Password extends ValueObject<Props> {
  public static with(value: string): Password {
    if (value.length < 12) {
      throw DomainError.because('Password is too short (min. 12 characters)');
    }

    return new Password({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
