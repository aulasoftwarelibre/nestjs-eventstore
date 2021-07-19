import { ACCOUNT_FINDER } from '../application';
import { AccountFinder } from './services';

export const accountProviders = [
  {
    provide: ACCOUNT_FINDER,
    useClass: AccountFinder,
  },
];
