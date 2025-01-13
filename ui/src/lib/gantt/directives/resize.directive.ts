import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  debounceTime,
  exhaustMap,
  fromEvent,
  map,
  merge,
  Observable,
  startWith,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
  tap,
  throttleTime,
} from 'rxjs';
import { IResize, ResizeSide } from '../interfaces/resize';

@Directive({
  selector: '[resizable], [moveable]',
  standalone: true,
})
export class ResizeDirective implements OnInit {
  private resizeStart: Subject<MouseEvent> = new Subject();
  private destroy$$: Subject<void> = new Subject();

  private resizeStart$: Observable<MouseEvent> =
    this.resizeStart.asObservable();

  private subs: Subscription = new Subscription();

  @Input('resizable')
  public resizeSide!: ResizeSide;

  @Input('moveable')
  public moveable: boolean = false;

  @Output()
  public onResize: EventEmitter<IResize> = new EventEmitter();

  @Output()
  public onMove: EventEmitter<any> = new EventEmitter();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public el: ElementRef
  ) {}

  ngOnInit(): void {
    const mouseDown$ = fromEvent(this.el.nativeElement, 'mousedown').pipe(
      tap((e: any) => {
        e.stopPropagation();
        e.preventDefault();

        if (e.button === 0) {
          this.resizeStart.next(e);
        }
      })
    );

    const mouseUp$: Observable<any> = fromEvent(this.document, 'mouseup');

    const mouseMove$: Observable<any> = fromEvent(this.document, 'mousemove');

    const deltaPixels$: Observable<any> = this.resizeStart$.pipe(
      exhaustMap((start) =>
        mouseMove$.pipe(
          startWith(start),
          map(({ movementX }) => movementX),
          takeUntil(merge(mouseUp$, this.destroy$$))
        )
      ),
      tap((movementX) => {
        if (this.moveable) {
          this.onMove.emit({ movementX });
        }
        if (this.resizeSide) {
          this.onResize.emit({ side: this.resizeSide, movementX });
        }
      })
    );

    this.subs.add(merge(mouseDown$, mouseUp$, deltaPixels$).subscribe());
  }
}
