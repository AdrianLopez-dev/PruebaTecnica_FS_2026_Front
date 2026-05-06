import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_CONFIG } from '@core/config/api-config';
import { Forecast } from '../domain/forecast.model';
import { TemperatureUnit } from '../domain/temperature-unit.model';

@Injectable({ providedIn: 'root' })
export class ForecastService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_CONFIG).baseUrl;

  get(municipalityId: string, unit: TemperatureUnit | null): Observable<Forecast> {
    let params = new HttpParams();
    if (unit) {
      params = params.set('unidadTemperatura', unit);
    }
    return this.http.get<Forecast>(`${this.baseUrl}/prediccion/${municipalityId}`, { params });
  }
}
