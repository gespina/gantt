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
};


const diffMinutes = (eventStart: Date, eventEnd: Date) =>
  Interval.fromDateTimes(
    DateTime.fromJSDate(eventStart),
    DateTime.fromJSDate(eventEnd)
  ).toDuration('minutes').minutes;

@Component({
  selector: 'cstone-gantt-event',
  standalone: true,
  imports: [CommonModule, AstroComponentsModule],
  templateUrl: './gantt-event.component.html',
  styleUrls: ['./gantt-event.component.scss'],
})
export class CstoneGanttEventComponent<T extends EventType> implements OnInit {
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

  get icon() {
    const { state } = this.event;
    return Icon[state].icon;
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

  @HostBinding('style.--event-width.px')
  get eventWidth() {
    return this.eventDuration * this.service.pxPerMinute;
  }
  
  @HostBinding('style.left.px')
  get eventStart() {
    return 150 + (this.minutesFromChartStart * this.service.pxPerMinute);
  }
  constructor(public service: GanttService) {}

  ngOnInit(): void {
  }
}
