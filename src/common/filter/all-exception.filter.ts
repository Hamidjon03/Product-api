import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch() // Catches all exceptions globally
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name); // Logger for error tracking

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    // Determine HTTP status code
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extract validation errors if this is a BadRequestException (validation failure)
    const validationErrors = this.extractValidationErrors(exception);

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()), // Extracts the request URL
      message: this.getErrorMessage(exception), // Gets a meaningful error message
      success: false,
      // Include validation errors if they exist
      ...(validationErrors && { errors: validationErrors }),
    };

    // Log server errors (5xx) with stack trace for debugging
    if (httpStatus >= 500) {
      this.logger.error(
        `Server Error: ${responseBody.message}`,
        exception instanceof Error ? exception.stack : 'No stack trace',
      );
    }

    // Send a formatted response to the client
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }

  // Extracts an appropriate error message from the exception
  private getErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      // Obyekt yoki string ekanligini tekshirish
      if (typeof response === 'object' && response !== null) {
        // @ts-ignore - Avval response.message ni tekshirish
        if (response.message) {
          // @ts-ignore - Agar message string bo'lsa
          if (typeof response.message === 'string') {
            // @ts-ignore
            return response.message;
          }
          // @ts-ignore - Agar message array bo'lsa
          else if (Array.isArray(response.message)) {
            // @ts-ignore
            return response.message.join(', ');
          }
        }

        // @ts-ignore - Agar response.error mavjud bo'lsa
        if (response.error) {
          // @ts-ignore
          return response.error;
        }
      }

      // Agar response string bo'lsa to'g'ridan-to'g'ri qaytarish
      if (typeof response === 'string') {
        return response;
      }

      // Agar yuqoridagilar bo'lmasa, exception.message ni qaytarish
      return exception.message;
    }

    // Exception HttpException bo'lmagan holda
    if (exception instanceof Error) {
      return exception.message;
    }

    return String(exception);
  }

  // Extract validation errors for detailed reporting
  private extractValidationErrors(exception: unknown): any[] | null {
    if (exception instanceof BadRequestException) {
      const response = exception.getResponse();

      if (typeof response === 'object' && response !== null) {
        // @ts-ignore
        if (response.message && Array.isArray(response.message)) {
          // @ts-ignore
          return response.message;
        }

        // Check if errors field exists and contains validation details
        // @ts-ignore
        if (response.errors && Array.isArray(response.errors)) {
          // @ts-ignore
          return response.errors;
        }
      }
    }

    return null;
  }
}
