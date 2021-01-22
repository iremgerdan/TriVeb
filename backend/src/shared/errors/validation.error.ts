enum ValidationErrorType {
  INVALID_INPUT,
  INVALID_LOAD_OPTION,
  INVALID_ORDER_OPTION,
  INVALID_PAGINATION_OPTION,
}

class ValidationError extends Error {
  readonly name: string;
  readonly message: string;
  readonly statusCode: number = 400;

  constructor(type: ValidationErrorType, ...args: any[]) {
    super();

    this.name = ValidationErrorType[type];

    switch (type) {
      case ValidationErrorType.INVALID_INPUT: {
        this.message = `${args[0]}`;
        break;
      }
      case ValidationErrorType.INVALID_LOAD_OPTION: {
        this.message = `"${args[0]}" is not loadable. Use one of these, "${args[1]}"`;
        break;
      }
      case ValidationErrorType.INVALID_ORDER_OPTION: {
        this.message = `"${args[0]}" is not orderable. Use one of these, "${args[1]}"`;
        break;
      }
      case ValidationErrorType.INVALID_PAGINATION_OPTION: {
        this.message = `Start of page "${args[0]}" cannot be larger than end of page "${args[1]}"`;
        break;
      }
    }
  }
}

export { ValidationError, ValidationErrorType };
