import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Municipality } from '../../domain/municipality.model';
import { normalize } from '@shared/util/string.util';

const MAX_OPTIONS = 50;

@Component({
  selector: 'app-municipality-autocomplete',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './municipality-autocomplete.component.html',
  styleUrl: './municipality-autocomplete.component.scss',
})
export class MunicipalityAutocompleteComponent {
  readonly municipalities = input.required<readonly Municipality[]>();
  readonly loading = input<boolean>(false);
  readonly errorMessage = input<string | null>(null);

  readonly municipalitySelected = output<Municipality | null>();

  protected readonly control = new FormControl<string | Municipality>('', { nonNullable: true });
  private readonly query = toSignal(this.control.valueChanges, { initialValue: '' });

  protected readonly filteredMunicipalities = computed<readonly Municipality[]>(() => {
    const value = this.query();
    const all = this.municipalities();
    const term = typeof value === 'string' ? value : value?.nombre ?? '';
    const needle = normalize(term);
    if (!needle) {
      return all.slice(0, MAX_OPTIONS);
    }
    const matches: Municipality[] = [];
    for (const m of all) {
      if (normalize(m.nombre).includes(needle)) {
        matches.push(m);
        if (matches.length === MAX_OPTIONS) break;
      }
    }
    return matches;
  });

  private readonly lastEmittedId = signal<string | null>(null);

  protected displayFn = (m: Municipality | string | null): string => {
    if (!m) return '';
    return typeof m === 'string' ? m : m.nombre;
  };

  protected onSelected(event: MatAutocompleteSelectedEvent): void {
    const municipality = event.option.value as Municipality;
    if (this.lastEmittedId() !== municipality.id) {
      this.lastEmittedId.set(municipality.id);
      this.municipalitySelected.emit(municipality);
    }
  }

  protected onBlur(): void {
    if (typeof this.control.value === 'string' && this.control.value.trim() === '') {
      if (this.lastEmittedId() !== null) {
        this.lastEmittedId.set(null);
        this.municipalitySelected.emit(null);
      }
    }
  }
}
