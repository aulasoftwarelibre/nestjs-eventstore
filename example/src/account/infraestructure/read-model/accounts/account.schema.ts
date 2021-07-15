import { Document, Schema } from 'mongoose';

import { AccountDto } from '../../../dto';

export const ACCOUNTS_PROJECTION = 'accounts';

export type AccountDocument = AccountDto & Document;

export const AccountSchema = new Schema(
  {
    _id: String,
    title: String,
    balance: Number,
  },
  {
    versionKey: false,
  },
);
