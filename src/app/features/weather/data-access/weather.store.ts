import {
  DestroyRef,
  Injectable,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ApiError } from '@core/api/http-error.interceptor';
import { Forecast } from '../domain/forecast.model';
import { Municipality } from '../domain/municipality.model';
import { TemperatureUnit } from '../domain/temperature-unit.model';
import { ForecastService } from './forecast.service';
import { MunicipalityService } from './municipality.service';

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

interface ForecastSlice {
  readonly status: LoadStatus;
  readonly data: Forecast | null;
  readonly error: string | null;
}

const initialForecast: ForecastSlice = { status: 'idle', data: null, error: null };

// Almacén centralizado de estado: municipios, selecciones del usuario y previsión.
// Refresca automáticamente la previsión ante cambios de municipio o unidad.
@Injectable({ providedIn: 'root' })
export class WeatherStore {
  private readonly municipalityService = inject(MunicipalityService);
  private readonly forecastService = inject(ForecastService);
  private readonly destroyRef = inject(DestroyRef);

  // Estado de municipios
  private readonly municipalitiesSignal: WritableSignal<Municipality[]> = signal([]);
  private readonly municipalitiesStatusSignal: WritableSignal<LoadStatus> = signal('idle');
  private readonly municipalitiesErrorSignal: WritableSignal<string | null> = signal(null);

  // Selecciones del usuario
  private readonly selectedMunicipalitySignal: WritableSignal<Municipality | null> = signal(null);
  private readonly temperatureUnitSignal: WritableSignal<TemperatureUnit | null> = signal(null);

  // Previsión meteorológica
  private readonly forecastSignal: WritableSignal<ForecastSlice> = signal(initialForecast);

  // Públicos para consumo en componentes
  readonly municipalities: Signal<Municipality[]> = this.municipalitiesSignal.asReadonly();
  readonly municipalitiesStatus = this.municipalitiesStatusSignal.asReadonly();
  readonly municipalitiesError = this.municipalitiesErrorSignal.asReadonly();

  readonly selectedMunicipality = this.selectedMunicipalitySignal.asReadonly();
  readonly temperatureUnit = this.temperatureUnitSignal.asReadonly();

  readonly forecast: Signal<Forecast | null> = computed(() => this.forecastSignal().data);
  readonly forecastStatus: Signal<LoadStatus> = computed(() => this.forecastSignal().status);
  readonly forecastError: Signal<string | null> = computed(() => this.forecastSignal().error);

  constructor() {
    // Relanza la previsión cada vez que cambian municipio o unidad
    effect(() => {
      const municipality = this.selectedMunicipalitySignal();
      const unit = this.temperatureUnitSignal();
      untracked(() => this.refreshForecast(municipality, unit));
    });
  }

  // Carga la lista de municipios desde el backend
  loadMunicipalities(): void {
    if (this.municipalitiesStatusSignal() === 'loading') {
      return;
    }
    this.municipalitiesStatusSignal.set('loading');
    this.municipalitiesErrorSignal.set(null);

    this.municipalityService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.municipalitiesSignal.set(data);
          this.municipalitiesStatusSignal.set('success');
        },
        error: (err: ApiError) => {
          this.municipalitiesSignal.set([]);
          this.municipalitiesStatusSignal.set('error');
          this.municipalitiesErrorSignal.set(err.message);
        },
      });
  }

  // Actualiza la selección de municipio y dispara refresco de previsión
  selectMunicipality(municipality: Municipality | null): void {
    this.selectedMunicipalitySignal.set(municipality);
  }

  // Actualiza la unidad de temperatura y dispara refresco de previsión
  setTemperatureUnit(unit: TemperatureUnit | null): void {
    this.temperatureUnitSignal.set(unit);
  }

  // Consulta la previsión del municipio seleccionado en la unidad elegida
  private refreshForecast(municipality: Municipality | null, unit: TemperatureUnit | null): void {
    if (!municipality) {
      this.forecastSignal.set(initialForecast);
      return;
    }

    this.forecastSignal.set({ status: 'loading', data: null, error: null });

    this.forecastService
      .get(municipality.id, unit)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.forecastSignal.set({ status: 'success', data, error: null }),
        error: (err: ApiError) =>
          this.forecastSignal.set({ status: 'error', data: null, error: err.message }),
      });
  }
}
