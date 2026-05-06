import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/weather/weather-page/weather-page.component').then(
        (m) => m.WeatherPageComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
