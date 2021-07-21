import { PasswordWasUpdatedProjection } from './password-was-updated.projection';
import { UserWasCreatedProjection } from './user-was-created.projection';
import { UserWasDeletedProjection } from './user-was-deleted.projection';

export * from './user.schema';

export const projectionHandlers = [
  UserWasCreatedProjection,
  PasswordWasUpdatedProjection,
  UserWasDeletedProjection
];
