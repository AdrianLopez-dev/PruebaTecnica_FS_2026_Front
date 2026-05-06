import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { WeatherStore } from '../data-access/weather.store';
import { Municipality } from '../domain/municipality.model';
import { TemperatureUnit } from '../domain/temperature-unit.model';

import { ForecastCardComponent } from '../ui/forecast-card/forecast-card.component';
import { MunicipalityAutocompleteComponent } from '../ui/municipality-autocomplete/municipality-autocomplete.component';
import { TemperatureUnitSelectorComponent } from '../ui/temperature-unit-selector/temperature-unit-selector.component';

@Component({
  selector: 'app-weather-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MunicipalityAutocompleteComponent,
    TemperatureUnitSelectorComponent,
    ForecastCardComponent,
  ],
  templateUrl: './weather-page.component.html',
  styleUrl: './weather-page.component.scss',
})
export class WeatherPageComponent implements OnInit {
  protected readonly store = inject(WeatherStore);

  ngOnInit(): void {
    this.store.loadMunicipalities();
  }

  protected onMunicipalitySelected(municipality: Municipality | null): void {
    this.store.selectMunicipality(municipality);
  }

  protected onUnitChanged(unit: TemperatureUnit | null): void {
    this.store.setTemperatureUnit(unit);
  }
}
