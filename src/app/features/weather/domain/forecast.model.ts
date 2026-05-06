import { TemperatureUnit } from './temperature-unit.model';

export interface PrecipitationProbability {
  readonly probabilidad: number;
  readonly periodo: string;
}

export interface Forecast {
  readonly mediaTemperatura: number;
  readonly unidadTemperatura: TemperatureUnit;
  readonly probPrecipitacion: readonly PrecipitationProbability[];
}
