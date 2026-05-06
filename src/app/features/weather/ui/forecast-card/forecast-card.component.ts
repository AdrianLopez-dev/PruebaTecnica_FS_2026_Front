import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Forecast } from '../../domain/forecast.model';
import { Municipality } from '../../domain/municipality.model';
import { TemperatureUnit, symbolFor } from '../../domain/temperature-unit.model';
import { LoadStatus } from '../../data-access/weather.store';

@Component({
  selector: 'app-forecast-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, DecimalPipe, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './forecast-card.component.html',
  styleUrl: './forecast-card.component.scss',
})
export class ForecastCardComponent {
  readonly municipality = input<Municipality | null>(null);
  readonly forecast = input<Forecast | null>(null);
  readonly status = input<LoadStatus>('idle');
  readonly errorMessage = input<string | null>(null);

  protected readonly forecastDate: Date = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  })();

  protected readonly unitSymbol = computed(() => {
    const unit = this.forecast()?.unidadTemperatura as TemperatureUnit | undefined;
    return symbolFor(unit ?? null);
  });
}
