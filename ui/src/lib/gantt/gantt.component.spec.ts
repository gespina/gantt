import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CstoneGanttComponent } from './gantt.component';
import { GanttService } from './gantt.service';
import { MockGanttService } from './test/mock-service';
import { DateTime } from 'luxon';

describe('CstoneGanttComponent', () => {
  let component: CstoneGanttComponent;
  let fixture: ComponentFixture<CstoneGanttComponent>;
  let service: GanttService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CstoneGanttComponent],
      providers: [CstoneGanttComponent, {provide: GanttService, useClass: MockGanttService}]
    }).compileComponents();

    fixture = TestBed.createComponent(CstoneGanttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(GanttService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sets service.startDate, endDate, and zoom', () => {
    const dt = DateTime.local(2024, 7, 6, 22, 30)
    const endDt = dt.plus({hours: 3});
    component.start = dt.toJSDate();
    component.end = endDt.toJSDate();
    component.zoom = 2;
    expect(service.startDate.toISOString()).toBe(dt.toJSDate().toISOString());
    expect(service.endDate.toISOString()).toBe(endDt.toJSDate().toISOString());
    expect(service.zoom).toBe(2);
  });

  it('returns playhead height', () => {
    const ganttContainer = {
      nativeElement: {
        offsetHeight: 100
      }
    };
    component.ganttContainer = ganttContainer;
    expect(component.playheadHeight).toBe(100);
  });
  
});
