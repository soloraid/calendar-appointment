import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { calendarActions } from './calendar.actions';
import { calenderFeature } from './calendar.state';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class CalendarEffects {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private snackBar = inject(MatSnackBar);


  private addedAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(calendarActions.add),
      withLatestFrom(this.store.select(calenderFeature.selectInvalidTime)),
      map(([_, invalidTime]) => {
        if (invalidTime) {
          this.snackBar.open('Time Invalid.');
          return calendarActions.resetInvalidTime();
        }
        return calendarActions.noOp();
      })
    )
  );
}
