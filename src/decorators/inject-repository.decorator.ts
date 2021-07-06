import { Inject, Type } from '@nestjs/common';

import { getRepositoryToken } from '../utils/repository';

export const InjectAggregateRepository = (
  aggregate: Type<unknown>,
): ParameterDecorator => Inject(getRepositoryToken(aggregate));
