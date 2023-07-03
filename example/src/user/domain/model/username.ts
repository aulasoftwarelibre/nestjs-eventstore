import { DomainError, ValueObject } from '@aulasoftwarelibre/nestjs-eventstore';

interface Props {
  value: string;
}

export class Username extends ValueObject<Props> {
  public static with(value: string): Username {
    if (value.length === 0) {
      throw DomainError.because('Username cannot be empty');
    }

    return new Username({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
