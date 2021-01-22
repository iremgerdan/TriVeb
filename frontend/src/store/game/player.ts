import { atom } from 'recoil';
import { Player } from 'interfaces/services/game/player';

export const player = atom<Player | undefined>({
  key: 'player',
  default: undefined,
});
