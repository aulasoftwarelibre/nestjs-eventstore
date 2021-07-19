import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  IdAlreadyRegisteredError,
  IdNotFoundError,
} from '../../../nestjs-eventstore';
import { catchError } from '../../../utils';
import { AccountDto, CreateAccountDto, CreateTransactionDto } from '../../dto';
import { AccountService } from '../services';

@ApiTags('Accounts')
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiOperation({ summary: 'Get accounts' })
  @ApiOkResponse()
  @Get()
  async getAccounts(): Promise<AccountDto[]> {
    return await this.accountService.getAccounts();
  }

  @ApiOperation({ summary: 'Create account' })
  @ApiOkResponse({ type: AccountDto })
  @Post()
  async createAccount(
    @Body() accountDto: CreateAccountDto,
  ): Promise<AccountDto> {
    try {
      return await this.accountService.createAccount(accountDto);
    } catch (e) {
      if (e instanceof IdAlreadyRegisteredError) {
        throw new ConflictException(e.message);
      } else {
        throw catchError(e);
      }
    }
  }

  @ApiOperation({ summary: 'Get account' })
  @ApiOkResponse({ type: AccountDto })
  @Get(':id')
  async getAccount(@Param('id') id: string): Promise<AccountDto> {
    try {
      return await this.accountService.getAccount(id);
    } catch (e) {
      if (e instanceof IdNotFoundError) {
        throw new NotFoundException('Account not found');
      } else {
        throw catchError(e);
      }
    }
  }

  @ApiOperation({ summary: 'Create deposit' })
  @Post(':id/deposit')
  async createDeposit(
    @Body() transactionDto: CreateTransactionDto,
    @Param('id') id: string,
  ) {
    try {
      return await this.accountService.createDeposit(id, transactionDto);
    } catch (e) {
      if (e instanceof IdNotFoundError) {
        throw new NotFoundException('Scope not found');
      } else {
        throw catchError(e);
      }
    }
  }

  @ApiOperation({ summary: 'Create withdrawal' })
  @Post(':id/withdrawal')
  async createWithdrawal(
    @Body() transactionDto: CreateTransactionDto,
    @Param('id') id: string,
  ) {
    try {
      return await this.accountService.createWithdrawal(id, transactionDto);
    } catch (e) {
      if (e instanceof IdNotFoundError) {
        throw new NotFoundException('Account not found');
      } else {
        throw catchError(e);
      }
    }
  }
}
