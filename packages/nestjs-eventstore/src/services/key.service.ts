import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { v4 as uuid } from 'uuid'

import {
  createAesKey,
  decryptWithAesKey,
  encryptWithAesKey,
  KeyDocument,
  KeyDto,
  KEYS,
} from '../crypto'
import { Event } from '../domain'
import { KeyNotFoundError } from '../errors'
import { EVENTSTORE_KEYSTORE_CONNECTION } from '../eventstore.constants'

@Injectable()
export class KeyService {
  private readonly logger = new Logger(KeyService.name)

  constructor(
    @InjectModel(KEYS, EVENTSTORE_KEYSTORE_CONNECTION)
    private readonly keys: Model<KeyDocument>,
  ) {}

  async create(id: string): Promise<KeyDto> {
    const secret = uuid()
    const salt = uuid()

    const key = new this.keys({ _id: id, salt, secret })

    return key.save()
  }

  async find(id: string): Promise<KeyDto> {
    return this.keys.findById(id).lean()
  }

  async delete(id: string): Promise<void> {
    this.keys.findByIdAndRemove(id).exec()
  }

  async encryptEvent(event: Event): Promise<Event> {
    const key =
      event.version === 0
        ? await this.create(event.aggregateId)
        : await this.find(event.aggregateId)

    if (!key) {
      this.logger.error(
        `Key not found during encrypting event ${event.eventType} with id [${event.aggregateId}]`,
      )
      return event
    }

    const data = JSON.stringify(event.payload)

    const aesKey = await createAesKey(key.secret, key.salt)
    const buffer = encryptWithAesKey(Buffer.from(data, 'utf16le'), aesKey)

    return event.withEncryptedPayload(buffer.toString('base64'))
  }

  async decryptPayload(id: string, encryptedPayload: string): Promise<string> {
    const key = await this.find(id)

    if (!key) {
      throw KeyNotFoundError.withId(id)
    }

    const aesKey = await createAesKey(key.secret, key.salt)
    const buffer = decryptWithAesKey(
      Buffer.from(encryptedPayload, 'base64'),
      aesKey,
    )
    const payload = JSON.parse(buffer.toString('utf16le'))

    return payload
  }
}
