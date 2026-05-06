import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_CONFIG } from '@core/config/api-config';
import { Municipality } from '../domain/municipality.model';

@Injectable({ providedIn: 'root' })
export class MunicipalityService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_CONFIG).baseUrl;

  list(): Observable<Municipality[]> {
    return this.http.get<Municipality[]>(`${this.baseUrl}/municipios`);
  }
}
