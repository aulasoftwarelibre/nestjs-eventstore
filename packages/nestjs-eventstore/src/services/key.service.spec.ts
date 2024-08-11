import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import { Model } from 'mongoose'
import { v4 as uuid } from 'uuid'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { KeyDocument, KeyDto, KEYS } from '../crypto'
import { Event } from '../domain'
import { EVENTSTORE_KEYSTORE_CONNECTION } from '../eventstore.constants'
import { KeyService } from './key.service'

const generateKey = (_id: string): KeyDto => ({
  _id,
  salt: 'salt',
  secret: 'secret',
})

describe('KeyService', () => {
  const PAYLOAD = { foo: 'bar' }
  const ENCRYPTED_PAYLOAD = 'z6ZatDe7V2Dvkxyvx9fzazqjc5BOWqSTpUaQzrkUeR4='

  let keyService: KeyService
  let keys: Model<KeyDocument>

  beforeEach(async () => {
    const moduleReference = await Test.createTestingModule({
      providers: [
        KeyService,
        {
          provide: getModelToken(KEYS, EVENTSTORE_KEYSTORE_CONNECTION),
          useValue: {
            findById: vi.fn(),
            findByIdAndRemove: vi.fn(),
          },
        },
      ],
    }).compile()

    keyService = moduleReference.get<KeyService>(KeyService)
    keys = moduleReference.get<Model<KeyDocument>>(
      getModelToken(KEYS, EVENTSTORE_KEYSTORE_CONNECTION),
    )
  })

  describe('encrypt', () => {
    it('should be able to encrypt an event', async () => {
      const aggregateId = uuid()
      const event = new Event(aggregateId, PAYLOAD)

      vi.spyOn(keys, 'findById').mockReturnValue({
        lean: vi.fn().mockResolvedValueOnce(generateKey(aggregateId)),
      } as unknown as ReturnType<(typeof keys)['findById']>)

      const result = await keyService.encryptEvent(event)

      expect(keys.findById).toBeCalledWith(aggregateId)
      expect(result.encryptedPayload).toEqual(ENCRYPTED_PAYLOAD)
    })
  })

  describe('decrypt', () => {
    it('should be able to decrypt a string', async () => {
      const aggregateId = uuid()

      vi.spyOn(keys, 'findById').mockReturnValue({
        lean: vi.fn().mockResolvedValueOnce(generateKey(aggregateId)),
      } as unknown as ReturnType<(typeof keys)['findById']>)

      const result = await keyService.decryptPayload(
        aggregateId,
        ENCRYPTED_PAYLOAD,
      )

      expect(keys.findById).toBeCalledWith(aggregateId)
      expect(result).toEqual(PAYLOAD)
    })
  })
})
