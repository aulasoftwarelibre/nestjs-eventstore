import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IAccountFinder } from '../../application';
import { AccountId } from '../../domain';
import { AccountDto } from '../../dto';
import { AccountDocument, ACCOUNTS_PROJECTION } from '../read-model';

@Injectable()
export class AccountFinder implements IAccountFinder {
  constructor(
    @InjectModel(ACCOUNTS_PROJECTION) private accounts: Model<AccountDocument>,
  ) {}
  async findAll(): Promise<AccountDto[]> {
    return this.accounts.find().lean();
  }

  async find(id: AccountId): Promise<AccountDto> {
    return this.accounts.findById(id.value).lean();
  }
}
