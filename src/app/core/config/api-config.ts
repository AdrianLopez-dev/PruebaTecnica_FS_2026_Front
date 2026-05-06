import { InjectionToken, Provider } from '@angular/core';

export interface ApiConfig {
  readonly baseUrl: string;
  readonly token: string;
  readonly requestTimeoutMs: number;
}

export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG');

export function provideApiConfig(config: ApiConfig): Provider {
  return { provide: API_CONFIG, useValue: config };
}
