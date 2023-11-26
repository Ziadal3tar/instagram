import {
  Component,
  ElementRef,
  HostListener,
  Renderer2,
  Directive,
  Input,
} from '@angular/core';
import { SharingService } from 'src/app/services/sharing.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  divArray: any[] = [];
  num: any = 1;
  ksr: Boolean = false;
  constructor(
    private elementRef: ElementRef,
    private _sharing: SharingService
  ) {
    console.log(window.innerWidth);
    if (window.innerWidth >= 767) {
      this.marginSize = 80;
      this.widthSize = 8;
    } else {
      this.marginSize = 90;
      this.widthSize = 4;
    }
  }
  showDiv: boolean = false;
  mouseX: number = 0;
  mouseY: number = 0;
  divTop: string = '0';
  divLeft: string = '0';
  storyOpened: Boolean = false;
  widthSize: any;
  marginSize: any;
  @Input() storyData: any;

  ngOnInit(): void {
    this._sharing.updateUserData();
    this._sharing.currentUserData.subscribe((data: any) => {
      this.divArray = data;
    });
  }
  onMouseMove(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    this.divTop = `${event.clientY}px`;
    this.divLeft = `${event.clientX - 60}px`;
  }
  mouseleave(event: any) {
    const relatedTargetName = (event.relatedTarget as HTMLElement).id;

    if (relatedTargetName != 'dataWhenHover') {
      this.showDiv = false;
    }
  }
  hideDiv() {
    this.showDiv = false;
  }
  ngAfterViewInit() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, // Adjust this value to control when the video starts playing
    };

    const video = this.elementRef.nativeElement.querySelector('video');

    const callback = (entries: any) => {
      entries.forEach((entry: any) => {
        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    observer.observe(video);
  }
  right() {
    const element: any = document.getElementById('story');
    if (this.divArray.length > this.num * this.widthSize) {
      if (
        this.divArray.length - this.num * this.widthSize >
        this.widthSize - 1
      ) {
        element.style.marginLeft = -this.marginSize * this.num + '%';
        this.num += 1;
      } else {
        let margin =
          (this.divArray.length - this.num * this.widthSize) *
          (100 / this.widthSize);
        element.style.marginLeft =
          -(margin + (this.num - 1) * this.marginSize) + '%';
        this.ksr = !this.ksr;
      }
    }
  }
  left() {
    const element: any = document.getElementById('story');
    if (this.divArray.length % this.widthSize != 0 && this.ksr) {
      element.style.marginLeft = -(this.num - 1) * this.marginSize + '%';
      this.ksr = !this.ksr;
    } else {
      if (this.num >= 2) {
        this.num -= 1;
      }
      element.style.marginLeft = -(this.num - 1) * this.marginSize + '%';
    }
  }

  openStory(data: any) {
    console.log(data);

    if (data.stories.length != 0) {
      this.storyOpened = true;
      this.storyData = data.stories;
    }
  }
  closeStory() {
    this.storyOpened = false;
    this.storyData = null;
  }
}
