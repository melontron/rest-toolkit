class BaseError extends Error {
  static get codes() {
    const errors = {
      messages: {
        ERROR_CUSTOM_CODE: {
          'message': `ERROR MESSAGE`,
          'situation': 'How this error could happen',
        },
        INTERNAL_SERVER_ERROR: {
          'message': `ERROR MESSAGE`,
          'situation': 'How this error could happen',
        },
        VALIDATION_ERROR: {
          'message': `Validation error`,
          'situation': 'Method arguments failed to validate',
        },
      },
    };
    Object.keys(errors.messages).map((code) => {
      Object.defineProperty(errors, code, {
        get: () => {
          return code;
        },
      });
      errors.messages[code].error_code = code;
    });
    return errors;
  }

  constructor(code, details) {
    const validCodes = Object.keys(BaseError.codes.messages);
    if (validCodes.indexOf(code) === -1) {
      throw new Error('Invalid error code given in BaseError constructor');
    }
    super(BaseError.codes.messages[code].message);
    this.situation = BaseError.codes.messages[code].situation;
    this.error_code = BaseError.codes.messages[code].error_code;
    this.custom = true;
    if (details) {
      this.details = details;
    }
  }

  static makeDocTable() {
    const fs = require('fs');
    let doc = `|Error code | Situation | UI message |\n|---|---|---|\n`;
    Object.keys(this.codes.messages).map((code) => {
      doc += `|${code}|${this.codes.messages[code].situation}|${this.codes.messages[code].message}|\n`;
    });
    fs.writeFileSync('./error-codes.md', doc);
  }
}

class ValidationError extends BaseError {
  constructor(args, details) {
    super(args, details);
    this.name = this.constructor.name;
  }
}

class AuthenticationError extends BaseError {
  constructor(args, details) {
    super(args, details);
    this.name = this.constructor.name;
  }
}

class AuthorizationError extends BaseError {
  constructor(args, details) {
    super(args, details);
    this.name = this.constructor.name;
  }
}

class NetworkError extends BaseError {
  constructor(args, details) {
    super(args, details);
    this.name = this.constructor.name;
  }
}

class CodeError extends BaseError {
  constructor(args, details) {
    super(BaseError.codes.INTERNAL_SERVER_ERROR, details);
    this.situation = args;
    this.name = this.constructor.name;
  }
}

class ForbiddenError extends BaseError {
  constructor(args, details) {
    super(args, details);
    this.name = this.constructor.name;
  }
}

class NotFoundError extends BaseError {
  constructor(args, details) {
    super(args, details);
    this.name = this.constructor.name;
  }
}


module.exports = {
  ValidationError,
  AuthenticationError,
  NetworkError,
  CodeError,
  AuthorizationError,
  ForbiddenError,
  NotFoundError,
};


