import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';

interface ResizableScroller {
  x: number;
  width: number;
}

@Component({
  selector: 'sey-gantt-scroll-bar',
  standalone: true,
  imports: [CommonModule, CdkDrag, CdkDragHandle],
  templateUrl: './scroll-bar.component.html',
  styleUrl: './scroll-bar.component.scss',
})
export class ScrollBarComponent {
  scrollBox = signal<ResizableScroller>({x: 0, width: 0});

  private resizing: {
    direction: string,
    startX: number,
    startWidth: number,
    startPosX: number
  } | null = null;

  onDragEnded(event: any) {
    const { x } = event.source.getFreeDragPosition();
    this.scrollBox.update(prev => prev.x = x);
  }

  startResize(event: MouseEvent, direction: string) {
    event.preventDefault();
    event.stopPropagation();

    this.resizing = {
      direction,
      startX: event.clientX,
      startWidth: this.scrollBox().width,
      startPosX: this.scrollBox().x
    }

    
    const mouseMoveHandler = (e: MouseEvent) => this.handleResize(e);
    const mouseUpHandler = () => {
      this.resizing = null;
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }

  private handleResize(event: MouseEvent) {
    if (!this.resizing) return;
    const { direction, startX,  startWidth,  startPosX } = this.resizing;
    const deltaX = event.clientX - startX;

    let newWidth = startWidth;
    let newX = startPosX;

    switch(direction) {
      case 'left':
        newWidth = Math.max(0, startWidth + deltaX);
        break;
      case 'right':
        newWidth = Math.max(0, startWidth - deltaX);
    }

    this.scrollBox.update(prev => ({...prev, width: newWidth}));
  }
}
