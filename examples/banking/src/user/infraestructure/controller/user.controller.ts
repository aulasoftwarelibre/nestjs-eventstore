import {
  IdAlreadyRegisteredError,
  IdNotFoundError,
} from '@aulasoftwarelibre/nestjs-eventstore'
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
} from '@nestjs/common'
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { catchError } from '../../../utils'
import { CreateUserDto, UpdateUserDto, UserDto } from '../../dto'
import { UserService } from '../services'

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get users' })
  @Get()
  async findAll(): Promise<UserDto[]> {
    return this.userService.findAll()
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiOkResponse({ type: UserDto })
  @Post()
  async create(@Body() userDto: CreateUserDto): Promise<UserDto> {
    try {
      return await this.userService.create(userDto)
    } catch (error) {
      const error_ =
        error instanceof IdAlreadyRegisteredError
          ? new ConflictException(error.message)
          : catchError(error)
      throw error_
    }
  }

  @ApiOperation({ summary: 'Get user' })
  @ApiOkResponse({ type: UserDto })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserDto> {
    try {
      return await this.userService.findOne(id)
    } catch (error) {
      const error_ =
        error instanceof IdNotFoundError
          ? new NotFoundException('User not found')
          : catchError(error)
      throw error_
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
      return await this.userService.update(id, editUserDto)
    } catch (error) {
      const error_ =
        error instanceof IdNotFoundError
          ? new NotFoundException('User not found')
          : catchError(error)
      throw error_
    }
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ description: 'User deleted', status: 204 })
  @ApiResponse({ description: 'User not found', status: 404 })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    try {
      return this.userService.delete(id)
    } catch (error) {
      const error_ =
        error instanceof IdNotFoundError
          ? new NotFoundException('User not found')
          : catchError(error)
      throw error_
    }
  }
}
