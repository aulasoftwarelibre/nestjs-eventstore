import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { catchError } from '../../../utils';
import {
  IdAlreadyRegisteredError,
  IdNotFoundError,
} from '../../../nestjs-eventstore';
import { CreateUserDto, UpdateUserDto, UserDto } from '../../dto';
import { UserService } from '../services';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get users' })
  @Get()
  async findAll(): Promise<UserDto[]> {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Get users' })
  @ApiOkResponse({ type: UserDto })
  @Post()
  async create(@Body() userDto: CreateUserDto): Promise<UserDto> {
    try {
      return this.userService.create(userDto);
    } catch (e) {
      if (e instanceof IdAlreadyRegisteredError) {
        throw new ConflictException(e.message);
      } else {
        throw catchError(e);
      }
    }
  }

  @ApiOperation({ summary: 'Get user' })
  @ApiOkResponse({ type: UserDto })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserDto> {
    try {
      return await this.userService.findOne(id);
    } catch (e) {
      if (e instanceof IdNotFoundError) {
        throw new NotFoundException('User not found');
      } else {
        throw catchError(e);
      }
    }
  }

  @ApiOperation({ summary: 'Edit user' })
  @ApiOkResponse({ type: UserDto })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() editUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    try {
      return await this.userService.update(id, editUserDto);
    } catch (e) {
      if (e instanceof IdNotFoundError) {
        throw new NotFoundException('User not found');
      } else {
        throw catchError(e);
      }
    }
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    try {
      return this.userService.delete(id);
    } catch (e) {
      if (e instanceof IdNotFoundError) {
        throw new NotFoundException('User not found');
      } else {
        throw catchError(e);
      }
    }
  }
}
