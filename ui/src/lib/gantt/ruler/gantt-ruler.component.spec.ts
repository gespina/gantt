import { TestBed } from '@angular/core/testing';
import { CstoneGanttRulerComponent } from './gantt-ruler.component';
import { GanttService } from '../gantt.service';
import { DateTime } from 'luxon';
import { MockGanttService } from "../test/mock-service";

describe('CstoneGanttRulerComponent', () => {
  let component: CstoneGanttRulerComponent;
  let service: GanttService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CstoneGanttRulerComponent],
      providers: [CstoneGanttRulerComponent, {provide: GanttService, useClass: MockGanttService}]
    }).compileComponents();
    component = TestBed.inject(CstoneGanttRulerComponent);
    service = TestBed.inject(GanttService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have tickHours defined', () => {
    expect(component.tickHours).toBeDefined();
  });

  it('should handle dateFormat when zoom level changes', () => {
    expect(component.dateFormat).toBe('ccc DD');
    service.zoom = 4;
    expect(component.dateFormat).toBe('LL/dd');
  })

  it('should handle rulerSpace when zoom level changes', () => {
    expect(component.rulerSpace).toBe(70);
    service.zoom = 2;
    expect(component.rulerSpace).toBe(60);
  });

  it('should have numHours defined', () => {
    expect(component.numHours).toBeDefined();
  });

  it('should handle showing/hiding hours when zoom level changes', () => {
    expect(component.showHours()).toBeTruthy();
    service.zoom = 6;
    expect(component.showHours()).toBeFalsy();
  });

  it('should handle showing date label when time is 00:xx', () => {
    let dt = DateTime.local(2024, 7, 6, 22, 30);
    expect(component.showDate(dt)).toBeFalsy();
    dt = dt.startOf('day');
    expect(component.showDate(dt)).toBeTruthy();
  });

});
