import { AccountDto } from '../../../dto';
import { Document, Schema } from 'mongoose';

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
