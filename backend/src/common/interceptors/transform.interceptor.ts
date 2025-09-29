import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const path = request.url;

    return next.handle().pipe(
      map((data) => {
        // Nếu data đã có format { data, meta } (từ pagination)
        if (
          data &&
          typeof data === 'object' &&
          'data' in data &&
          'meta' in data
        ) {
          return {
            success: true,
            message: 'Request successful',
            data: data.data,
            meta: data.meta,
            timestamp: new Date().toISOString(),
            path,
          };
        }

        // Response thông thường
        return {
          success: true,
          message: 'Request successful',
          data,
          timestamp: new Date().toISOString(),
          path,
        };
      }),
    );
  }
}
