import { UserId } from '../../domain';
import { UserDto } from '../../dto';

export const USER_FINDER = 'USER_FINDER';

export interface IUserFinder {
  findAll(): Promise<UserDto[]>;
  find(id: UserId): Promise<UserDto>;
}
