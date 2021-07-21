import { GetUserHandler } from './get-user.handler';
import { GetUsersHandler } from './get-users.handler';

export * from './get-users.query';
export * from './get-user.query';

export const queryHandlers = [GetUsersHandler, GetUserHandler];
