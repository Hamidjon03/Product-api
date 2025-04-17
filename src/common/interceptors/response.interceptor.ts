import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { resData } from '../utils/resData';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        // Agar response allaqachon to'g'ri formatda bo'lsa, uni qaytaramiz
        if (response?.statusCode && response?.message && 'data' in response) {
          return response;
        }

        // Aks holda default format bilan o'raymiz
        return resData(response);
      }),
    );
  }
}
