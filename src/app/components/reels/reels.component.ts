import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-reels',
  templateUrl: './reels.component.html',
  styleUrls: ['./reels.component.scss'],
})
export class ReelsComponent {

  startY: number = 0;
  startX: number = 0;
  constructor(private elementRef: ElementRef) {}



  // @HostListener('touchstart', ['$event'])
  // onTouchStart(event: TouchEvent) {
  //   this.startY = event.touches[0].clientY;
  //   this.startX = event.touches[0].clientX;
  // }

  // @HostListener('touchmove', ['$event'])
  // onTouchMove(event: TouchEvent) {
  //   const currentY = event.touches[0].clientY;
  //   const currentX = event.touches[0].clientX;
  //   const yDiff = this.startY - currentY;
  //   const xDiff = this.startX - currentX;

  //   if (Math.abs(yDiff) > Math.abs(xDiff)) {
  //     if (yDiff > 0) {
  //       this.scrollToNextSection();
  //     } else {
  //       this.scrollToPreviousSection();
  //     }
  //   } else {
  //     if (xDiff > 0) {
  //     } else {
  //     }
  //   }
  // }

  scrollToNextSection(): void {
    const currentScroll = window.pageYOffset;
    const windowHeight = window.innerHeight;
    window.scrollTo({ top: currentScroll + windowHeight, behavior: 'smooth' });
  }

  scrollToPreviousSection(): void {
    const currentScroll = window.pageYOffset;
    const windowHeight = window.innerHeight;
    window.scrollTo({ top: currentScroll - windowHeight, behavior: 'smooth' });
  }


  @HostListener('window:wheel', ['$event'])

  onWindowScroll(event: WheelEvent) {
    let target:any = event.target

    if (target?.id == 'reels') {
      if (event.deltaY > 0) {
        this.scrollToNextSection1();
      } else if (event.deltaY < 0) {
        this.scrollToPreviousSection2();
      }

    }
  }

  scrollToNextSection1(): void {
    const currentScroll = window.pageYOffset;
    const windowHeight = window.innerHeight;
    window.scrollTo({ top: currentScroll + windowHeight, behavior: 'smooth' });
  }

  scrollToPreviousSection2(): void {
    const currentScroll = window.pageYOffset;
    const windowHeight = window.innerHeight;
    window.scrollTo({ top: currentScroll - windowHeight, behavior: 'smooth' });
  }

  ngAfterViewInit() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const video = this.elementRef.nativeElement.querySelector('video');



    const callback = (entries:any) => {
      entries.forEach((entry:any) => {
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
}
