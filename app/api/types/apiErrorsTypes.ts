/**
 * Represents api error response object.
 */
export interface ApiErrorResponse {
  errorCode: string;
  message: string;
}

export type ApiErrorCode = string;
export const ApiErrors = {
  LoginErrors: {
    InvalidEmailOrPassword: "Login.InvalidEmailOrPassword",
  },
  RegisterErrors: {
    Email: {
      EmailAlreadyExists: "Register.EmailAlreadyExists",
      EmailAddressNotValid: "Validation.EmailAddress.NotValid",
    },
    Password: {
      PasswordsDoesntMatch: "UI.Password.PasswordsDoesntMatch",
      PasswordDoesntMatchRules: "UI.Password.PasswordDoesntMatchRules",
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Array<T extends ApiErrorResponse> {
    /**
     * Checks whether array contains given {@link ApiErrorCode}.
     *
     * @param code error code
     */
    hasError(code: ApiErrorCode | string): boolean;
  }
}

if (!Array.prototype.hasError) {
  // eslint-disable-next-line no-extend-native
  Array.prototype.hasError = function <T extends ApiErrorResponse>(
    this: Array<T>,
    code: ApiErrorCode | string
  ) {
    return (
      this.filter((e) => e.errorCode === code || e.toString() === code).length >
      0
    );
  };
}
