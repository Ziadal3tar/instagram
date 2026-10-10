import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { Router } from '@angular/router';

import {
  Subject,
  finalize,
  takeUntil,
} from 'rxjs';

import {
  ContentItem,
  CurrentUser,
} from '../../core/models/api.models';

import { SharingService } from '../../services/sharing.service';
import { UserService } from '../../services/user.service';
import { PostsService } from '../../services/posts.service';
import { SocketService } from '../../services/socket.service';

type FeedMedia = {
  url: string;
  type: 'image' | 'video';
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  /* =====================================================
     FEED STATE
  ===================================================== */

  posts: ContentItem[] = [];

  postNavigationStates: number[] = [];

  userData: CurrentUser | null = null;

  savedIds = new Set<string>();

  page = 1;

  readonly limit = 8;

  readonly currentYear = new Date().getFullYear();

  loading = false;

  hasMore = true;

  instaLoading = true;

  feedError: string | null = null;

  /* =====================================================
     STORIES STATE
  ===================================================== */

  storyOpened = false;

  storyData: any;

  uploadFilesData: File | null = null;

  uploadStoryData: any;

  storyUploadError: string | null = null;

  option = false;

  /* =====================================================
     POST DETAILS
  ===================================================== */

  displayPost?: ContentItem;

  commentDrafts: Record<string, string> = {};

  postMessages: Record<string, string> = {};

  /* =====================================================
     REQUEST STATE
  ===================================================== */

  private readonly likeInFlight = new Set<string>();

  private readonly saveInFlight = new Set<string>();

  private readonly commentInFlight = new Set<string>();

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly sharing: SharingService,
    private readonly user: UserService,
    private readonly postsService: PostsService,
    private readonly socket: SocketService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  /* =====================================================
     LIFECYCLE
  ===================================================== */

  ngOnInit(): void {
    /*
     * Current user
     */
    this.sharing.currentUserData
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.userData = user;


        if (!user?._id) {
          this.cdr.markForCheck();
          return;
        }

        if (!this.posts.length && !this.loading) {
          this.loadPosts();
        }

        this.cdr.markForCheck();
      });

    /*
     * Saved posts
     */
    this.sharing.currentSaved
      .pipe(takeUntil(this.destroy$))
      .subscribe((saved) => {
        const items = saved?.items ?? [];

        this.savedIds = new Set(
          items.map((item) => String(item._id)),
        );

        this.cdr.markForCheck();
      });

    /*
     * Keep the project's existing saved-content refresh.
     */
    this.sharing.updateSaved(false);
  }

  /* =====================================================
     STORIES
  ===================================================== */

  /**
   * Groups stories by their owner.
   *
   * The current user's stories are excluded here because
   * the first card already represents the current user.
   */
  get storyUsers(): any[] {
    const stories = this.userData?.stories ?? [];

    const groupedStories = new Map<string, any>();

    for (const story of stories) {
      const owner = story?.createdBy;

      const id = owner?._id ?? owner;

      if (!id) {
        continue;
      }

      const key = String(id);

      if (!groupedStories.has(key)) {
        const ownerData =
          owner && typeof owner === 'object'
            ? owner
            : { _id: id };

        groupedStories.set(key, {
          ...ownerData,
          _id: id,
          stories: [],
        });
      }

      groupedStories.get(key).stories.push(story);
    }

    const currentUserId = this.userData?._id;

    return [...groupedStories.values()]
      .filter(
        (entry) =>
          String(entry._id) !== String(currentUserId),
      )
      .map((entry) => ({
        ...entry,
        userName: entry.userName || 'Instagram user',
      }));
  }

  /**
   * Open an existing story group.
   */
  openStory(data: any): void {
    if (!Array.isArray(data?.stories) || !data.stories.length) {
      return;
    }

    this.option = false;
    this.storyData = data;
    this.storyOpened = true;

    this.cdr.markForCheck();
  }

  /**
   * Close the story viewer and release locally created
   * object URLs used for an uploaded preview.
   */
  closeStory(): void {
    this.releaseUploadPreview();

    this.uploadStoryData = undefined;
    this.uploadFilesData = null;
    this.storyData = undefined;
    this.storyOpened = false;
    this.option = false;

    this.cdr.markForCheck();
  }

  /**
   * Upload a local image or video for a story preview.
   */
  uploadStory(event: Event): void {
    const input = event.target as HTMLInputElement;

    const file = input.files?.[0];

    /*
     * Reset the input so the same file can be selected again.
     */
    input.value = '';

    if (!file) {
      return;
    }

    this.storyUploadError = null;

    const isImage = file.type.startsWith('image/');

    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      this.storyUploadError =
        'Please select a valid image or video file.';

      this.cdr.markForCheck();
      return;
    }

    /*
     * Prevent an older local preview URL from being retained.
     */
    this.releaseUploadPreview();

    this.uploadFilesData = file;

    const objectUrl = URL.createObjectURL(file);

    if (isImage) {
      this.uploadStoryData = {
        Src: objectUrl,
        type: 'image',
      };

      this.storyOpened = true;

      this.cdr.markForCheck();
      return;
    }

    /*
     * Read video metadata before opening the story viewer.
     */
    const video = document.createElement('video');

    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      video.onloadedmetadata = null;
      video.onerror = null;

      const duration =
        Number.isFinite(video.duration) && video.duration > 0
          ? Math.min(video.duration, 30)
          : 5;

      this.uploadStoryData = {
        Src: objectUrl,
        type: 'video',
        duration,
      };

      this.storyOpened = true;

      /*
       * Release the temporary metadata element.
       * The object URL remains available to the story viewer.
       */
      video.removeAttribute('src');
      video.load();

      this.cdr.markForCheck();
    };

    video.onerror = () => {
      video.onloadedmetadata = null;
      video.onerror = null;

      URL.revokeObjectURL(objectUrl);

      this.uploadFilesData = null;
      this.uploadStoryData = undefined;

      video.removeAttribute('src');
      video.load();

      this.storyUploadError =
        'The selected video could not be opened. Try another video.';

      this.cdr.markForCheck();
    };

    video.src = objectUrl;
  }

  /**
   * Revoke only the temporary URL created by this component.
   */
  private releaseUploadPreview(): void {
    const url = this.uploadStoryData?.Src;

    if (
      this.uploadFilesData &&
      typeof url === 'string' &&
      url.startsWith('blob:')
    ) {
      URL.revokeObjectURL(url);
    }
  }

  /* =====================================================
     FEED / PAGINATION
  ===================================================== */

  loadPosts(force = false): void {
    if (this.loading) {
      return;
    }

    if (!this.hasMore && !force) {
      return;
    }

    /*
     * A failed request should not be retried on every scroll.
     * The user can explicitly retry instead.
     */
    if (this.feedError && !force) {
      return;
    }

    this.loading = true;
    this.feedError = null;

    this.cdr.markForCheck();

    this.user
      .getFeed(this.page, this.limit)
      .pipe(
        takeUntil(this.destroy$),

        finalize(() => {
          this.loading = false;
          this.instaLoading = false;

          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (response) => {
          if (!response?.success || !response.data) {
            this.feedError =
              'The server did not return the expected feed data.';

            this.cdr.markForCheck();
            return;
          }

          const data = response.data;

          const incomingItems: ContentItem[] =
            Array.isArray(data.items)
              ? data.items
              : [];

          /*
           * Avoid duplicate posts when loading another page.
           */
          const existingIds = new Set(
            this.posts.map((item) => String(item._id)),
          );

          const newItems = incomingItems.filter(
            (item) => !existingIds.has(String(item._id)),
          );

          this.posts = [...this.posts, ...newItems];

          /*
           * Prefer the backend's pagination metadata.
           * Fall back to the number of received items.
           */
          this.hasMore =
            typeof data.hasMore === 'boolean'
              ? data.hasMore
              : incomingItems.length >= this.limit;

          const currentPage =
            typeof data.page === 'number'
              ? data.page
              : this.page;

          this.page = currentPage + 1;

          this.initPostNavigationStates();

          this.feedError = null;

          this.cdr.markForCheck();
          console.log(
  this.posts

);
        },

        error: () => {
          this.feedError =
            'Check your connection and try loading the feed again.';

          this.cdr.markForCheck();
        },
      });
  }

  retryFeed(): void {
    this.feedError = null;

    this.loadPosts(true);
  }

  /**
   * Infinite scroll.
   */
  @HostListener('window:scroll')
  onScroll(): void {
    if (this.storyOpened || this.displayPost) {
      return;
    }

    const scrollPosition =
      window.innerHeight + window.scrollY;

    const pageHeight =
      document.documentElement.scrollHeight;

    if (scrollPosition >= pageHeight - 650) {
      this.loadPosts();
    }
  }

  /* =====================================================
     MEDIA
  ===================================================== */

  /**
   * Preserve carousel positions while new feed items arrive.
   */
  initPostNavigationStates(): void {
    this.postNavigationStates = this.posts.map(
      (post, index) => {
        const mediaCount =
          post.type === 'reel'
            ? 1
            : post.postsImgAndVideos?.length || 1;

        const oldIndex =
          this.postNavigationStates[index] ?? 0;

        return Math.min(
          Math.max(oldIndex, 0),
          mediaCount - 1,
        );
      },
    );
  }

  getCurrentMedia(
    post: ContentItem,
    index: number,
  ): FeedMedia | undefined {
    if (post.type === 'reel') {
      return post.url
        ? {
            url: post.url,
            type: 'video',
          }
        : undefined;
    }

    const mediaIndex =
      this.postNavigationStates[index] ?? 0;

    const media = post.postsImgAndVideos?.[
      mediaIndex
    ] as
      | {
          url?: string;
          type?: string;
        }
      | undefined;

    if (!media?.url) {
      return undefined;
    }

    return {
      url: media.url,
      type: media.type === 'video' ? 'video' : 'image',
    };
  }

  toggleValue(index: number, next: number): void {
    const post = this.posts[index];

    if (!post || post.type === 'reel') {
      return;
    }

    const length =
      post.postsImgAndVideos?.length ?? 0;

    if (length < 2) {
      return;
    }

    this.postNavigationStates[index] =
      ((next % length) + length) % length;

    this.cdr.markForCheck();
  }

  /* =====================================================
     PROFILE NAVIGATION
  ===================================================== */

  toUser(id: string | undefined | null): void {
    if (!id) {
      return;
    }

    void this.router.navigate(['/userProfile', id]);
  }

  /* =====================================================
     LIKE
  ===================================================== */

  isLikePending(item: ContentItem): boolean {
    return this.likeInFlight.has(String(item._id));
  }

  like(item: ContentItem): void {
    const id = String(item._id);

    if (
      !this.userData?._id ||
      this.likeInFlight.has(id)
    ) {
      return;
    }

    const before = {
      liked: Boolean(item.viewerLiked),
      count: Number(item.likesCount ?? 0),
    };

    /*
     * Optimistic UI update.
     */
    item.viewerLiked = !before.liked;

    item.likesCount = Math.max(
      0,
      before.count + (item.viewerLiked ? 1 : -1),
    );

    this.likeInFlight.add(id);
    delete this.postMessages[id];

    this.cdr.markForCheck();

    this.postsService
      .like(item._id, item.type)
      .pipe(
        takeUntil(this.destroy$),

        finalize(() => {
          this.likeInFlight.delete(id);
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (response) => {
          if (!response?.success || !response.data) {
            item.viewerLiked = before.liked;
            item.likesCount = before.count;

            this.postMessages[id] =
              'Your like could not be saved. Please try again.';

            this.cdr.markForCheck();
            return;
          }

          item.viewerLiked = response.data.liked;

          item.likesCount = response.data.likesCount;

          /*
           * Notify the post owner when another user likes it.
           */
          const ownerId = item.createdBy?._id;

          if (
            response.data.liked &&
            ownerId &&
            String(ownerId) !== String(this.userData?._id)
          ) {
            this.socket.emit('notification', {
              eventName: 'like',
              type: item.type,
              data: this.userData?._id,
              to: ownerId,
              redirect: item._id,
            });
          }

          this.cdr.markForCheck();
        },

        error: () => {
          item.viewerLiked = before.liked;
          item.likesCount = before.count;

          this.postMessages[id] =
            'Unable to update your like. Try again.';

          this.cdr.markForCheck();
        },
      });
  }

  /* =====================================================
     SAVE / UNSAVE
  ===================================================== */

  isSavePending(item: ContentItem): boolean {
    return this.saveInFlight.has(String(item._id));
  }

  isPostSaved(item: ContentItem): boolean {
    return this.savedIds.has(String(item._id));
  }

  savePost(item: ContentItem): void {
    const id = String(item._id);

    if (
      !this.userData?._id ||
      this.saveInFlight.has(id)
    ) {
      return;
    }

    const wasSaved = this.savedIds.has(id);

    /*
     * Optimistic UI update.
     */
    if (wasSaved) {
      this.savedIds.delete(id);
    } else {
      this.savedIds.add(id);
    }

    this.saveInFlight.add(id);
    delete this.postMessages[id];

    this.cdr.markForCheck();

    const contentType =
      item.type === 'reel' ? 'Reel' : 'Post';

    this.user
      .savePost(item._id, contentType)
      .pipe(
        takeUntil(this.destroy$),

        finalize(() => {
          this.saveInFlight.delete(id);
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (response) => {
          if (!response?.success) {
            this.restoreSavedState(id, wasSaved);

            this.postMessages[id] =
              'Unable to update saved posts. Try again.';

            this.cdr.markForCheck();
            return;
          }

          const saved =
            response.data?.saved ?? !wasSaved;

          /*
           * Keep the shared saved-content state synchronized.
           */
          this.sharing.upsertSavedLocally(item, saved);

          this.cdr.markForCheck();
        },

        error: () => {
          this.restoreSavedState(id, wasSaved);

          this.postMessages[id] =
            'Unable to update saved posts. Check your connection.';

          this.cdr.markForCheck();
        },
      });
  }

  private restoreSavedState(
    id: string,
    wasSaved: boolean,
  ): void {
    if (wasSaved) {
      this.savedIds.add(id);
    } else {
      this.savedIds.delete(id);
    }
  }

  /* =====================================================
     COMMENTS
  ===================================================== */

  isCommentPending(item: ContentItem): boolean {
    return this.commentInFlight.has(String(item._id));
  }

  addComment(item: ContentItem): void {
    const id = String(item._id);

    const text = (
      this.commentDrafts[id] ?? ''
    ).trim();

    if (
      !text ||
      !this.userData?._id ||
      this.commentInFlight.has(id)
    ) {
      return;
    }

    this.commentInFlight.add(id);
    delete this.postMessages[id];

    this.cdr.markForCheck();

    this.postsService
      .addComment(item._id, item.type, text)
      .pipe(
        takeUntil(this.destroy$),

        finalize(() => {
          this.commentInFlight.delete(id);
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (response) => {
          if (!response?.success || !response.data) {
            this.postMessages[id] =
              'Your comment could not be posted. Please try again.';

            this.cdr.markForCheck();
            return;
          }

          item.commentsCount =
            response.data.commentsCount ??
            (item.commentsCount ?? 0) + 1;

          /*
           * Keep the draft if it somehow changed during
           * the request.
           */
          if ((this.commentDrafts[id] ?? '').trim() === text) {
            this.commentDrafts[id] = '';
          }

          const ownerId = item.createdBy?._id;

          if (
            ownerId &&
            String(ownerId) !== String(this.userData?._id)
          ) {
            this.socket.emit('notification', {
              eventName: 'comment',
              type: item.type,
              data: this.userData?._id,
              to: ownerId,
              redirect: item._id,
            });
          }

          this.cdr.markForCheck();
        },

        error: () => {
          this.postMessages[id] =
            'Unable to post your comment. Please try again.';

          this.cdr.markForCheck();
        },
      });
  }

  /* =====================================================
     SHARE
  ===================================================== */

  async sharePost(item: ContentItem): Promise<void> {
    const id = String(item._id);

    const postText = item.caption
      ? `${item.createdBy?.userName || 'Instagram user'}: ${item.caption}`
      : `Post by ${item.createdBy?.userName || 'Instagram user'}`;

    const url = window.location.href;

    delete this.postMessages[id];

    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({
          title: 'Share post',
          text: postText,
          url,
        });

        this.postMessages[id] = 'Share action completed.';
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(
          `${postText}\n\n${url}`,
        );

        this.postMessages[id] =
          'Post text and page link copied to the clipboard.';
      } else {
        this.postMessages[id] =
          'Sharing is not supported by this browser.';
      }
    } catch (error) {
      const errorName =
        (error as DOMException | undefined)?.name;

      /*
       * Canceling the native share dialog is not an error
       * that should be shown to the user.
       */
      if (errorName !== 'AbortError') {
        this.postMessages[id] =
          'Unable to share this post from the current browser.';
      }
    } finally {
      this.cdr.markForCheck();
    }
  }

  /* =====================================================
     POST DETAILS MODAL
  ===================================================== */

  openPost(item: ContentItem): void {
    this.option = false;
    this.displayPost = item;

    this.cdr.markForCheck();
  }

  closePost(): void {
    this.displayPost = undefined;

    this.cdr.markForCheck();
  }

  /* =====================================================
     IMAGE FALLBACK
  ===================================================== */

  onImgError(event: Event): void {
    const image = event.target as HTMLImageElement;

    /*
     * Avoid retrying the fallback indefinitely if the
     * placeholder asset itself is missing.
     */
    if (image.dataset['fallbackApplied'] === 'true') {
      image.style.visibility = 'hidden';
      return;
    }

    image.dataset['fallbackApplied'] = 'true';

    image.src = './assets/imgs/placeholder.png';
  }

  /* =====================================================
     TRACK BY
  ===================================================== */

  trackById(
    _: number,
    item: ContentItem,
  ): string {
    return String(item._id);
  }

  trackByStory(
    _: number,
    item: any,
  ): string {
    return String(item._id);
  }

  trackByIndex(index: number): number {
    return index;
  }

  /* =====================================================
     KEYBOARD
  ===================================================== */

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.storyOpened) {
      this.closeStory();
      return;
    }

    if (this.displayPost) {
      this.closePost();
      return;
    }

    if (this.option) {
      this.option = false;
      this.cdr.markForCheck();
    }
  }
  openMedia(item: ContentItem, event?: Event): void {
    event?.stopPropagation();

    if (item.type === 'reel') {
      this.openReel(item);
      return;
    }

    this.openPost(item);
  }

  openReel(item: ContentItem): void {
    void this.router.navigate(['/reels'], {
      state: {
        focusReelId: String(item._id),
        focusReel: item,
      },
    });
  }


  /* =====================================================
     CLEANUP
  ===================================================== */

  ngOnDestroy(): void {
    this.releaseUploadPreview();

    this.destroy$.next();
    this.destroy$.complete();
  }
}