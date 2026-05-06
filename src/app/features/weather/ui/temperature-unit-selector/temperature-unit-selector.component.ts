import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import {
  TEMPERATURE_UNIT_OPTIONS,
  TemperatureUnit,
} from '../../domain/temperature-unit.model';

@Component({
  selector: 'app-temperature-unit-selector',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, MatSelectModule],
  templateUrl: './temperature-unit-selector.component.html',
  styleUrl: './temperature-unit-selector.component.scss',
})
export class TemperatureUnitSelectorComponent {
  readonly value = input<TemperatureUnit | null>(null);
  readonly unitChanged = output<TemperatureUnit | null>();

  protected readonly options = TEMPERATURE_UNIT_OPTIONS;

  protected onChange(next: TemperatureUnit | null): void {
    this.unitChanged.emit(next);
  }
}
