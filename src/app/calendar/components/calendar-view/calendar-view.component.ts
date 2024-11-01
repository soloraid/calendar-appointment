import { Component, inject, Signal } from '@angular/core';
import { Appointment, DayAppointments } from '../../models/appointment.model';
import { CalendarFacade } from '../../data/calendar.facade';
import { CdkDrag, CdkDragEnd, CdkDropList } from '@angular/cdk/drag-drop';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { DatePipe, KeyValuePipe } from '@angular/common';
import { AddAppointmentComponent } from '../add-appointment/add-appointment.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatCalendar } from '@angular/material/datepicker';
import { MatLabel } from '@angular/material/form-field';
import { TranslateYPipe } from '../../pipes/translate-y.pipe';
import { CalculateHeightPipe } from '../../pipes/calculate-height.pipe';

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
  ],
})
export class CalendarViewComponent {
  private calendarFacade = inject(CalendarFacade);
  private dialogService = inject(MatDialog);
  dayAppointments: Signal<DayAppointments>;
  selectedDate = new Date();
  hours = Array.from({length: 24}, (_, i) => (i > 9 ? i : '0' + i) + ':00');


  constructor() {
    this.dayAppointments = this.calendarFacade.getDayAppointments(this.selectedDate);
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
    this.selectedDate = date;
    this.dayAppointments = this.calendarFacade.getDayAppointments(this.selectedDate);
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
