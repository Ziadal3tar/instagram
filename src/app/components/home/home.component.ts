import {
  Component,
  ElementRef,
  HostListener,
  Renderer2,
  Directive,
  Input,
} from '@angular/core';
import { SharingService } from 'src/app/services/sharing.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 5
      },
      400: {
        items: 6
      },
      740: {
        items: 7
      },
      940: {
        items: 9
      }
    },
    nav: false
  }






  divArray: any[] =  [
      {
        name: 'Alice',
        stories: [
          './assets/imgs/anne.jpg',
          './assets/imgs/MAB.jpg',
          './assets/imgs/me.jpg',
        ],
      },
      { name: 'Bob', stories: [] },
      { name: 'Charlie', stories: [] },
      { name: 'David', stories: [] },
      { name: 'Emma', stories: [] },
      { name: 'Frank', stories: [] },
      { name: 'Grace', stories: [] },
      { name: 'Henry', stories: [] },
      { name: 'Ivy', stories: [] },
      { name: 'Jack', stories: [] },
      { name: 'Katherine', stories: [] },
      { name: 'Larry', stories: [] },
      { name: 'Molly', stories: [] },
      { name: 'Nancy', stories: [] },
      { name: 'Oscar', stories: [] },
      { name: 'Peter', stories: [] },
      { name: 'Quincy', stories: [] },
      { name: 'Rachel', stories: [] },
      { name: 'Sam', stories: [] },
      { name: 'Tina', stories: [] },
      { name: 'Ulysses', stories: [] },
      { name: 'Victor', stories: [] },
      { name: 'Wendy', stories: [] },
      { name: 'Xavier', stories: [] },
      { name: 'Yvonne', stories: [] },
      { name: 'Zack', stories: [] },
      { name: 'Andrew', stories: [] },
      { name: 'Betty', stories: [] },
      { name: 'Charles', stories: [] },
      { name: 'Diana', stories: [] },
      { name: 'Edward', stories: [] },
      { name: 'Fiona', stories: [] },
      { name: 'George', stories: [] },
      { name: 'Helen', stories: [] },
      { name: 'Isaac', stories: [] },
      { name: 'Jane', stories: [] },
      { name: 'Kevin', stories: [] },
      { name: 'Linda', stories: [] },
      { name: 'Michael', stories: [] },
      { name: 'Nina', stories: [] },
      { name: 'Oliver', stories: [] },
      { name: 'Pamela', stories: [] },
    ];
  num: any = 1;
  userData: any
  ksr: Boolean = false;
  constructor(
    private elementRef: ElementRef,
    private _sharing: SharingService,
  ) {
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
    this._sharing.updateUserData()

    this._sharing.currentUserData.subscribe((data: any) => {
      this.userData = data;
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

    if (video) {
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
    } else {
      console.error('Video element not found.');
    }
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
