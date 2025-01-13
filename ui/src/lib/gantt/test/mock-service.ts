import { DateTime } from "luxon";
import { of } from "rxjs";

export class MockGanttService {
    startDate = DateTime.now();
    chartStartDate = this.startDate.minus({hours: 1}).startOf('hour');
    chartEndDate = this.chartStartDate.plus({days: 7});
    durationHours = this.chartEndDate.diff(this.chartStartDate).as('hours');
    zoom = 1;
    playheadPos = 200;
    get zoomFactor() {
      return 20 * (8 - this.zoom);
    }
    get width() {
      return Math.ceil(this.durationHours) * this.zoomFactor;
    }
    get pxPerMinute() {
        return this.zoomFactor / 60;
    }

    currentTime$ = of(DateTime.now());
  }
  