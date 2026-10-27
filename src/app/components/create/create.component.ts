import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, finalize, takeUntil } from 'rxjs';

import { PostsService } from '../../services/posts.service';
import { ReelService } from '../../services/reel.service';
import { SharingService } from '../../services/sharing.service';
import { SocketService } from '../../services/socket.service';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateComponent implements OnDestroy {
  activeTap: 'Posts' | 'Reels' = 'Posts';

  captionPost = '';
  captionReel = '';

  postsFiles: File[] = [];
  reelFile: File | null = null;

  postsSrc: string[] = [];
  reel = '';

  loading = false;
  ErrorResponse = '';

  isDraggingPost = false;
  isDraggingReel = false;

  private readonly destroy$ = new Subject<void>();

  private readonly maxPostFiles = 10;
  private readonly maxPostFileSize = 15 * 1024 * 1024;
  private readonly maxReelSize = 80 * 1024 * 1024;

  constructor(
    private readonly postsService: PostsService,
    private readonly sharing: SharingService,
    private readonly reelsService: ReelService,
    private readonly socket: SocketService,
    private readonly session: SessionService,
    public readonly cdr: ChangeDetectorRef,
  ) {}

  setActiveTab(tab: 'Posts' | 'Reels'): void {
    if (this.loading) return;

    this.activeTap = tab;
    this.ErrorResponse = '';
    this.isDraggingPost = false;
    this.isDraggingReel = false;

    this.cdr.markForCheck();
  }

  // --------------------------------------------------
  // Posts: file selection and drag/drop
  // --------------------------------------------------

  uploadPost(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files?.length) {
      this.processPostFiles(files);
    }

    // Allows selecting the same files again.
    input.value = '';
  }

  onPostDragOver(event: DragEvent): void {
    event.preventDefault();

    if (this.loading) return;

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }

    this.isDraggingPost = true;
    this.cdr.markForCheck();
  }

  onPostDragLeave(event: DragEvent): void {
    const container = event.currentTarget as HTMLElement | null;
    const relatedTarget = event.relatedTarget;

    if (
      container &&
      relatedTarget instanceof Node &&
      container.contains(relatedTarget)
    ) {
      return;
    }

    this.isDraggingPost = false;
    this.cdr.markForCheck();
  }

  onPostDrop(event: DragEvent): void {
    event.preventDefault();

    this.isDraggingPost = false;

    if (this.loading) return;

    const files = event.dataTransfer?.files;

    if (files?.length) {
      this.processPostFiles(files);
    } else {
      this.cdr.markForCheck();
    }
  }

  private processPostFiles(fileList: FileList | readonly File[]): void {
    if (this.loading) return;

    const files = Array.from(fileList);

    if (!files.length) return;

    this.ErrorResponse = '';

    const invalidFiles = files.filter(
      (file) =>
        !file.type.startsWith('image/') &&
        !file.type.startsWith('video/'),
    );

    if (invalidFiles.length) {
      this.setErrorMessage(
        'Only image and video files can be selected.',
      );
      return;
    }

    if (files.length > this.maxPostFiles) {
      this.setErrorMessage('You can select up to 10 files.');
      return;
    }

    const oversizedFile = files.find(
      (file) => file.size > this.maxPostFileSize,
    );

    if (oversizedFile) {
      this.setErrorMessage(
        `Each file must be 15 MB or smaller. "${oversizedFile.name}" is too large.`,
      );
      return;
    }

    this.revokePreviewUrls();

    this.postsFiles = files;
    this.postsSrc = files.map((file) =>
      URL.createObjectURL(file),
    );

    this.cdr.markForCheck();
  }

  clearPost(): void {
    if (this.loading) return;

    this.revokePreviewUrls();

    this.postsFiles = [];
    this.postsSrc = [];
    this.captionPost = '';
    this.ErrorResponse = '';

    this.cdr.markForCheck();
  }

  // --------------------------------------------------
  // Reels: file selection and drag/drop
  // --------------------------------------------------

  uploadReel(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.processReelFile(file);
    }

    input.value = '';
  }

  onReelDragOver(event: DragEvent): void {
    event.preventDefault();

    if (this.loading) return;

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }

    this.isDraggingReel = true;
    this.cdr.markForCheck();
  }

  onReelDragLeave(event: DragEvent): void {
    const container = event.currentTarget as HTMLElement | null;
    const relatedTarget = event.relatedTarget;

    if (
      container &&
      relatedTarget instanceof Node &&
      container.contains(relatedTarget)
    ) {
      return;
    }

    this.isDraggingReel = false;
    this.cdr.markForCheck();
  }

  onReelDrop(event: DragEvent): void {
    event.preventDefault();

    this.isDraggingReel = false;

    if (this.loading) return;

    const files = event.dataTransfer?.files;

    if (!files?.length) {
      this.cdr.markForCheck();
      return;
    }

    if (files.length > 1) {
      this.setErrorMessage(
        'Select one video for each Reel.',
      );
      return;
    }

    this.processReelFile(files[0]);
  }

  private processReelFile(file: File): void {
    if (this.loading) return;

    this.ErrorResponse = '';

    if (!file.type.startsWith('video/')) {
      this.setErrorMessage('Please select a video file.');
      return;
    }

    if (file.size > this.maxReelSize) {
      this.setErrorMessage(
        'The Reel must be 80 MB or smaller.',
      );
      return;
    }

    this.revokeReelPreviewUrl();

    this.reelFile = file;
    this.reel = URL.createObjectURL(file);

    this.cdr.markForCheck();
  }

  clearReel(): void {
    if (this.loading) return;

    this.revokeReelPreviewUrl();

    this.reel = '';
    this.reelFile = null;
    this.captionReel = '';
    this.ErrorResponse = '';

    this.cdr.markForCheck();
  }

  // --------------------------------------------------
  // Publishing
  // --------------------------------------------------

  addPost(): void {
    if (!this.postsFiles.length || this.loading) return;

    this.ErrorResponse = '';
    this.setLoading(true);

    const formData = new FormData();

    for (const file of this.postsFiles) {
      const field = file.type.startsWith('video/')
        ? 'video'
        : 'image';

      formData.append(field, file);
    }

    const caption = this.captionPost.trim();

    if (caption) {
      formData.append('caption', caption);
    }

    this.postsService
      .addPost(formData)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.setLoading(false)),
      )
      .subscribe({
        next: (response) => {
          if (!response.success) {
            this.setErrorMessage(
              response.message || 'Unable to publish this post.',
            );
            return;
          }

          this.sharing.refreshCurrentUser();

          this.socket.emit('notification', {
            eventName: 'addPost',
            type: 'post',
            data: this.session.userId,
            redirect: response.data?._id,
          });

          this.clearPostAfterSuccess();
        },

        error: (error: HttpErrorResponse) => {
          this.setError(error);
        },
      });
  }

  addReel(): void {
    if (!this.reelFile || this.loading) return;

    this.ErrorResponse = '';
    this.setLoading(true);

    const formData = new FormData();

    formData.append('reel', this.reelFile);

    const caption = this.captionReel.trim();

    if (caption) {
      formData.append('caption', caption);
    }

    this.reelsService
      .addReel(formData)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.setLoading(false)),
      )
      .subscribe({
        next: (response) => {
          if (!response.success) {
            this.setErrorMessage(
              response.message || 'Unable to publish this Reel.',
            );
            return;
          }

          this.sharing.refreshCurrentUser();
          this.clearReelAfterSuccess();
        },

        error: (error: HttpErrorResponse) => {
          this.setError(error);
        },
      });
  }

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  private clearPostAfterSuccess(): void {
    this.revokePreviewUrls();

    this.postsFiles = [];
    this.postsSrc = [];
    this.captionPost = '';
    this.ErrorResponse = '';

    this.cdr.markForCheck();
  }

  private clearReelAfterSuccess(): void {
    this.revokeReelPreviewUrl();

    this.reel = '';
    this.reelFile = null;
    this.captionReel = '';
    this.ErrorResponse = '';

    this.cdr.markForCheck();
  }

  private setLoading(value: boolean): void {
    this.loading = value;
    this.cdr.markForCheck();
  }

  private setError(error: HttpErrorResponse): void {
    this.ErrorResponse =
      error.error?.message ||
      'Something went wrong. Please try again.';

    this.cdr.markForCheck();
  }

  private setErrorMessage(message: string): void {
    this.ErrorResponse = message;
    this.cdr.markForCheck();
  }

  private revokePreviewUrls(): void {
    for (const url of this.postsSrc) {
      URL.revokeObjectURL(url);
    }
  }

  private revokeReelPreviewUrl(): void {
    if (this.reel) {
      URL.revokeObjectURL(this.reel);
    }
  }

  ngOnDestroy(): void {
    this.revokePreviewUrls();
    this.revokeReelPreviewUrl();

    this.destroy$.next();
    this.destroy$.complete();
  }
}
