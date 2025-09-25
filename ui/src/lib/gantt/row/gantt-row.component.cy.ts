import { TestBed } from '@angular/core/testing';
import { SeyGanttRowComponent } from './gantt-row.component';

describe(SeyGanttRowComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(SeyGanttRowComponent, {
      add: {
        imports: [],
        providers: [],
      },
    });
  });

  it('renders', () => {
    cy.mount(SeyGanttRowComponent, {
      componentProperties: {
        label: '',
      },
    });
  });
});
