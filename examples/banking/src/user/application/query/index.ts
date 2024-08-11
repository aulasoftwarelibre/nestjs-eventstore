import { GetUserHandler } from './get-user.handler'
import { GetUsersHandler } from './get-users.handler'

export * from './get-user.query'
export * from './get-users.query'

export const queryHandlers = [GetUsersHandler, GetUserHandler]
