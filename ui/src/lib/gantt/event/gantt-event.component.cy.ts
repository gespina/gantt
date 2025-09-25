import { TestBed } from '@angular/core/testing';
import { SeyGanttEventComponent } from './gantt-event.component';

describe(SeyGanttEventComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(SeyGanttEventComponent, {
      add: {
        imports: [],
        providers: [],
      },
    });
  });

  it('renders', () => {
    cy.mount(SeyGanttEventComponent);
  });
});
