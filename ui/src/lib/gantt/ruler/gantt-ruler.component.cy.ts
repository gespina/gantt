import { TestBed } from '@angular/core/testing';
import { SeyGanttRulerComponent } from './gantt-ruler.component';

describe(SeyGanttRulerComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(SeyGanttRulerComponent, {
      add: {
        imports: [],
        providers: [],
      },
    });
  });

  it('renders', () => {
    cy.mount(SeyGanttRulerComponent, {
      componentProperties: {
        timezone: 'America/Los_Angeles',
      },
    });
  });
});
