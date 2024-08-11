import { Type } from '@nestjs/common'

export const getRepositoryToken = (aggregate: Type<unknown>): string =>
  `${aggregate.name}AggregateRepository`
