import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { UserDto } from '../../dto'
import { IUserFinder, USER_FINDER } from '../services'
import { GetUsersQuery } from './get-users.query'

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersHandler> {
  constructor(@Inject(USER_FINDER) private readonly finder: IUserFinder) {}

  async execute(): Promise<UserDto[]> {
    return this.finder.findAll()
  }
}
