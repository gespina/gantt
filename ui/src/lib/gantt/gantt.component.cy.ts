import { TestBed } from '@angular/core/testing';
import { SeyGanttComponent } from './gantt.component';

describe(SeyGanttComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(SeyGanttComponent, {
      add: {
        imports: [],
        providers: [],
      },
    });
  });

  it('renders', () => {
    cy.mount(SeyGanttComponent, {
      componentProperties: {
        start: '',
        end: '',
        zoom: '',
      },
    });
  });
});
