import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { CstoneGanttComponent, CstoneGanttRowComponent, CstoneGanttRulerComponent, TimeZone } from 'ui/src';
import { DateTime } from 'luxon';
import { KeyValuePipe, NgFor } from '@angular/common';
import { AstroComponentsModule } from "@astrouxds/angular";

@Component({
  standalone: true,
  imports: [
    NxWelcomeComponent,
    RouterModule,
    CstoneGanttComponent,
    CstoneGanttRowComponent,
    CstoneGanttRulerComponent,
    KeyValuePipe,
    NgFor,
    AstroComponentsModule
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'CStone Gantt Component Test';
  startDate = DateTime.now().minus({ days: 14 }).toJSDate();
  endDate = DateTime.fromJSDate(this.startDate).plus({ days: 3 }).toJSDate();

  public timezone: TimeZone = "America/Los_Angeles";

  public data = {
    'Region 1': [
      {
        labelLeft: 'ABC',
        labelRight: 'DDD',
        eventStart: DateTime.now().minus({ minutes: 20 }).toJSDate(),
        eventEnd: DateTime.now().plus({ hours: 2, minutes: 30 }).toJSDate(),
        state: 'Warning',
      },
      {
        labelLeft: 'XYZ',
        eventStart: DateTime.now().plus({ hours: 5, minutes: 20 }).toJSDate(),
        eventEnd: DateTime.now().plus({ hours: 6, minutes: 20 }).toJSDate(),
        state: 'Alarm',
      },
    ],
    'Region 2': [
      {
        labelLeft: 'DEF',
        eventStart: DateTime.now().plus({ hours: 2, minutes: 20 }).toJSDate(),
        eventEnd: DateTime.now().plus({ hours: 3, minutes: 30 }).toJSDate(),
        state: 'Normal',
      },
      {

        labelLeft: 'IJK',
        eventStart: DateTime.now().plus({ hours: 7, minutes: 20 }).toJSDate(),
        eventEnd: DateTime.now().plus({ hours: 8, minutes: 30 }).toJSDate(),
        state: 'Alarm',
      },
      {
        labelLeft: 'LMNOP',
        eventStart: DateTime.now().minus({ hours: 0, minutes: 10 }).toJSDate(),
        eventEnd: DateTime.now().plus({ hours: 1, minutes: 30 }).toJSDate(),
        state: 'Warning',
      },
    ],
    'Region 3': [
      {
        labelLeft: 'GGG',
        eventStart: DateTime.now().plus({ hours: 1, minutes: 20 }).toJSDate(),
        eventEnd: DateTime.now().plus({ hours: 2, minutes: 10 }).toJSDate(),
        state: 'Normal',
      },
      {
        labelLeft: 'MMM',
        eventStart: DateTime.now().plus({ hours: 9, minutes: 40 }).toJSDate(),
        eventEnd: DateTime.now().plus({ hours: 10, minutes: 30 }).toJSDate(),
        state: 'Alarm',
      },
      {
        labelLeft: 'WEE',
        eventStart: DateTime.now().minus({ minutes: 15 }).toJSDate(),
        eventEnd: DateTime.now().plus({ minutes: 30 }).toJSDate(),
        state: 'Alarm',
      },
    ],
  };

  constructor() {}
}
