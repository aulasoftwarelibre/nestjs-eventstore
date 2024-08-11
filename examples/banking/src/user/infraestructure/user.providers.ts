import { USER_FINDER } from '../application'
import { UserFinder } from './services'

export const userProviders = [
  {
    provide: USER_FINDER,
    useClass: UserFinder,
  },
]
