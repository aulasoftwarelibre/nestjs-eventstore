import { CreateUserHandler } from './create-user.handler'
import { DeleteUserHandler } from './delete-user.handler'
import { UpdateUserHandler } from './update-user.handler'

export const commandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
]

export * from './create-user.query'
export * from './delete-user.query'
export * from './update-user.query'
