import { ValueObject } from '../../../nestjs-eventstore';
import { InvalidTitleError } from '../exception';

interface Props {
  value: string;
}

export class Title extends ValueObject<Props> {
  public static with(value: string) {
    if (value.length === 0) {
      throw InvalidTitleError.becauseEmpty();
    }

    return new Title({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
