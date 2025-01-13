import { EventType } from '../interfaces/event.type';
import { DateTime } from 'luxon';

let eventStart = DateTime.now().plus({ hours: 3 });
let eventEnd = eventStart.plus({ hours: 2 });

export const mockData: Array<EventType> = [
  {
    labelLeft: 'ABC',
    eventStart: eventStart.toJSDate(),
    eventEnd: eventEnd.toJSDate(),
    state: 'Warning',
  },
];
