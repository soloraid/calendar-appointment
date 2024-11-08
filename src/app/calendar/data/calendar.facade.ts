import { inject, Injectable, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { calenderFeature } from './calendar.state';
import { Appointment, AppointmentStatus, DayAppointments } from '../models/appointment.model';
import { calendarActions } from './calendar.actions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarFacade {
  private store = inject(Store);


  get appointmentStatus(): Observable<AppointmentStatus> {
    return this.store.select(calenderFeature.selectAddStatus);
  }
  getDayAppointments(selectedDate: Date): Signal<DayAppointments> {
    return this.store.selectSignal(calenderFeature.selectDateAppointments(selectedDate));
  }

  addAppointment(appointment: Appointment): void {
    this.store.dispatch(calendarActions.add({appointment}))
  }

  moveAppointment(id: string, distanceY: number): void {
    this.store.dispatch(calendarActions.move({id, distanceY}));
  }

  deleteAppointment(id: string): void {
    this.store.dispatch(calendarActions.delete({id}));
  }
}
