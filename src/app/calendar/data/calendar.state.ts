import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Appointment } from '../models/appointment.model';
import { calendarActions } from './calendar.actions';

export interface CalendarState {
  appointments: Appointment[];
  invalidTime: boolean;
}

const initialState: CalendarState = {
  appointments: [
    {
      id: 'id1730500547643',
      startTime: '09:00',
      endTime: '11:30',
      details: 'this course is improving your knowledge in Open CV',
      date: new Date(),
      title: 'computer vision course',
      duration: 90,
      startPosition: 540,
    },
    {
      id: 'id17305005431643',
      startTime: '16:45',
      endTime: '18:25',
      details: 'Hashem Pourallahverdi Frontend Developer',
      date: new Date(),
      title: 'HR Interview',
      duration: 100,
      startPosition: 1005,
    },
  ],
  invalidTime: false,
};

const calendarReducer = createReducer(
  initialState,
  on(calendarActions.add, (state, {appointment}) => {
    const startHour = +appointment.startTime.split(':')[0];
    const startMin = +appointment.startTime.split(':')[1];
    const endHour = +appointment.endTime.split(':')[0];
    const endMin = +appointment.endTime.split(':')[1];
    const duration = (endHour - startHour) * 60 + (Math.abs(startMin - endMin) + 1);
    if (duration < 0) {
      return {
        ...state,
        invalidTime: true,
      }
    }
    return {
      ...state,
      appointments: [...state.appointments, {
        ...appointment,
        duration,
        startPosition: (startHour * 60 + startMin),
      }]
    }
  }),
  on(calendarActions.delete, (state, {id}) => ({
    ...state,
    appointments: state.appointments.filter(app => app.id !== id)
  })),
  on(calendarActions.move, (state, {id, distanceY}) => {
    let newAppointment = {...state.appointments.find(app => app.id === id)};
    let newStartPosition = newAppointment.startPosition + distanceY;
    newStartPosition = newStartPosition < 0 ? 0 : newStartPosition;
    const startHour = Math.floor(newStartPosition / 60);
    const startMin = newStartPosition % 60;
    const endHour = startHour + Math.floor(newAppointment.duration / 60);
    const endMin = startMin + newAppointment.duration % 60;
    newAppointment.startTime = (startHour > 9 ? startHour : '0' + startHour) + ':' + (startMin > 9 ? startMin : '0' + startMin);
    newAppointment.endTime = (endHour > 9 ? endHour : '0' + endHour) + ':' + (endMin > 9 ? endMin : '0' + endMin);
    newAppointment.startPosition = newStartPosition;
    return {
      ...state,
      appointments: [...state.appointments.filter(app => app.id !== id), newAppointment],
    }
  }),
  on(calendarActions.resetInvalidTime, (state) => ({
    ...state,
    invalidTime: false,
  })),
);

export const calenderFeature = createFeature({
  name: 'calender',
  reducer: calendarReducer,
  extraSelectors: (baseSelectors) => ({
    selectDateAppointments: (selectedDate: Date) => createSelector(baseSelectors.selectAppointments, (appointment) => {
      return appointment.filter(app =>
        app.date.getDate() === selectedDate.getDate() &&
        app.date.getMonth() === selectedDate.getMonth() &&
        app.date.getFullYear() === selectedDate.getFullYear()).reduce((acc, app) => {
        acc[app.startTime] = app;
        return acc;
      }, {});
    }),
  })
})
