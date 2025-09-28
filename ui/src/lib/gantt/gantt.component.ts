import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GanttService } from './gantt.service';
import { Observable, Subscription, combineLatest, map, tap } from 'rxjs';
import { ResizeDirective } from './directives/resize.directive';
import { IResize } from './interfaces/resize';

@Component({
  selector: 'sey-gantt',
  standalone: true,
  imports: [CommonModule, ResizeDirective],
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeyGanttComponent implements AfterViewInit {
  /**
   * Start date of the gantt chart.  Usually the earliest start date from the events data
   */
  @Input()
  set start(_start: Date) {
    this.service.startDate = _start;
  }
  /**
   * End date of the gantt chart.  Usually the latest start date from the events data
   */
  @Input()
  set end(_end: Date) {
    this.service.endDate = _end;
  }

  /**
   * Zoom level (if provided).  Defaults to 1
   */
  @Input()
  set zoom(_zoom: number) {
    this.service.zoom = _zoom;
  }

  /**
   * Position of the playhead in real-time
   */
  @HostBinding('style.--playhead-left.px')
  get playhead() {
    return this.service.playheadPos;
  }

  subs: Subscription = new Subscription();
  /**
   * Needed to get the height of the playhead
   */
  @ViewChild('mainContainer', { static: false })
  mainContainer: ElementRef | undefined;
  @ViewChild('ganttContainer', { static: false })
  ganttContainer: ElementRef | undefined;
  @ViewChild('resizer', { static: false })
  resizer: ElementRef | undefined;

  @ViewChild(ResizeDirective)
  resizeDirective!: ResizeDirective;

  windowWidth: number = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    // this.windowWidth = (event.target as Window).innerWidth;
    // console.log({"window resized": this.windowWidth, offsetWidth: this.mainContainer?.nativeElement.offsetWidth})

    // this.service.updateState({
      // width: this.mainContainer?.nativeElement.offsetWidth - 150,
      // visibleWidth: this.mainContainer?.nativeElement.offsetWidth - 150,
    // });
  }

  @HostBinding('style.--gantt-visible-width.px')
  get visibleWidth() {
    return this.service.resizeState.visibleWidth;
  }

  @HostBinding('style.--gantt-width.px')
  get width() {
    return this.service.resizeState.width;
  }

  @HostBinding('style.--gantt-scroll-left.px')
  get ganttOffsetLeft() {
    return this.service.resizeState.offsetLeft;
  }

  @HostBinding('style.--playhead-height.px')
  get playheadHeight() {
    return this.ganttContainer?.nativeElement.offsetHeight || 0;
  }

  timeLabel$: Observable<string> = this.service.currentTime$.pipe(
    map((dt) => dt.toFormat('HH:mm:ss'))
  );

  constructor(
    public service: GanttService,
    public cdr: ChangeDetectorRef,
    public el: ElementRef
  ) {}

  ngAfterViewInit(): void {
    //initial state
    this.service.updateState({
      width: this.mainContainer?.nativeElement.offsetWidth - 150,
      right: this.mainContainer?.nativeElement.offsetWidth - 150,
      visibleWidth: this.mainContainer?.nativeElement.offsetWidth - 150,
    });

    let left$ = this.service.select(({ left }) => left);
    let width$ = this.service.select(({ width }) => width);
    let visibleWidth$ = this.service.select(({ visibleWidth }) => visibleWidth);

    let zoomTo$ = combineLatest([left$, width$, visibleWidth$]).pipe(
      map(([left, width, visibleWidth]) => ({
        left,
        width,
        visibleWidth,
      })),
      tap(({ left, width, visibleWidth }) => {
        let zoom = width / visibleWidth;
        // console.log({ zoom, width });
        this.service.zoom = zoom;
        this.service.updateState({
          left,
          // width: width * this.service.zoomFactor
        });
      })
    );

    this.subs.add(zoomTo$.subscribe());
  }

  handleResize = ({ side, movementX }: IResize) => {
    if (side === 'left') {
      let {
        resizeState: { left, width },
        zoomFactor,
      } = this.service;
      let x = Math.max(0, left + movementX);
      this.service.updateState({
        offsetLeft: x,
        left: x,
        width: x > 0 ? width - movementX : width,
      });
      if (this.mainContainer) {
        let scrollTo = this.service.resizeState.offsetLeft * zoomFactor;
        this.mainContainer.nativeElement.scrollTo({
          left: scrollTo,
          behavior: 'smooth',
        });
      }
    } else {
      let { right, width, visibleWidth } = this.service.resizeState;
      right = Math.min(right + movementX, visibleWidth);
      width = Math.min(width + movementX, visibleWidth);
      this.service.updateState({ width, right });
    }
  };

  handleMove = ({ movementX }: any) => {
    if (this.mainContainer) {
      let {
        resizeState: { offsetLeft, left, width, visibleWidth },
        zoomFactor,
        zoom,
      } = this.service;
      console.log({
        zoom,
        offsetLeft,
        movementX,
        'offsetLeft + movementX': offsetLeft + movementX,
      });
      console.log({
        visibleWidth,
        width,
        'visibleWidth - width': visibleWidth - width,
      });
      offsetLeft = Math.max(
        0,
        Math.min(offsetLeft + movementX, visibleWidth - width)
      );
      this.service.updateState({
        offsetLeft,
        left: left + movementX,
      });
      let scrollTo = this.service.resizeState.offsetLeft * zoomFactor;
      // console.log({ offsetLeft, scrollTo });
      this.mainContainer.nativeElement.scrollTo({
        left: scrollTo,
        behavior: 'smooth',
      });
    }
  };
}
