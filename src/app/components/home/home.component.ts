import {
  Component,
  ElementRef,
  HostListener,
  Renderer2,
  Directive,
  Input,
  Output,
  EventEmitter,
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
        items: 5,
      },
      400: {
        items: 6,
      },
      740: {
        items: 7,
      },
      940: {
        items: 9,
      },
    },
    nav: false,
  };
  @Output() visitProfile: EventEmitter<any> = new EventEmitter<any>();

  num: any = 1;
  userData: any;
  uploadFilesData: any;
  uploadStoryData: any;
  ifUploadStory: Boolean = false;
  option: Boolean = false;
  constructor(
    private elementRef: ElementRef,
    private _sharing: SharingService
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
  storyData: any;

  ngOnInit(): void {
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

  openStory(data: any) {
    if (data.stories.length != 0) {
      this.storyOpened = true;
      this.storyData = data;
    }
  }
  closeStory() {
    this.storyOpened = false;
    this.storyData = null;
  }

  uploadStory(event: any) {
    const file = event.target.files[0];
    this.uploadFilesData = file;

    if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        let duration = video.duration;

        // Limit the video duration to 30 seconds
        if (duration > 30) {
          console.log(
            `Video ${file.name} is longer than 30 seconds. Truncating to 30 seconds.`
          );
          duration = 30;
        }

        const story: any = {
          name: file.name,
          size: file.size,
          type: file.type,
          duration: duration,
        };

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event: any) => {
          let data = {
            Src: event.target.result,
            type: file.type.split('/')[0],
            duration: duration,
          };
          this.uploadStoryData = data;
          this.storyOpened = !this.storyOpened;
        };
      };

      video.src = URL.createObjectURL(file);
    } else if (file.type.startsWith('image/')) {
      const story: any = {
        name: file.name,
        size: file.size,
        type: file.type,
      };

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        let data = {
          Src: event.target.result,
          type: file.type.split('/')[0],
        };
        this.uploadStoryData = data;

        this.storyOpened = !this.storyOpened;
      };
    }
  }
  toProfile(data:any){
    this.visitProfile.emit(data)


  }
}
