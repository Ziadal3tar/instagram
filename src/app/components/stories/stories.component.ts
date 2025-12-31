import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { SharingService } from 'src/app/services/sharing.service';
import { SocketService } from 'src/app/services/socket.service';
import { StoriesService } from 'src/app/services/stories.service';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss'],
})
export class StoriesComponent {
  @Input() storyData: any;
  stop: Boolean = false;
  loading: Boolean = false;
  imgId: number = 0;
  timeout: any = 0;
  captionStory: any;
  captionColor: any;

  @Input() uploadFiles: any;
  @Input() uploadStoryData: any;
  @Output() closeStory: EventEmitter<any> = new EventEmitter<any>();
  @Output() visitProfile: EventEmitter<any> = new EventEmitter<any>();
  private isDragging: boolean = false;
  private offsetX: any = 0;
  private offsetY: any = 0;
  private target: HTMLElement | null = null;  
  constructor(
    private _story: StoriesService,
    private _sharing: SharingService,
    private _socket: SocketService,
    private Router: Router
  ) {}
  ngOnInit(): void {}
  ngAfterViewInit(): void {
    if (this.storyData) {
      this.startStory();
    }
  }
  ngOnDestroy(): void {}
  startStory() {
    document.documentElement.style.setProperty(
      '--time',
      this.storyData.stories[this.imgId].duration
    );

    this.timeout = setTimeout(() => {
      if (this.imgId === this.storyData.stories.length - 1) {
        this.close();
      } else {
        this.imgId++;
        this.startStory();
      }
    }, this.storyData.stories[this.imgId].duration * 1000);
  }

  prev() {
    clearTimeout(this.timeout);
    document.documentElement.style.setProperty('--time', '0');

    if (this.imgId === 0) {
      this.imgId = 0;
      this.startStory();
    } else {
      this.imgId--;

      this.startStory();
    }
  }

  next() {
    clearTimeout(this.timeout);
    document.documentElement.style.setProperty('--time', '0');
    if (this.imgId === this.storyData.stories.length - 1) {
      this.close();
    } else {
      this.imgId++;
      this.startStory();
    }
  }

  close() {
    this.storyData = undefined;
    this.closeStory.emit('');
  }

  onMouseDown(event: MouseEvent) {
    this.target = event.target as HTMLElement; // Cast target to HTMLElement
    if (this.target.classList.contains('draggable')) {
      // Check if the target has the draggable class
      this.isDragging = true;

    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging && this.target) {

      const left = event.clientX - 790;

      const top = event.clientY - 230;
      this.target.style.left = left + 'px';
      this.target.style.top = top + 'px';
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    let position = document.getElementById('draggable');
    this.offsetX = position?.style.left;
    this.offsetY = position?.style.top;

    this.isDragging = false;
    this.target = null; // Reset the target element
  }

  addStory() {
    this.loading = !this.loading;
    const formData = new FormData();
    if (this.uploadStoryData?.duration) {
      formData.append('duration', this.uploadStoryData.duration);
    }
    formData.append('story', this.uploadFiles);
    formData.append('left', this.offsetX);
    formData.append('top', this.offsetY);
    formData.append('color', this.captionColor);
    formData.append('caption', this.captionStory);
    this._story.addStory(formData).subscribe(
      (data: any) => {

        if (data.success) {
          this._sharing.updateUserData();
          this.loading = !this.loading;
          this.close()
        this._socket.emit('notification',{eventName:'addStory',type:'story',data:localStorage.getItem('id'),redirect:data.data._id})

        }
      },
      (err: HttpErrorResponse) => {
        this.loading = !this.loading;

      }
    );
  }
  toProfile(){
    this.Router.navigate([`/userProfile/${this.storyData._id}`]);

    this.visitProfile.emit('Profile')
    this.close()
  }
}
