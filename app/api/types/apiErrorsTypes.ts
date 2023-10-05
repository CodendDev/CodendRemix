/**
 * Represents api error response object.
 */
export interface ApiErrorResponse {
  errorCode: string;
  message: string;
}

export type ErrorCode = string;
export const Errors = {
  LoginErrors: {
    InvalidEmailOrPassword: "Login.InvalidEmailOrPassword",
  },
  RegisterErrors: {
    Email: {
      EmailAlreadyExists: "Register.EmailAlreadyExists",
      EmailAddressNotValid: "Validation.EmailAddress.NotValid",
    },
    Password: {
      PasswordTooShort: "Validation.Password.TooShort",
      PasswordNotContainLowercaseLetter:
        "Validation.Password.NotContainLowercaseLetter",
      PasswordNotContainUppercaseLetter:
        "Validation.Password.NotContainUppercaseLetter",
      PasswordNotContainDigit: "Validation.Password.NotContainDigit",
      PasswordNotContainCustomChar: "Validation.Password.NotContainCustomChar",
    },
  },
};

declare global {
  interface Array<T extends ApiErrorResponse> {
    hasError(code: ErrorCode): boolean;
  }
}

if (!Array.prototype.hasError) {
  Array.prototype.hasError = function <T extends ApiErrorResponse>(
    this: Array<T>,
    code: ErrorCode
  ) {
    return this.filter((e) => e.errorCode === code).length > 0;
  };
}
