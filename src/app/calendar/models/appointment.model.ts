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
