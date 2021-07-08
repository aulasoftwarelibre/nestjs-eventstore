import { ACCOUNT_FINDER } from '../application';
import { AccountFinder } from './services/account.finder.service';

export const accountProviders = [
  {
    provide: ACCOUNT_FINDER,
    useClass: AccountFinder,
  },
];
