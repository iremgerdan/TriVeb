enum UserErrorType {
  MISMATCHED_PASSWORDS,
  WRONG_CURRENT_PASSWORD,
  WRONG_CREDENTIALS,
}

class UserError extends Error {
  readonly name: string;
  readonly message: string;
  readonly statusCode: number = 400;

  constructor(type: UserErrorType, ...args: any[]) {
    super();

    this.name = UserErrorType[type];

    switch (type) {
      case UserErrorType.MISMATCHED_PASSWORDS: {
        this.message = `Given password and its confirmations do not match.`;
        break;
      }
      case UserErrorType.WRONG_CURRENT_PASSWORD: {
        this.message = `Given current password is wrong.`;
        break;
      }
      case UserErrorType.WRONG_CREDENTIALS: {
        this.message = `Given email or password is wrong.`;
        break;
      }
    }
  }
}

export { UserError, UserErrorType };
