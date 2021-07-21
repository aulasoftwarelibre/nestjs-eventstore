import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserId } from '../../domain';
import { UserDto } from '../../dto';
import { IUserFinder, USER_FINDER } from '../services';
import { GetUserQuery } from './get-user.query';
import { IdNotFoundError } from '../../../nestjs-eventstore';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(
    @Inject(USER_FINDER)
    private readonly finder: IUserFinder,
  ) {}

  async execute(query: GetUserQuery): Promise<UserDto> {
    const userId = UserId.with(query.id);

    const user = await this.finder.find(userId);

    if (!user) {
      throw IdNotFoundError.withId(userId);
    }

    return user;
  }
}
