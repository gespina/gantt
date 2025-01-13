import { Component, ContentChild, HostBinding, Input, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttService } from '../gantt.service';
import { CstoneGanttEventComponent } from '../event/gantt-event.component';
import { EventType } from '../interfaces/event.type';

@Component({
  selector: 'cstone-gantt-row',
  standalone: true,
  imports: [CommonModule, CstoneGanttEventComponent],
  templateUrl: './gantt-row.component.html',
  styleUrls: ['./gantt-row.component.scss'],
})
export class CstoneGanttRowComponent<T extends EventType> implements OnInit{
  /**
   * Row data
   */
  @Input()
  public data!: Array<T>;

  /**
   * Row label
   */
  @Input()
  public label!: string;

  @ContentChild('label') labelRef: TemplateRef<unknown> | undefined;
  @ContentChild('trackItem') trackItemRef: TemplateRef<unknown> | undefined;

  @HostBinding('style.--row-width.px')
  get width() {
    return this.service.width;
  }

  get played() {
    return {
      position: 'absolute',
      'width.px': Math.max(0, this.service.playheadPos),
      'height.px': '42',
      left: 0,
      backgroundColor: 'black',
      opacity: '0.4',
      zIndex: 2,
      pointerEvents: 'none'
    }
  }

  constructor(public service: GanttService) {}

  ngOnInit(): void {
      
  }
}
