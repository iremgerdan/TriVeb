enum GameErrorType {
  STARTED_GAME,
}

class GameError extends Error {
  readonly name: string;
  readonly message: string;
  readonly statusCode: number = 400;

  constructor(type: GameErrorType, ...args: any[]) {
    super();

    this.name = GameErrorType[type];

    switch (type) {
      case GameErrorType.STARTED_GAME: {
        this.message = `The game with pin number "${args[0]}" has already started.`;
        break;
      }
    }
  }
}

export { GameError, GameErrorType };
