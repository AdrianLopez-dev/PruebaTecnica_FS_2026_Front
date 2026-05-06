export const TemperatureUnit = {
  Celsius: 'G_CEL',
  Fahrenheit: 'G_FAH',
} as const;

export type TemperatureUnit = (typeof TemperatureUnit)[keyof typeof TemperatureUnit];

export interface TemperatureUnitOption {
  readonly value: TemperatureUnit;
  readonly symbol: '°C' | '°F';
  readonly label: string;
}

export const TEMPERATURE_UNIT_OPTIONS: readonly TemperatureUnitOption[] = [
  { value: TemperatureUnit.Celsius, symbol: '°C', label: 'Grados Celsius' },
  { value: TemperatureUnit.Fahrenheit, symbol: '°F', label: 'Grados Fahrenheit' },
];

export function symbolFor(unit: TemperatureUnit | null | undefined): '°C' | '°F' {
  return unit === TemperatureUnit.Fahrenheit ? '°F' : '°C';
}
