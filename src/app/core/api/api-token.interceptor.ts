import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { API_CONFIG } from '../config/api-config';

export const apiTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const { baseUrl, token } = inject(API_CONFIG);

  const targetsApi = req.url.startsWith(baseUrl);
  if (!targetsApi || !token) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { 'X-API-TOKEN': token } }));
};
