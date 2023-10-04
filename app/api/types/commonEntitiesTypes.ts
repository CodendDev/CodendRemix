/**
 * Represents estimated time object.
 */
export  interface  EstimatedTime{
    minutes: number;
    hours: number;
    days: number;
}

/**
 * Represents api error response object.
 */
export interface ApiErrorResponse{
    errorCode: string;
    message: string;
}

/**
 * Represents api errors response object.
 */
export interface ApiErrorsResponse{
    errors: ApiErrorResponse[];
}