export class ResData<T> {
  message: string;
  statusCode: number;
  data?: T | null;
  error?: Error | null;

  constructor(
    message: string,
    statusCode: number,
    data?: T | null,
    error?: Error | null,
  ) {
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
    this.error = error;
  }
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export function resData<T>(
  data: T,
  message = 'OK',
  statusCode = 200,
): ApiResponse<T> {
  return {
    statusCode,
    message,
    data,
  };
}
