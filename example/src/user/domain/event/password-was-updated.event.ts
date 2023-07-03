import { Event } from '@aulasoftwarelibre/nestjs-eventstore';
import { UpdateUserDto } from '../../dto';

export type PasswordWasUpdatedProps = Pick<UpdateUserDto, 'password'>;

export class PasswordWasUpdated extends Event<PasswordWasUpdatedProps> {
  constructor(public readonly id: string, public readonly password: string) {
    super(id, { password });
  }
}
