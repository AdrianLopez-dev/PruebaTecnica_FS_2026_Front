import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    override readonly cause?: HttpErrorResponse,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const message =
        err.status === 0
          ? 'No se ha podido contactar con el servidor. Verifica que el backend esté arrancado.'
          : err.error?.message ?? `Error ${err.status} al llamar a ${req.url}`;
      return throwError(() => new ApiError(message, err.status, err));
    }),
  );
