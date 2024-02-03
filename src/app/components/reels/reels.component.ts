import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';

import { SharingService } from 'src/app/services/sharing.service';

@Component({
  selector: 'app-reels',
  templateUrl: './reels.component.html',
  styleUrls: ['./reels.component.scss'],
})
export class ReelsComponent {
  displayComments: any;
  reels: any[] = [];
  page = 0;

  visibleItemIndex = 0;
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private _sharing: SharingService
  ) {}
  ngOnInit(): void {
    this._sharing.updateReel(this.page);
    this._sharing.currentReels.subscribe((data: any) => {
      this.reels = this.reels.concat(data);
    });
  }

  handleScroll() {
    const container = document.querySelector('.reelsContainer');
    const scrollTop = container?.scrollTop || 0;
    const itemHeight = container?.clientHeight || 1;
    this.visibleItemIndex = Math.floor(scrollTop / itemHeight) + 2;
    if (this.visibleItemIndex == this.reels.length - 1 * 5 + 3) {
      this.page += 1;
      this._sharing.updateReel(this.page);
    }
  }
}
