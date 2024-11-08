import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Appointment, AppointmentStatus } from '../../models/appointment.model';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CalendarFacade } from '../../data/calendar.facade';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-add-appointment',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule, MatDialogActions,
    MatButton, MatDialogContent, MatIcon, MatDialogTitle, NgClass, RouterLink],
  templateUrl: './add-appointment.component.html',
})
export class AddAppointmentComponent {
  appointmentForm: FormGroup;
  isDialog: boolean;
  adding = new BehaviorSubject(false);

  constructor(
    private fb: FormBuilder,
    @Optional() public dialogRef: MatDialogRef<AddAppointmentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Appointment,
    @Optional() private calendarFacade: CalendarFacade,
    @Optional() private router: Router,
  ) {
    this.isDialog = !!data;
    this.appointmentForm = this.fb.group({
      title: [data?.title || '', Validators.required],
      date: [data?.date || '', Validators.required],
      startTime: [data?.startTime || '', Validators.required],
      endTime: [data?.endTime || '', Validators.required],
      details: [data?.details || '']
    });
    this.calendarFacade.appointmentStatus
      .pipe(
        takeUntilDestroyed(),
      )
      .subscribe((status) => {
        if (status === AppointmentStatus.Added && !this.isDialog) {
          this.router.navigate(['/calendar']);
        }
      })
  }

  onSave(): void {
    if (this.isDialog) {
      this.dialogRef.close(this.appointmentForm.value);
    } else {
      this.adding.next(true);
      this.calendarFacade.addAppointment({
        id: 'id' + (new Date()).getTime(),
        ...this.appointmentForm.value,
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
