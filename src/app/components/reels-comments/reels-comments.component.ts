import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Subject, finalize, takeUntil } from 'rxjs';
import { ContentItem, CurrentUser } from '../../core/models/api.models';
import { PostsService } from '../../services/posts.service';
import { SharingService } from '../../services/sharing.service';

@Component({
  selector: 'app-reels-comments',
  templateUrl: './reels-comments.component.html',
  styleUrls: ['./reels-comments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReelsCommentsComponent implements OnChanges, OnDestroy {
  @Input() reel: ContentItem | null = null;
  @Output() closeComments = new EventEmitter<void>();

  current: ContentItem | null = null;
  userData: CurrentUser | null = null;
  comment = '';
  loading = false;
  submitting = false;
  loadError = '';
  submitError = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly postsService: PostsService,
    private readonly sharing: SharingService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.sharing.currentUserData
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.userData = user;
        this.cdr.markForCheck();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reel']?.currentValue?._id) {
      this.current = changes['reel'].currentValue;
      this.comment = '';
      this.submitError = '';
      this.load();
    }
  }

  private load(): void {
    if (!this.current) return;

    this.loading = true;
    this.loadError = '';
    this.cdr.markForCheck();

    this.postsService
      .getPostById(this.current._id, 'reel', 1, 30)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (response:any) => {
          if (response?.success && response.data) {
            console.log(response);
            
            this.current = response.data.post;
          } else {
            this.loadError = response?.message || 'Please try again in a moment.';
          }
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.loadError = error?.error?.message || 'Please check your connection and try again.';
          this.cdr.markForCheck();
        },
      });
  }

  retryLoad(): void {
    if (this.loading) return;
    this.load();
  }

  close(): void {
    this.closeComments.emit();
  }

  addReelComment(): void {
    const text = this.comment.trim();
    const reel = this.current;

    if (!text || !reel || this.submitting) return;

    this.submitting = true;
    this.submitError = '';
    this.cdr.markForCheck();

    this.postsService
      .addComment(reel._id, 'reel', text)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.submitting = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (response) => {
          if (response?.success && response.data?.comment && this.current) {
            this.current = {
              ...this.current,
              comments: [response.data.comment, ...(this.current.comments || [])],
              commentsCount: response.data.commentsCount ?? (this.current.commentsCount || 0) + 1,
            };
            this.comment = '';
            this.submitError = '';
          } else {
            this.submitError = response?.message || 'Your comment could not be posted. Please try again.';
          }
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.submitError = error?.error?.message || 'Unable to post your comment. Please try again.';
          this.cdr.markForCheck();
        },
      });
  }

  trackByComment(index: number, item: any): string {
    return String(item?._id ?? index);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
