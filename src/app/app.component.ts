import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { SeyGanttComponent, SeyGanttRowComponent, SeyGanttRulerComponent, TimeZone } from 'ui/src';
import { DateTime } from 'luxon';
import { KeyValuePipe, NgFor } from '@angular/common';
import { AstroComponentsModule } from "@astrouxds/angular";

@Component({
  standalone: true,
  imports: [
    NxWelcomeComponent,
    RouterModule,
    SeyGanttComponent,
    SeyGanttRowComponent,
    SeyGanttRulerComponent,
    KeyValuePipe,
    NgFor,
    AstroComponentsModule
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Seychelles Gantt Component Test';
  testStartDate = DateTime.now();
  startDate = this.testStartDate.toJSDate();
  endDate = this.testStartDate.plus({ days: 3 }).toJSDate();

  public timezone: TimeZone = "America/Los_Angeles";

  public data = {
    'Region 1': [
      {
        labelLeft: 'Event ID: ABC',
        labelRight: 'REQUESTED',
        eventStart: this.testStartDate.plus({ minutes: 20 }).toJSDate(),
        eventEnd: this.testStartDate.plus({ hours: 2, minutes: 30 }).toJSDate(),
        state: 'Warning',
      },
      {
        labelLeft: 'EventID: XYZ',
        labelRight: 'CANCELLED',
        eventStart: this.testStartDate.plus({ hours: 5, minutes: 20 }).toJSDate(),
        eventEnd: this.testStartDate.plus({ hours: 6, minutes: 20 }).toJSDate(),
        state: 'Alarm',
      },
    ],
    'Region 2': [
      {
        labelLeft: 'Event ID: DEF',
        labelRight: 'VALIDATED',
        eventStart: this.testStartDate.plus({ hours: 2, minutes: 20 }).toJSDate(),
        eventEnd: this.testStartDate.plus({ hours: 3, minutes: 30 }).toJSDate(),
        state: 'Normal',
      },
      {

        labelLeft: 'Event ID: IJK',
        labelRight: 'EXECUTING',
        eventStart: this.testStartDate.plus({ hours: 7, minutes: 20 }).toJSDate(),
        eventEnd: this.testStartDate.plus({ hours: 8, minutes: 30 }).toJSDate(),
        state: 'Alarm',
      },
      {
        labelLeft: 'Event ID: LMNOP',
        labelRight: 'DOWNLINKED',
        eventStart: this.testStartDate.minus({ hours: 0, minutes: 10 }).toJSDate(),
        eventEnd: this.testStartDate.plus({ hours: 1, minutes: 30 }).toJSDate(),
        state: 'Warning',
      },
    ],
    'Region 3': [
      {
        labelLeft: 'Event ID: GGG',
        labelRight: 'PROCESSING',
        eventStart: this.testStartDate.plus({ hours: 1, minutes: 20 }).toJSDate(),
        eventEnd: this.testStartDate.plus({ hours: 2, minutes: 10 }).toJSDate(),
        state: 'Normal',
      },
      {
        labelLeft: 'Event ID: MMM',
        labelRight: 'COMPLETE',
        eventStart: this.testStartDate.plus({ hours: 9, minutes: 40 }).toJSDate(),
        eventEnd: this.testStartDate.plus({ hours: 10, minutes: 30 }).toJSDate(),
        state: 'Alarm',
      },
      {
        labelLeft: 'Event ID: WEE',
        eventStart: this.testStartDate.minus({ minutes: 15 }).toJSDate(),
        eventEnd: this.testStartDate.plus({ minutes: 30 }).toJSDate(),
        state: 'Alarm',
      },
    ],
  };

  constructor() {}
}
