import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { apiTokenInterceptor } from '@core/api/api-token.interceptor';
import { httpErrorInterceptor } from '@core/api/http-error.interceptor';
import { provideApiConfig } from '@core/config/api-config';
import { environment } from '@env/environment';

import { routes } from './app.routes';

registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([apiTokenInterceptor, httpErrorInterceptor])),
    provideApiConfig(environment.api),
    { provide: LOCALE_ID, useValue: 'es' },
  ],
};
