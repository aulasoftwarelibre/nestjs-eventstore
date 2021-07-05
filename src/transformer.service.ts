import { Injectable } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';

import { TransformerRepo } from './interfaces/transformer.type';

export const EVENT_STORE_TRANSFORMERS_TOKEN = 'EVENT_STORE_TRANSFORMERS_TOKEN';

@Injectable()
export class TransformerService {
  public readonly repo: TransformerRepo;

  constructor(private readonly modules: ModulesContainer) {
    const transformers = [...this.modules.values()]
      .flatMap((module) => [...module.providers.values()])
      .filter(({ name }) => name === EVENT_STORE_TRANSFORMERS_TOKEN)
      .flatMap(({ instance }) => Object.entries(instance as TransformerRepo));

    this.repo = Object.fromEntries(transformers);
  }
}
