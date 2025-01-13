import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CstoneGanttEventComponent } from './gantt-event.component';
import { GanttService } from '../gantt.service';
import { MockGanttService } from '../test/mock-service';
import { mockData } from '../test/mock-data';
import { By } from '@angular/platform-browser';
import { TickMarkPipe } from '../ruler/gantt-ruler.component';
import { DateTime } from 'luxon';

describe('CstoneGanttEventComponent', () => {
  let component: CstoneGanttEventComponent<any>;
  let fixture: ComponentFixture<CstoneGanttEventComponent<any>>;
  let service: GanttService;
  let pipe: TickMarkPipe;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CstoneGanttEventComponent],
      providers: [CstoneGanttEventComponent,  {provide: GanttService, useClass: MockGanttService}]
    }).compileComponents();

    fixture = TestBed.createComponent(CstoneGanttEventComponent);
    fixture.componentInstance.event = mockData[0];
    fixture.detectChanges();
    component = TestBed.inject(CstoneGanttEventComponent);
    service = TestBed.inject(GanttService);
    component.event = mockData[0];

    pipe = new TickMarkPipe();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an event', () => {
    expect(component.event).toBeDefined();
  });

  it('should have an "warning" icon', () => {
    expect(component.icon).toBe('warning');
  });

  it('should have a "iconWarning" iconClass', () => {
    expect(component.iconClass).toBe('iconWarning');
  });

  it('should have style.left > 0', () => {
    expect(fixture.nativeElement.style.left).toBeDefined();
    expect(fixture.nativeElement.style.left).not.toBe('0px');
    expect(fixture.nativeElement.style.left).toMatch(/(?!0)\d+px/);
  });

  it('should have style.width > 0', () => {
    expect(fixture.nativeElement.style._values['--event-width']).toBeDefined();
    expect(fixture.nativeElement.style._values['--event-width']).not.toBe('0px');
    expect(fixture.nativeElement.style._values['--event-width']).toMatch(/(?!0)\d+px/);
  });
  it('should have class warning', () => {
    expect(fixture.nativeElement.classList).toContain('warning');
  });
  
  it('should have class alarm', () => {
    let data = {...mockData[0], state: 'Alarm'};
    fixture.componentInstance.event = data;
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('alarm');
  });
  
  it('should have class normal', () => {
    let data = {...mockData[0], state: 'Normal'};
    fixture.componentInstance.event = data;
    fixture.detectChanges();
    expect(fixture.nativeElement.classList).toContain('normal');
  });

  it('transforms date to proper format', () => {
    let _date = DateTime.local(2024, 7, 6, 10, 30);
    expect(pipe.transform(_date)).toBe(_date.toLocaleString());
    expect(pipe.transform(_date, 'ccc DD')).toBe('Sat Jul 6, 2024');
    expect(pipe.transform(_date, 'LL/dd')).toBe('07/06');
  })
});
