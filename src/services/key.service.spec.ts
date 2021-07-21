import { CryptoModule } from '@akanass/nestjsx-crypto';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import { Model } from 'mongoose';

import { KeyDto, KeyDocument, KEYS } from '../crypto';
import { Event } from '../domain';
import { KeyService } from './key.service';

describe('KeyService', () => {
  const PAYLOAD = { foo: 'bar' };
  const ENCRYPTED_PAYLOAD = 'z6ZatDe7V2Dvkxyvx9fzazqjc5BOWqSTpUaQzrkUeR4=';
  const generateKey = (_id: string): KeyDto => ({
    _id,
    secret: 'secret',
    salt: 'salt',
  });

  let keyService: KeyService;
  let keys: Model<KeyDocument>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CryptoModule],
      providers: [
        KeyService,
        {
          provide: getModelToken(KEYS),
          useValue: {
            findById: jest.fn(),
            findByIdAndRemove: jest.fn(),
          },
        },
      ],
    }).compile();

    keyService = moduleRef.get<KeyService>(KeyService);
    keys = moduleRef.get<Model<KeyDocument>>(getModelToken(KEYS));
  });

  describe('encrypt', () => {
    it('should be able to encrypt an event', async () => {
      const aggregateId = uuid();
      const event = new Event(aggregateId, PAYLOAD);

      jest.spyOn(keys, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(generateKey(aggregateId)) as any,
      } as any);

      const result = await keyService.encryptEvent(event);

      expect(keys.findById).toBeCalledWith(aggregateId);
      expect(result.encryptedPayload).toEqual(ENCRYPTED_PAYLOAD);
    });
  });

  describe('decrypt', () => {
    it('should be able to decrypt a string', async () => {
      const aggregateId = uuid();

      jest.spyOn(keys, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(generateKey(aggregateId)) as any,
      } as any);

      const result = await keyService.decryptPayload(
        aggregateId,
        ENCRYPTED_PAYLOAD,
      );

      expect(keys.findById).toBeCalledWith(aggregateId);
      expect(result).toEqual(PAYLOAD);
    });
  });
});
