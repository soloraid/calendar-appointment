import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { calenderFeature } from './calendar/data/calendar.state';
import { provideEffects } from '@ngrx/effects';
import { CalendarEffects } from './calendar/data/calendar.effects';

export const routes: Routes = [
  {
    path: 'calendar',
    loadComponent: () => import('./calendar/components/calendar-view/calendar-view.component').then(c => c.CalendarViewComponent),
    providers: [provideState(calenderFeature), provideEffects(CalendarEffects)]
  },
  {path: '', redirectTo: 'calendar', pathMatch: 'full'},
];
