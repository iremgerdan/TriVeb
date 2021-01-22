enum DatabaseErrorType {
  MISSING_RECORD,
  USED_EMAIL,
}

class DatabaseError extends Error {
  readonly name: string;
  readonly message: string;
  readonly statusCode: number = 400;

  constructor(type: DatabaseErrorType, ...args: any[]) {
    super();

    this.name = DatabaseErrorType[type];

    switch (type) {
      case DatabaseErrorType.MISSING_RECORD: {
        this.message = `There aren't any records in table "${
          args[0]
        }" matched with these parameters: "${JSON.stringify(args[1])}"`;
        break;
      }
      case DatabaseErrorType.USED_EMAIL: {
        this.message = `Given email "${args[0]}" is already used.`;
        break;
      }
    }
  }
}

export { DatabaseError, DatabaseErrorType };
