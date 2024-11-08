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


  private addAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(calendarActions.add),
      map((payload) => {
        return calendarActions.added({
          appointment: payload.appointment,
        });
      })
    )
  );


  private addedAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(calendarActions.added),
      withLatestFrom(this.store.select(calenderFeature.selectInvalidTime)),
      map(([_, invalidTime]) => {
        if (invalidTime) {
          this.snackBar.open('Time Invalid.', null, {duration: 3000});
          return calendarActions.resetInvalidTime();
        }
        this.snackBar.open('appointment added.', null, {duration: 3000});
        return calendarActions.noOp();
      })
    )
  );
}
