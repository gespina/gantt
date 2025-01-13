import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  Pipe,
  PipeTransform,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttService } from '../gantt.service';
import { DateTime } from 'luxon';
import { FormsModule } from '@angular/forms';
import { AstroComponentsModule } from "@astrouxds/angular";
@Pipe({
  standalone: true,
  name: 'dateFormat',
})
export class TickMarkPipe implements PipeTransform {
  transform(value: DateTime, ...args: any[]) {
    const [fmt, tz] = args;
    if (!fmt) {
      return value.toLocaleString();
    }
    if (!tz) {
      return value.toFormat(fmt);
    }
    // console.log({tz, fmt})
    return value.setZone(tz).toFormat(fmt);
  }
}

/**
 * Available timezones (add more if needed)
 */
export type TimeZone = "UTC" | "America/Los_Angeles";

@Component({
  selector: 'cstone-gantt-ruler',
  standalone: true,
  imports: [
    CommonModule,
    TickMarkPipe,
    FormsModule,
    AstroComponentsModule
  ],
  templateUrl: './gantt-ruler.component.html',
  styleUrls: ['./gantt-ruler.component.scss']
})
export class CstoneGanttRulerComponent {

  @ViewChild('rulerContainer', { static: false })
  rulerContainer: ElementRef | undefined;

  @Input('timezone')
  timezone: TimeZone = "America/Los_Angeles";

  /**
   * Date labels that go with the tick marks
   */
  get tickHours(): DateTime[] {
    let tickHours = [...Array(this.service.durationHours).keys()].map((idx) =>
      this.service.chartStartDate.plus({ hours: idx }).startOf('hour')
    );
    return tickHours;
  }

  /**
   * Date format specs as defined in Luxon docs
   */
  get dateFormat() {
    return this.service.zoom < .9 ? 'ccc DD' : 'LL/dd';
  }

  // @HostBinding('style.--gantt-offset-left.px')
  // get ganttOffsetLeft() {
  //   console.log({scrollLeft: this.rulerContainer?.nativeElement.scrollLeft})
  //   return this.rulerContainer?.nativeElement.scrollLeft;
  // }

  /**
   * defines space between ruler ticks
   */
  @HostBinding('style.--ruler-space')
  get rulerSpace() {
    return this.service.zoomFactor;
  }

  @HostBinding('style.--num-ticks')
  get numHours() {
    return this.tickHours.length * 2;
  }

  get showHours() {
    return this.service.zoom < .9;
  }

  public showDate(dt: DateTime) {
    return dt.get('hour') === 0;
  }

  constructor(protected service: GanttService) {}
}


