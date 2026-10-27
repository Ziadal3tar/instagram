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

import {
  Subject,
  finalize,
  takeUntil,
} from 'rxjs';

import { ContentItem } from '../../core/models/api.models';
import { PostsService } from '../../services/posts.service';
import { SharingService } from '../../services/sharing.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-display-explore',
  templateUrl: './display-explore.component.html',
  styleUrls: ['./display-explore.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayExploreComponent implements OnChanges, OnDestroy {
  @Input() exploreData?: ContentItem;

  @Output() open = new EventEmitter<boolean>();

  item?: ContentItem;

  comment = '';
  detailsVisible = false;

  toggleDetails(event?: Event): void {
    event?.stopPropagation();
    this.detailsVisible = !this.detailsVisible;
    this.cdr.markForCheck();
  }

  isSaved = false;
  value = 0;

  loading = true;
  liking = false;
  saving = false;
  submittingComment = false;

  actionError: string | null = null;
  commentError: string | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly postService: PostsService,
    private readonly userService: UserService,
    private readonly sharing: SharingService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.sharing.currentSaved
      .pipe(takeUntil(this.destroy$))
      .subscribe((saved) => {
        const savedItems = saved?.items ?? [];

        if (this.item) {
          this.isSaved = savedItems.some(
            (entry) =>
              String(entry._id) === String(this.item?._id),
          );
        }

        this.cdr.markForCheck();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['exploreData']) {
      return;
    }

    if (this.exploreData?._id) {
      this.load();
      return;
    }

    this.item = undefined;
    this.loading = false;
    this.cdr.markForCheck();
  }

  /**
   * Load the complete post details.
   */
 private load(): void {
  const selectedItem = this.exploreData;

  if (!selectedItem?._id) {
    this.item = undefined;
    this.loading = false;
    this.cdr.markForCheck();
    return;
  }

  this.loading = true;
  this.item = selectedItem;
  this.value = 0;
  this.comment = '';
  this.actionError = null;
  this.commentError = null;

  this.isSaved = (
    this.sharing.currentSavedPage.items ?? []
  ).some(
    (entry) =>
      String(entry._id) === String(selectedItem._id),
  );

  this.cdr.markForCheck();

  this.postService
    .getPostById(selectedItem._id, selectedItem.type)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response: any) => {
        // Ignore the result if another post has been selected.
        if (
          !this.exploreData?._id ||
          String(this.exploreData._id) !==
            String(selectedItem._id)
        ) {
          return;
        }

        if (response?.success && response?.data) {
          const data = response.data;

          // The API may return the post nested inside data.post.
          const postData = data.post ?? data;

          // Normalize the comments array.
          const comments = Array.isArray(postData.comments)
            ? postData.comments
            : Array.isArray(data.comments)
              ? data.comments
              : Array.isArray(selectedItem.comments)
                ? selectedItem.comments
                : [];

          // Support either response shape for commentsCount.
          const rawCount =
            postData.commentsCount ??
            data.commentsCount;

          const parsedCount = Number(rawCount);

          const commentsCount = Number.isFinite(parsedCount)
            ? parsedCount
            : comments.length;

          // Build the final item only once.
          this.item = {
            ...selectedItem,
            ...data,
            ...postData,
            comments,
            commentsCount,
          };

          const savedItems =
            this.sharing.currentSavedPage.items ?? [];

          this.isSaved = savedItems.some(
            (entry) =>
              String(entry._id) ===
              String(this.item?._id),
          );
        }

        this.loading = false;
        this.cdr.markForCheck();
      },

      error: () => {
        // Do not show a false "No comments yet" state on failure.
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
}

  /**
   * Normalize the current post media.
   */
  get media(): Array<{
    url: string;
    type: 'image' | 'video';
  }> {
    if (!this.item) {
      return [];
    }

    if (this.item.type === 'reel') {
      return this.item.url
        ? [
            {
              url: this.item.url,
              type: 'video',
            },
          ]
        : [];
    }

    return this.item.postsImgAndVideos ?? [];
  }

  get activeMedia() {
    return this.media[this.value] ?? this.media[0];
  }

  /**
   * Navigate through post media.
   */
  toggleValue(next: number): void {
    const length = this.media.length;

    if (length < 2) {
      return;
    }

    this.value = (next + length) % length;

    this.cdr.markForCheck();
  }

  /**
   * Like / unlike the current post.
   */
  like(): void {
    if (!this.item || this.liking || this.loading) {
      return;
    }

    const selectedItem = this.item;

    this.liking = true;
    this.actionError = null;
    this.cdr.markForCheck();

    this.postService
      .like(selectedItem._id, selectedItem.type)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.liking = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (response) => {
          if (
            response.success &&
            response.data &&
            this.item &&
            String(this.item._id) === String(selectedItem._id)
          ) {
            this.item = {
              ...this.item,
              viewerLiked: response.data.liked,
              likesCount: response.data.likesCount,
            };

            this.cdr.markForCheck();
          }
        },

        error: () => {
          this.actionError =
            'Unable to update your like. Please try again.';

          this.cdr.markForCheck();
        },
      });
  }

  /**
   * Save / unsave the current post.
   */
  save(): void {
    if (!this.item || this.saving || this.loading) {
      return;
    }

    const selectedItem = this.item;

    this.saving = true;
    this.actionError = null;
    this.cdr.markForCheck();

    const contentType =
      selectedItem.type === 'reel' ? 'Reel' : 'Post';

    this.userService
      .savePost(selectedItem._id, contentType)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.saving = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (response) => {
          if (!response.success || !response.data) {
            return;
          }

          const saved = response.data.saved;

          this.sharing.upsertSavedLocally(
            selectedItem,
            saved,
          );

          if (
            this.item &&
            String(this.item._id) === String(selectedItem._id)
          ) {
            this.isSaved = saved;
          }

          this.cdr.markForCheck();
        },

        error: () => {
          this.actionError =
            'Unable to update saved posts. Please try again.';

          this.cdr.markForCheck();
        },
      });
  }

  /**
   * Add a comment to the current post.
   */
  addComment(): void {
    const text = this.comment.trim();

    if (
      !text ||
      !this.item ||
      this.submittingComment ||
      this.loading
    ) {
      return;
    }

    const selectedItem = this.item;

    this.submittingComment = true;
    this.commentError = null;
    this.actionError = null;
    this.cdr.markForCheck();

    this.postService
      .addComment(
        selectedItem._id,
        selectedItem.type,
        text,
      )
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.submittingComment = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (response) => {
          if (
            response.success &&
            response.data &&
            this.item &&
            String(this.item._id) === String(selectedItem._id)
          ) {
            this.item = {
              ...this.item,

              commentsCount:
                response.data.commentsCount,

              comments: [
                ...(this.item.comments ?? []),
                response.data.comment,
              ],
            };

            this.comment = '';
            this.commentError = null;

            this.cdr.markForCheck();
          }
        },

        error: () => {
          this.commentError =
            'Unable to post your comment. Please try again.';

          this.cdr.markForCheck();
        },
      });
  }

  /**
   * Focus the comment input from the action toolbar.
   */
  focusComment(input: HTMLInputElement): void {
    input.focus();
  }

  close(): void {
    this.open.emit(false);
  }

  trackById(index: number, item: any): string {
    return item?._id ?? String(index);
  }

  trackByIndex(index: number): number {
    return index;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
