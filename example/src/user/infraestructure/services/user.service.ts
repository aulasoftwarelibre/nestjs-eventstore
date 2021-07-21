import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateUserCommand,
  GetUserQuery,
  GetUsersQuery,
  DeleteUserCommand,
  UpdateUserCommand,
} from '../../application';
import { CreateUserDto, UpdateUserDto, UserDto } from '../../dto';

@Injectable()
export class UserService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async findOne(id: string): Promise<UserDto> {
    return this.queryBus.execute(new GetUserQuery(id));
  }

  async findAll(): Promise<UserDto[]> {
    return this.queryBus.execute(new GetUsersQuery());
  }

  async create(userDto: CreateUserDto): Promise<UserDto> {
    await this.commandBus.execute(
      new CreateUserCommand(userDto._id, userDto.username, userDto.password),
    );

    return new UserDto({ ...userDto });
  }

  async update(id: string, editUserDto: UpdateUserDto): Promise<UserDto> {
    await this.commandBus.execute(
      new UpdateUserCommand(id, editUserDto.username, editUserDto.password),
    );

    const user = await this.queryBus.execute(new GetUserQuery(id));

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return new UserDto({ ...user });
  }

  async delete(id: string) {
    await this.commandBus.execute(new DeleteUserCommand(id));
  }
}
