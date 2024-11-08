import { Component, inject, Signal } from '@angular/core';
import { Appointment, DayAppointments } from '../../models/appointment.model';
import { CalendarFacade } from '../../data/calendar.facade';
import { CdkDrag, CdkDragEnd, CdkDropList } from '@angular/cdk/drag-drop';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { AsyncPipe, DatePipe, KeyValuePipe } from '@angular/common';
import { AddAppointmentComponent } from '../add-appointment/add-appointment.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatCalendar } from '@angular/material/datepicker';
import { MatLabel } from '@angular/material/form-field';
import { TranslateYPipe } from '../../pipes/translate-y.pipe';
import { CalculateHeightPipe } from '../../pipes/calculate-height.pipe';
import { BehaviorSubject, distinctUntilChanged, shareReplay } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  templateUrl: './calendar-view.component.html',
  imports: [
    MatToolbar,
    CdkDropList,
    MatIcon,
    MatIconButton,
    DatePipe,
    CdkDrag,
    AddAppointmentComponent,
    MatButton,
    MatSidenavContainer,
    MatCalendar,
    MatSidenav,
    MatSidenavContent,
    MatLabel,
    KeyValuePipe,
    TranslateYPipe,
    CalculateHeightPipe,
    AsyncPipe,
    RouterLink,
  ],
})
export class CalendarViewComponent {
  private calendarFacade = inject(CalendarFacade);
  private dialogService = inject(MatDialog);
  dayAppointments: Signal<DayAppointments>;
  selectedDate = new BehaviorSubject(new Date());
  hours = Array.from({length: 24}, (_, i) => (i > 9 ? i : '0' + i) + ':00');


  constructor() {
    this.selectedDate
      .pipe(
        distinctUntilChanged(),
        shareReplay({bufferSize: 1, refCount: true}),
        takeUntilDestroyed(),
      )
      .subscribe(selectedDate => {
      this.dayAppointments = this.calendarFacade.getDayAppointments(selectedDate);
    })
  }

  dragEnded(event: CdkDragEnd<Appointment>): void {
    this.calendarFacade.moveAppointment(event.source.data.id, event.distance.y);
    event.source.reset();
  }

  deleteAppointment($event: Event, id: string): void {
    $event.stopPropagation();
    $event.preventDefault();
    this.calendarFacade.deleteAppointment(id);
  }


  onDateSelected(date: Date) {
    this.selectedDate.next(date);
  }

  openAppointmentForm(appointmentData?: Partial<Appointment>) {
    const dialogRef = this.dialogService.open(AddAppointmentComponent, {
      width: '400px',
      data: appointmentData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.calendarFacade.addAppointment({
          id: 'id' + (new Date()).getTime(),
          ...result,
        })
      }
    });
  }
}
