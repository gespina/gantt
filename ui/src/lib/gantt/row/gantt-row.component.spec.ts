import { TestBed } from '@angular/core/testing';
import { CstoneGanttRowComponent } from './gantt-row.component';
import { GanttService } from '../gantt.service';
import { MockGanttService } from '../test/mock-service';
import { mockData } from "../test/mock-data";

describe('CstoneGanttRowComponent', () => {
  let component: CstoneGanttRowComponent<any>;
  let service: GanttService;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [CstoneGanttRowComponent, {provide: GanttService, useClass: MockGanttService}]
    }).compileComponents();

    component = TestBed.inject(CstoneGanttRowComponent);
    service = TestBed.inject(GanttService);
    component.data = mockData;
    component.label = 'Test Label';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have data', () => {
    expect(component.data).toBeDefined();
    expect(component.label).toBeDefined();
  });

  it('should have row-width > 0', () => {
    expect(component.width).toBeGreaterThan(0);
  });

  it('should have played style defined', () => {
    expect(component.played).toBeDefined();
  });
});
