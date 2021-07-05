export const getRepositoryToken = (aggregate: Function): string =>
  `${aggregate.name}AggregateRepository`;
