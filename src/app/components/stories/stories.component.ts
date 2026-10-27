import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { SharingService } from 'src/app/services/sharing.service';
import { SocketService } from 'src/app/services/socket.service';
import { StoriesService } from 'src/app/services/stories.service';
import { SessionService } from 'src/app/core/services/session.service';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss'],
})
export class StoriesComponent implements OnDestroy {
  @Input() storyData: any;
  @Input() uploadFiles: any;
  @Input() uploadStoryData: any;

  @Output() closeStory = new EventEmitter<any>();
  @Output() visitProfile = new EventEmitter<any>();

  @ViewChild('storyCanvas') storyCanvas?: ElementRef<HTMLElement>;
  @ViewChild('storyVideo') set storyVideoRef(ref: ElementRef<HTMLVideoElement> | undefined) {
    this.storyVideo = ref?.nativeElement ?? null;
    if (this.storyVideo) {
      this.storyVideo.muted = this.isMuted;
      if (this.isPaused) {
        this.storyVideo.pause();
      }
    }
  }

  loading = false;
  imgId = 0;
  timeout: ReturnType<typeof setTimeout> | null = null;
  captionStory = '';
  captionColor = '#242424';
  replyMessage = '';
  isPaused = false;
  isMuted = true;
  isLiked = false;

  private storyVideo: HTMLVideoElement | null = null;
  private isDragging = false;
  private dragOffsetX = 0;
  private dragOffsetY = 0;
  private target: HTMLElement | null = null;
   offsetX = '';
   offsetY = '';

  constructor(
    private _story: StoriesService,
    private _sharing: SharingService,
    private _socket: SocketService,
    private _session: SessionService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    if (this.hasStories) {
      this.startStory();
    }
  }

  ngOnDestroy(): void {
    this.clearStoryTimer();
  }

  get hasStories(): boolean {
    return Array.isArray(this.storyData?.stories) && this.storyData.stories.length > 0;
  }

  startStory(): void {
    this.clearStoryTimer();
    if (!this.hasStories || this.imgId < 0 || this.imgId >= this.storyData.stories.length) {
      return;
    }

    const currentStory = this.storyData.stories[this.imgId];
    const duration = Math.max(Number(currentStory?.duration) || 5, 1);
    document.documentElement.style.setProperty('--time', String(duration));

    if (this.isPaused) {
      return;
    }

    this.timeout = setTimeout(() => {
      this.advanceStory();
    }, duration * 1000);
  }

  prev(): void {
    if (!this.hasStories) return;

    this.clearStoryTimer();
    this.isPaused = false;
    this.imgId = Math.max(0, this.imgId - 1);
    this.startStory();
  }

  next(): void {
    if (!this.hasStories) return;

    this.clearStoryTimer();
    this.isPaused = false;
    this.advanceStory();
  }

  private advanceStory(): void {
    if (!this.hasStories) return;

    if (this.imgId >= this.storyData.stories.length - 1) {
      this.close();
      return;
    }

    this.imgId += 1;
    this.startStory();
  }

  togglePlayback(): void {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.clearStoryTimer();
      this.storyVideo?.pause();
      document.documentElement.style.setProperty('--time', '0');
      return;
    }

    this.startStory();
    if (this.storyVideo) {
      this.storyVideo.play().catch(() => undefined);
    }
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
    if (this.storyVideo) {
      this.storyVideo.muted = this.isMuted;
    }
  }

  toggleLike(): void {
    // Visual feedback only; the existing component has no story-reaction API wired in.
    this.isLiked = !this.isLiked;
  }

  focusReply(): void {
    const replyInput = document.querySelector<HTMLInputElement>('.story-reply-field input');
    replyInput?.focus();
  }

  close(): void {
    this.clearStoryTimer();
    this.storyData = undefined;
    this.closeStory.emit('');
  }

  toProfile(): void {
    const userId = this.storyData?._id;
    if (!userId) return;

    this.router.navigate([`/userProfile/${userId}`]);
    this.visitProfile.emit('Profile');
    this.close();
  }

  onMouseDown(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('story-caption--draggable')) return;

    this.beginDrag(target, event.clientX, event.clientY);
    event.preventDefault();
  }

  onTouchStart(event: TouchEvent): void {
    const target = event.target as HTMLElement;
    const touch = event.touches[0];
    if (!target.classList.contains('story-caption--draggable') || !touch) return;

    this.beginDrag(target, touch.clientX, touch.clientY);
  }

  private beginDrag(target: HTMLElement, clientX: number, clientY: number): void {
    const rect = target.getBoundingClientRect();
    this.target = target;
    this.isDragging = true;
    this.dragOffsetX = clientX - rect.left;
    this.dragOffsetY = clientY - rect.top;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging || !this.target) return;
    this.moveCaption(event.clientX, event.clientY);
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging || !this.target || !event.touches[0]) return;
    this.moveCaption(event.touches[0].clientX, event.touches[0].clientY);
    event.preventDefault();
  }

  private moveCaption(clientX: number, clientY: number): void {
    if (!this.target) return;

    const bounds = this.target.parentElement?.getBoundingClientRect();
    if (!bounds) return;

    const maxLeft = Math.max(0, bounds.width - this.target.offsetWidth);
    const maxTop = Math.max(0, bounds.height - this.target.offsetHeight);
    const left = Math.min(Math.max(clientX - bounds.left - this.dragOffsetX, 0), maxLeft);
    const top = Math.min(Math.max(clientY - bounds.top - this.dragOffsetY, 0), maxTop);

    this.target.style.left = `${left}px`;
    this.target.style.top = `${top}px`;
    this.target.classList.remove('story-caption--centered');
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  onPointerUp(): void {
    if (this.target) {
      this.offsetX = this.target.style.left;
      this.offsetY = this.target.style.top;
    }
    this.isDragging = false;
    this.target = null;
  }

  addStory(): void {
    if (this.loading || !this.uploadFiles) return;

    this.loading = true;
    const formData = new FormData();
    if (this.uploadStoryData?.duration) {
      formData.append('duration', String(this.uploadStoryData.duration));
    }
    formData.append('story', this.uploadFiles);
    formData.append('left', this.offsetX || '');
    formData.append('top', this.offsetY || '');
    formData.append('color', this.captionColor || '');
    formData.append('caption', this.captionStory || '');

    this._story.addStory(formData).subscribe(
      (data: any) => {
        this.loading = false;
        if (!data?.success) return;

        this._sharing.updateUserData();
        this._socket.emit('notification', {
          eventName: 'addStory',
          type: 'story',
          data: this._session.userId,
          redirect: data.data._id,
        });
        this.close();
      },
      (_err: HttpErrorResponse) => {
        this.loading = false;
      }
    );
  }

  private clearStoryTimer(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }
}
