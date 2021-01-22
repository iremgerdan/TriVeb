import { atom } from 'recoil';

import { User } from 'interfaces/services/models/User';

export const loggedUser = atom<User | undefined>({
  key: 'user',
  default: undefined,
});
