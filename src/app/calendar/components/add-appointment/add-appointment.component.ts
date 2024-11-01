import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Appointment } from '../../models/appointment.model';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatDatepicker, MatDatepickerInput, MatDatepickerModule, MatDatepickerToggle, MatDatepickerToggleIcon } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';
import { MatSidenav } from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-add-appointment',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule, MatDialogActions, MatButton, MatDialogContent, MatIcon, MatDialogTitle],
  templateUrl: './add-appointment.component.html',
})
export class AddAppointmentComponent {
  appointmentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddAppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Appointment
  ) {
    this.appointmentForm = this.fb.group({
      title: [data?.title || '', Validators.required],
      date: [data?.date || '', Validators.required],
      startTime: [data?.startTime || '', Validators.required],
      endTime: [data?.endTime || '', Validators.required],
      details: [data?.details || '']
    });
  }

  onSave(): void {
    this.dialogRef.close(this.appointmentForm.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
