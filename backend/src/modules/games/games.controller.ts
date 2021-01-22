import { Controller } from '@nestjs/common';

import { GamesService } from 'src/modules/games/games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}
}
