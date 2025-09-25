/**
 * Using a type instead of interface in case EventType needs to be extended
 */
export type EventType = {
    labelLeft: string;
    labelRight?: string;
    eventStart: Date;
    eventEnd: Date;
    state: string;
    icon?: string;
  }
  