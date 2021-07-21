import { Document, Schema } from 'mongoose';

import { UserDto } from '../../../dto';

export const USERS_PROJECTION = 'users';

export type UserDocument = UserDto & Document;

export const UserSchema = new Schema(
  {
    _id: String,
    username: { type: String, index: { unique: true } },
    password: String,
  },
  {
    versionKey: false,
  },
);
