import { AesService } from '@akanass/nestjsx-crypto';
import {
  decryptWithAesKey,
  encryptWithAesKey,
} from '@akanass/nestjsx-crypto/operators/aes';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { Event } from '../domain';
import { KeyDto } from './key.dto';
import { KeyDocument, KEYS } from './key.schema';

@Injectable()
export class KeyService {
  constructor(
    @InjectModel(KEYS)
    private readonly keys: Model<KeyDocument>,
    private readonly aesService: AesService,
  ) {}

  async create(id: string): Promise<KeyDto> {
    const secret = uuid();
    const salt = uuid();

    const key = new this.keys({ _id: id, secret, salt });

    return key.save();
  }

  async find(id: string): Promise<KeyDto> {
    return this.keys.findById(id).exec();
  }

  async delete(id: string): Promise<void> {
    this.keys.findByIdAndRemove(id).exec();
  }

  async encrypt(event: Event): Promise<Event> {
    let key = await this.find(event.aggregateId);

    if (!key) {
      key = await this.create(event.aggregateId);
    }

    const data = JSON.stringify(event.payload);

    const source$ = this.aesService
      .createKey(key.secret, key.salt)
      .pipe(encryptWithAesKey(Buffer.from(data, 'utf16le')));

    const buffer = await firstValueFrom(source$);

    return event.withEncryptedPayload(buffer.toString('base64'));
  }

  async decrypt(event: Event): Promise<Event> {
    const key = await this.find(event.aggregateId);
    const data = event.encryptedPayload;

    if (!event.aggregateEncrypted) {
      return event;
    }

    const source$ = this.aesService
      .createKey(key.secret, key.salt)
      .pipe(decryptWithAesKey(Buffer.from(data, 'base64')));

    const buffer = await firstValueFrom(source$);
    const payload = JSON.parse(buffer.toString('utf16le'));

    return event.withPayload(payload);
  }
}
