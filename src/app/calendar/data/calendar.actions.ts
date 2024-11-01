import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Appointment } from '../models/appointment.model';


export const calendarActions = createActionGroup({
  source: 'Calendar calendar',
  events: {
    add: props<{ appointment: Appointment }>(),
    delete: props<{ id: string }>(),
    move: props<{ id: string, distanceY: number }>(),
    resetInvalidTime: emptyProps(),
    noOp: emptyProps(),
  },
})
