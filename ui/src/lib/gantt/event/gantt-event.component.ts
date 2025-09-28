import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttService } from '../gantt.service';
import { DateTime, Interval } from 'luxon';
import { AstroComponentsModule } from '@astrouxds/angular';
import { EventType } from '../interfaces/event.type';

const Icon: any = {
  Normal: { icon: undefined, iconClass: undefined },
  Warning: { icon: 'warning', iconClass: 'iconWarning' },
  Alarm: { icon: 'error', iconClass: 'iconAlarm' },
  VALIDATED: { icon: 'check-box', iconClass: undefined},
  REQUESTED: { icon: 'directions', iconClass: undefined},
  CANCELLED: { icon: 'cancel', iconClass: undefined},
  SCHEDULED: { icon: 'insert-invitation', iconClass: undefined},
  EXECUTING: { icon: 'directions-run', iconClass: undefined},
  DOWNLINKED: { icon: 'vertical-align-bottom', iconClass: undefined},
  PROCESSING: { icon: 'autorenew', iconClass: undefined},
  COMPLETE: { icon: 'check-circle', iconClass: undefined},
};

const StateBg: any = {
  Normal: 'normal',
  Warning: 'warning',
  Alarm: 'alarm'
}

const diffMinutes = (eventStart: Date, eventEnd: Date) =>
  Interval.fromDateTimes(
    DateTime.fromJSDate(eventStart),
    DateTime.fromJSDate(eventEnd)
  ).toDuration('minutes').minutes;

@Component({
  selector: 'sey-gantt-event',
  standalone: true,
  imports: [CommonModule, AstroComponentsModule],
  templateUrl: './gantt-event.component.html',
  styleUrls: ['./gantt-event.component.scss'],
})
export class SeyGanttEventComponent<T extends EventType> implements OnInit {
  @Input()
  public event!: T | any;

  @Input()
  public templateRef?: TemplateRef<any>;

  @HostBinding('class')
  get classes(){
    if(!this.event){
      return null;
    }
    return {
      normal: this.event.state === 'Normal',
      warning: this.event.state === 'Warning',
      alarm: this.event.state === 'Alarm'
    }
  }

  get topRight() {
    return {
      "normal-bg": this.event.state === 'Normal',
      "warning-bg": this.event.state === 'Warning',
      "alarm-bg": this.event.state === 'Alarm'
    }
  }
 
  get icon() {
    const { labelRight } = this.event;
    return Icon[labelRight].icon;
  }

  get iconClass() {
    const { state } = this.event;
    return Icon[state].iconClass;
  }

  get eventDuration() {
    if(!this.event){
      return 0;
    }
    const { eventStart, eventEnd } = this.event;
    return diffMinutes(eventStart, eventEnd);
  }

  get minutesFromChartStart() {
    if(!this.event){
      return 0;
    }
    const { eventStart } = this.event;
    return diffMinutes(
      this.service.chartStartDate.toJSDate(),
      eventStart
    );
  }

  get isInRange() {
    const eventStartDate = DateTime.fromJSDate(this.event.eventStart);
    const chartStart = DateTime.fromJSDate(this.service.startDate);
    const eventEndDate = DateTime.fromJSDate(this.event.eventEnd);
    const chartEnd = DateTime.fromJSDate(this.service.endDate);
    return eventStartDate >= chartStart && eventEndDate <= chartEnd;
  }

  @HostBinding('style.--event-width.px')
  get eventWidth() {
    return this.eventDuration * this.service.pxPerMinute;
  }
  
  @HostBinding('style.left.px')
  get eventStart() {
    return 150 + (this.minutesFromChartStart * this.service.pxPerMinute);
  }
 
  showDates() {
    return this.eventWidth > 100;
  }

  constructor(public service: GanttService) {}

  ngOnInit(): void {
  }
}
