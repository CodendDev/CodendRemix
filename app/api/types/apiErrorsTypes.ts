/**
 * Represents api error response object.
 */
export interface ApiErrorResponse {
  errorCode: string;
  message: string;
}

export class Errors {
  static LoginErrors = class {
    static InvalidEmailOrPassword = "Login.InvalidEmailOrPassword";
  };
}

declare global {
  interface Array<T extends ApiErrorResponse> {
    hasError(code: string): boolean;
  }
}

if (!Array.prototype.hasError) {
  Array.prototype.hasError = function <T extends ApiErrorResponse>(
    this: Array<T>,
    code: string
  ) {
    return this.filter((e) => e.errorCode === code).length > 0;
  };
}
