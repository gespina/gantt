import { TestBed, discardPeriodicTasks, fakeAsync } from '@angular/core/testing';

import { GanttService } from './gantt.service';
import { DateTime, Duration } from 'luxon';
import { tap } from 'rxjs';


describe('GanttService', () => {
  let service: GanttService;
  let startDate = DateTime.now();
  let endDate = startDate.plus({hours: 2});

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GanttService);
    service.startDate = startDate.toJSDate();
    expect(service.endDate).toBeDefined();
    service.endDate = endDate.toJSDate();
    service.zoom = 2;
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('call timer interval', fakeAsync (() => {
    jest.useFakeTimers();
    const fn = jest.fn(() => 1);
    const tick = (ms = 0) => jest.advanceTimersByTime(ms);
    const stream$ = service.timeInterval$.pipe(tap(fn));
    stream$.subscribe();

    tick(2000);
    expect(fn.mock.calls.length).toEqual(3);
    expect(service.playheadPos).toBeGreaterThan(0);
  }));

  it('should have start/end dates defined', () => {
    expect(service.startDate).toBeDefined();
    expect(service.endDate).toBeDefined();
    expect(service.chartStartDate).toBeDefined();
    expect(service.zoom).toBe(2);
  });

  it('should return duration', () => {
    expect(service.duration.as('seconds')).toBe(Duration.fromObject({hours: 2}).as('seconds'));
    expect(service.durationHours).toBe(2);
  });

  it('#width should be defined', () => {
    expect(service.width).toBeGreaterThan(0);
  });

  it('#pxPerMinute should be > 0', () => {
    expect(service.pxPerMinute).toBeGreaterThan(0);
  });

  it('#zoomFactor should be > 0', () => {
    expect(service.zoomFactor).toBe(120);
  })
});
