import { Injectable } from '@angular/core';
import { DateTime, Duration, Interval } from 'luxon';
import { BehaviorSubject, Observable, distinctUntilChanged, map, tap, timer } from 'rxjs';
import { GanttResizeState } from './interfaces/gantt-state';

@Injectable({
  providedIn: 'root',
})
export class GanttService {
  // Gantt vars
  private _startDate!: Date;
  private _endDate!: Date;
  private _zoom: number = 1;
  private _currDate = DateTime.now();
  private _playheadPos = 0;

  private currTimeSubj: BehaviorSubject<DateTime> = new BehaviorSubject(
    this._currDate
  );
  public currentTime$: Observable<DateTime> = this.currTimeSubj.asObservable();

  public timeInterval$ = timer(0, 1000).pipe(
    tap((_) => {
      const currDate = DateTime.now();
      const diffMinutes = Interval.fromDateTimes(
        this.chartStartDate,
        currDate
      ).toDuration('minutes').minutes;

      this._playheadPos = Math.max(0, 150 + Math.floor(diffMinutes || 0) * this.pxPerMinute);
      this.currTimeSubj.next(currDate);
    })
  );

  // Gantt State
  private _resizeState: GanttResizeState = {
    left: 0,
    right: 0,
    width: 0,
    visibleWidth: 0,
    offsetLeft: 0,
  };

  // Gantt Subject
  private resizeStateSubj$: BehaviorSubject<GanttResizeState> = new BehaviorSubject(
    this._resizeState
  );
  public resizeState$: Observable<GanttResizeState> =
    this.resizeStateSubj$.asObservable();

  // State getter
  get resizeState() {
    return this.resizeStateSubj$.getValue();
  }
  // Update the state
  public updateState(_state: Partial<GanttResizeState>) {
    this.resizeStateSubj$.next(
      (this._resizeState = { ...this._resizeState, ..._state })
    );
  }

  public select<K>(mapFn: (state: GanttResizeState) => K): Observable<K> {
    return this.resizeState$.pipe(
      map((state: GanttResizeState) => mapFn(state)),
      distinctUntilChanged()
    )
  }
  
  constructor() {
    this.timeInterval$.subscribe();
  }

  /**
   * The playhead position (in pixels)
   */
  get playheadPos() {
    return this._playheadPos;
  }

  /**
   * Chart start/end date (set when passed in as Input from the gantt component)
   */
  set startDate(_date: Date) {
    this._startDate = _date;
  }

  get startDate() {
    return this._startDate;
  }

  set endDate(_date: Date) {
    this._endDate = _date;
  }

  /**
   * The End Date.  Defaults to a 7 day duration if not passed in as input
   */
  get endDate() {
    return (
      this._endDate || DateTime.fromJSDate(this.startDate).plus({ days: 7 })
    );
  }

  /**
   * Add buffer time so it's not too butt up at the start
   */
  get chartStartDate() {
    return DateTime.fromJSDate(this.startDate)
      .startOf('hour')
      .minus({ hours: 1 });
  }

  /**
   * Chart's zoom level
   */
  set zoom(_zoom: number) {
    this._zoom = _zoom;
  }

  get zoom() {
    return this._zoom;
  }

  /**
   * the chart duration
   */
  get duration(): Duration {
    const start = DateTime.fromJSDate(this.startDate);
    const end = DateTime.fromJSDate(this.endDate);
    return end.diff(start);
  }

  /**
   * Set the width of the chart
   */
  get width(): number {
    return this.durationHours * this.zoomFactor * 2;
  }

  get durationHours(): number {
    return this.duration.as('hours');
  }

  /**
   *
   * To calculate the pixel per minute:
   *
   * ```
   * (width of 30 min duration) / 30
   * ```
   */
  get pxPerMinute(): number {
    return this.zoomFactor / 30;
  }

  /**
   * This is the slope-intercept function for
   * 
   *  ---------------------
   * |    x   |     y      |
   *  ---------------------
   * |  100%  |  minWidth  | 
   *  ---------------------
   * |   0%   |    200     |
   *  ---------------------
   * 
   * where x is the zoom level and y is the width of a half hour interval (in pixels)
   */
  get zoomFactor(): number {
    let { visibleWidth } = this.resizeState;
    let minWidth = 200 - (visibleWidth / this.durationHours / 2);
    let zoomFactor = (((minWidth ) / -100) * (this.zoom * 100)) + 200;
    return zoomFactor;
  }
}
