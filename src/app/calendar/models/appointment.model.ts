export interface Appointment {
  id: string;
  title: string;
  details: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration?: number;
  startPosition?: number;
}

export interface DayAppointments {
  [startTime: string]: Appointment;
}

export enum AppointmentStatus {
  Added = 'added',
  Adding = 'adding',
  NotTriggered = 'not-triggered',
}
