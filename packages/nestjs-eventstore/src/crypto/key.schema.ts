import { Document, Schema } from 'mongoose'

import { KeyDto } from './key.dto'

export const KEYS = 'keys'

export type KeyDocument = KeyDto & Document

export const KeySchema = new Schema(
  {
    _id: String,
    salt: String,
    secret: String,
  },
  {
    versionKey: false,
  },
)
