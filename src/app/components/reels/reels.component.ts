import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import {
  Subject,
  finalize,
  fromEvent,
  takeUntil,
  throttleTime,
} from 'rxjs';

import {
  ContentItem,
  CurrentUser,
} from '../../core/models/api.models';

import { PostsService } from '../../services/posts.service';
import { ReelService } from '../../services/reel.service';
import { SharingService } from '../../services/sharing.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-reels',
  templateUrl: './reels.component.html',
  styleUrls: ['./reels.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReelsComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('reelsContainer', { static: false })
  reelsContainerRef?: ElementRef<HTMLElement>;

  /* =====================================================
     FEED STATE
  ===================================================== */
  private focusReel?: ContentItem;
  private focusReelId: string | null = null;
  reels: ContentItem[] = [];

  userData: CurrentUser | null = null;

  loading = true;

  loadingPage = false;

  hasMore = true;

  page = 1;

  readonly pageSize = 10;

  loadError: string | null = null;

  displayComments = -1;

  /* =====================================================
     USER FEEDBACK
  ===================================================== */

  readonly reelMessages: Record<string, string> =
    Object.create(null) as Record<string, string>;

  /* =====================================================
     REQUEST GUARDS
  ===================================================== */

  private readonly destroy$ = new Subject<void>();

  private readonly likeInFlight = new Set<string>();

  private readonly saveInFlight = new Set<string>();

  private readonly savedIds = new Set<string>();

  /* =====================================================
     VIDEO STATE
  ===================================================== */

  private intersectionObserver?: IntersectionObserver;

  private readonly playingIds = new Set<string>();

  private readonly manuallyPaused = new Set<string>();

  private readonly mutedByReel = new Map<string, boolean>();

  private readonly unavailableVideoIds = new Set<string>();
  private activeReelId: string | null = null;
  private observeElementsTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly videoProgress: Record<string, number> =
    Object.create(null) as Record<string, number>;

  private readonly expandedCaptions = new Set<string>();

  private retryPage = 1;

  constructor(
    private readonly ngZone: NgZone,
    private readonly cdr: ChangeDetectorRef,
    private readonly sharing: SharingService,
    private readonly postService: PostsService,
    private readonly reelService: ReelService,
    private readonly userService: UserService,
  ) { }

  /* =====================================================
     LIFECYCLE
  ===================================================== */

  ngOnInit(): void {
    const navigationState = (history.state ?? {}) as {
      focusReel?: ContentItem;
      focusReelId?: string;
    };

    this.focusReel = navigationState.focusReel;
    this.focusReelId =
      navigationState.focusReelId ??
      (navigationState.focusReel
        ? String(navigationState.focusReel._id)
        : null);

    this.sharing.currentUserData
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.userData = user;
        this.cdr.markForCheck();
      });

    this.sharing.currentSaved
      .pipe(takeUntil(this.destroy$))
      .subscribe((saved) => {
        this.savedIds.clear();

        (saved?.items ?? []).forEach((item) => {
          this.savedIds.add(String(item._id));
        });

        this.cdr.markForCheck();
      });

    this.loadPage(1);
  }

  ngAfterViewInit(): void {
    const container =
      this.reelsContainerRef?.nativeElement;

    if (!container) {
      return;
    }

    /*
     * Scroll handling outside Angular reduces unnecessary
     * change-detection work while swiping through Reels.
     */
    this.ngZone.runOutsideAngular(() => {
      fromEvent(container, 'scroll', { passive: true })
        .pipe(
          throttleTime(160),
          takeUntil(this.destroy$),
        )
        .subscribe(() => {
          // Keep playback synchronized with the Reel most visible in the scroll viewport.
          this.playMostVisibleReel();

          const nearBottom =
            container.scrollTop + container.clientHeight >=
            container.scrollHeight - 450;

          if (nearBottom) {
            this.ngZone.run(() => {
              this.loadNextPage();
            });
          }
        });
    });

    this.setupIntersectionObserver();
    this.observeReelElements();
  }

  /* =====================================================
     PAGINATION
  ===================================================== */

  private loadPage(requestedPage: number): void {
    if (
      this.loadingPage ||
      (!this.hasMore && requestedPage !== 1)
    ) {
      return;
    }

    this.loadingPage = true;

    this.loading =
      requestedPage === 1 && this.reels.length === 0;

    this.retryPage = requestedPage;
    this.loadError = null;

    this.cdr.markForCheck();

    this.reelService
      .getAllReels(requestedPage, this.pageSize)
      .pipe(
        takeUntil(this.destroy$),

        finalize(() => {
          this.loading = false;
          this.loadingPage = false;

          this.cdr.markForCheck();

          /*
           * New DOM elements need to be observed after rendering.
           */
          this.scheduleObserveReelElements();
        }),
      )
      .subscribe({
        next: (response) => {
          if (!response?.success || !response.data) {
            this.loadError =
              'The server did not return the expected Reels data.';

            this.cdr.markForCheck();
            return;
          }

          const data = response.data;

          const incoming: ContentItem[] =
            Array.isArray(data.reels)
              ? data.reels
              : [];

          /*
           * Prevent duplicate items, including duplicates inside
           * a single API response.
           */
          const knownIds = new Set<string>(
            requestedPage === 1
              ? []
              : this.reels.map((item) => String(item._id)),
          );

          const uniqueIncoming = incoming.filter((item) => {
            const id = String(item._id);

            if (knownIds.has(id)) {
              return false;
            }

            knownIds.add(id);

            return true;
          });
          let pageItems = uniqueIncoming;

          if (requestedPage === 1 && this.focusReelId) {
            const selectedReel =
              pageItems.find(
                (item) =>
                  String(item._id) === this.focusReelId,
              ) ??
              (this.focusReel &&
                String(this.focusReel._id) === this.focusReelId
                ? this.focusReel
                : undefined);

            if (selectedReel) {
              pageItems = [
                selectedReel,
                ...pageItems.filter(
                  (item) =>
                    String(item._id) !==
                    String(selectedReel._id),
                ),
              ];
            }

            this.focusReel = undefined;
            this.focusReelId = null;
          }

          this.reels =
            requestedPage === 1
              ? pageItems
              : [...this.reels, ...pageItems];

          this.page =
            typeof data.page === 'number'
              ? data.page
              : requestedPage;

          this.hasMore =
            typeof data.hasMore === 'boolean'
              ? data.hasMore
              : incoming.length >= this.pageSize;
          this.retryPage = this.page + 1;

          this.loadError = null;

          /*
           * Refresh saved content on the first page only.
           */
          if (requestedPage === 1) {
            this.sharing.updateSaved(false);
          }

          this.cdr.markForCheck();
        },

        error: () => {
          /*
           * Do not set hasMore to false after a network error:
           * that would prevent the user from retrying.
           */
          this.loadError =
            'Unable to load Reels. Check your connection and try again.';

          this.cdr.markForCheck();
        },
      });
  }

  loadNextPage(): void {
    if (this.loadingPage || !this.hasMore) {
      return;
    }

    if (this.displayComments !== -1) {
      return;
    }

    this.loadPage(this.page + 1);
  }

  retryLoad(): void {
    this.loadError = null;

    const targetPage =
      this.reels.length === 0
        ? 1
        : this.retryPage;

    if (targetPage === 1) {
      this.hasMore = true;
    }

    this.loadPage(targetPage);
  }

  refresh(): void {
    if (this.loadingPage) {
      return;
    }

    /*
     * Pause existing videos before resetting the feed.
     */
    this.pauseAllVideos();

    this.reels = [];
    this.page = 1;
    this.hasMore = true;
    this.retryPage = 1;
    this.loadError = null;
    this.displayComments = -1;
    this.activeReelId = null;

    this.playingIds.clear();
    this.manuallyPaused.clear();
    this.unavailableVideoIds.clear();
    this.expandedCaptions.clear();

    this.loadPage(1);
  }

  /* =====================================================
     VIDEO INTERSECTION OBSERVER
  ===================================================== */

  private setupIntersectionObserver(): void {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const container = this.reelsContainerRef?.nativeElement;
    if (!container) {
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      () => {
        this.playMostVisibleReel();
      },
      {
        root: container,
        threshold: [0, 0.25, 0.5, 0.6, 0.85],
      },
    );
  }

  /**
   * Angular's OnPush view can render after the HTTP subscription's
   * microtask. Defer observation to the next timer turn so the .reel
   * elements are present before calling observe().
   */
  private scheduleObserveReelElements(): void {
    if (this.observeElementsTimer !== null) {
      clearTimeout(this.observeElementsTimer);
    }

    this.observeElementsTimer = setTimeout(() => {
      this.observeElementsTimer = null;

      if (this.destroy$.closed) {
        return;
      }

      this.observeReelElements();
      this.playMostVisibleReel();
    }, 0);
  }

  private observeReelElements(): void {
    if (!this.intersectionObserver) {
      return;
    }

    const container = this.reelsContainerRef?.nativeElement;
    if (!container) {
      return;
    }

    this.intersectionObserver.disconnect();

    container
      .querySelectorAll<HTMLElement>('.reel[data-reel-id]')
      .forEach((element) => this.intersectionObserver?.observe(element));
  }

  /**
   * Pick the Reel occupying the largest share of the scroll viewport.
   * This makes autoplay work both on touch swipes and desktop scrolling,
   * without depending only on IntersectionObserver callback timing.
   */
  private playMostVisibleReel(): void {
    const container = this.reelsContainerRef?.nativeElement;
    if (!container || !this.reels.length) {
      return;
    }

    if (this.displayComments !== -1) {
      this.pauseAllVideos();
      return;
    }

    const viewport = container.getBoundingClientRect();
    if (viewport.height <= 0) {
      return;
    }

    let candidate:
      | { item: ContentItem; video: HTMLVideoElement; ratio: number }
      | undefined;

    const articles = container.querySelectorAll<HTMLElement>('.reel[data-reel-id]');
    for (const article of Array.from(articles)) {
      const id = article.dataset['reelId'];
      if (!id) {
        continue;
      }

      const item = this.reels.find((reel) => String(reel._id) === id);
      const video = article.querySelector<HTMLVideoElement>('video.reel-video');

      if (!item || !video || this.isVideoUnavailable(item)) {
        continue;
      }

      const rect = article.getBoundingClientRect();
      const visibleHeight = Math.max(
        0,
        Math.min(rect.bottom, viewport.bottom) - Math.max(rect.top, viewport.top),
      );
      const ratio = rect.height > 0 ? visibleHeight / rect.height : 0;

      if (!candidate || ratio > candidate.ratio) {
        candidate = { item, video, ratio };
      }
    }

    // During the transition between snapped Reels, pause rather than leaving
    // the previous video playing off-screen.
    if (!candidate || candidate.ratio < 0.5) {
      if (this.activeReelId) {
        this.manuallyPaused.delete(this.activeReelId);
      }
      this.activeReelId = null;
      this.pauseAllVideos();
      return;
    }

    const { item, video } = candidate;
    const id = String(item._id);

    if (this.activeReelId && this.activeReelId !== id) {
      // A manual pause applies only until the user scrolls away from that Reel.
      this.manuallyPaused.delete(this.activeReelId);
    }
    this.activeReelId = id;

    // Never let multiple Reels continue playing simultaneously.
    container
      .querySelectorAll<HTMLVideoElement>('video.reel-video')
      .forEach((otherVideo) => {
        if (otherVideo !== video && !otherVideo.paused) {
          otherVideo.pause();
        }
      });

    if (this.manuallyPaused.has(id) || !video.paused) {
      return;
    }

    this.startAutoplay(item, video);
  }

  private startAutoplay(item: ContentItem, video: HTMLVideoElement): void {
    const id = String(item._id);

    // Muted inline playback is permitted by more browsers during autoplay.
    video.playsInline = true;
    video.muted = this.isMuted(item);

    const handlePlaybackFailure = (): void => {
      // Ignore failures from a Reel that has already moved out of view.
      if (
        this.activeReelId !== id ||
        this.displayComments !== -1 ||
        !video.isConnected
      ) {
        return;
      }

      // If autoplay was blocked because the Reel had sound, retry muted.
      if (!video.muted) {
        video.muted = true;
        this.mutedByReel.set(id, true);
        this.cdr.markForCheck();

        video.play().catch(() => {
          this.ngZone.run(() => {
            this.playingIds.delete(id);
            this.cdr.markForCheck();
          });
        });
        return;
      }

      this.ngZone.run(() => {
        this.playingIds.delete(id);
        this.cdr.markForCheck();
      });
    };

    try {
      video.play().catch(handlePlaybackFailure);
    } catch {
      handlePlaybackFailure();
    }
  }

  /* =====================================================
     VIDEO URL / POSTER
  ===================================================== */

  private normalizeMediaUrl(value: unknown): string {
    if (typeof value !== 'string') {
      return '';
    }

    const raw = value.trim();
    // Recover direct URLs if a seed/API value was stored as Markdown:
    // [https://example.com/video.mp4](https://example.com/video.mp4)
    const markdownLink = raw.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/i);
    return (markdownLink?.[2] || raw).trim();
  }

  videoUrl(item: ContentItem): string {
    const videoMedia = item.postsImgAndVideos?.find(
      (media) => media.type === 'video' && media.url,
    );

    return this.normalizeMediaUrl(
      item.url ||
      videoMedia?.url ||
      item.postsImgAndVideos?.[0]?.url ||
      '',
    );
  }

  posterUrl(item: ContentItem): string | null {
    /*
     * Use an actual video thumbnail/media image when available.
     * Do not fall back to the creator avatar; that makes a Reel look
     * like a profile picture until the first video frame is decoded.
     */
    const extendedItem = item as ContentItem & {
      thumbnail?: string;
      thumbnailUrl?: string;
      poster?: string;
      coverUrl?: string;
    };

    const imageMedia = item.postsImgAndVideos?.find(
      (media) => media.type === 'image' && media.url,
    );

    const poster =
      extendedItem.thumbnailUrl ||
      extendedItem.thumbnail ||
      extendedItem.poster ||
      extendedItem.coverUrl ||
      imageMedia?.url;

    return this.normalizeMediaUrl(poster) || null;
  }

  isVideoUnavailable(item: ContentItem): boolean {
    return this.unavailableVideoIds.has(
      String(item._id),
    );
  }

  onVideoError(item: ContentItem): void {
    const id = String(item._id);

    this.unavailableVideoIds.add(id);
    this.playingIds.delete(id);

    this.cdr.markForCheck();
  }

  retryVideo(item: ContentItem): void {
    const id = String(item._id);

    this.unavailableVideoIds.delete(id);
    delete this.reelMessages[id];

    this.videoProgress[id] = 0;

    this.cdr.markForCheck();

    this.scheduleObserveReelElements();
  }

  /* =====================================================
     PLAYBACK STATE
  ===================================================== */

  isPlaying(item: ContentItem): boolean {
    return this.playingIds.has(String(item._id));
  }

  isPaused(item: ContentItem): boolean {
    return !this.isPlaying(item);
  }

  onVideoPlay(item: ContentItem): void {
    this.playingIds.add(String(item._id));
    this.cdr.markForCheck();
  }

  onVideoPause(item: ContentItem): void {
    this.playingIds.delete(String(item._id));
    this.cdr.markForCheck();
  }

  togglePlayback(
    item: ContentItem,
    video: HTMLVideoElement,
    event?: Event,
  ): void {
    event?.stopPropagation();

    const id = String(item._id);

    if (this.isVideoUnavailable(item)) {
      return;
    }

    if (video.paused) {
      this.manuallyPaused.delete(id);
      this.activeReelId = id;
      video.muted = this.isMuted(item);

      video.play().catch(() => {
        this.manuallyPaused.add(id);

        this.reelMessages[id] =
          'Playback was blocked. Tap play to try again.';

        this.cdr.markForCheck();
      });
    } else {
      this.manuallyPaused.add(id);
      this.activeReelId = id;
      video.pause();
    }

    this.cdr.markForCheck();
  }

  /* =====================================================
     MUTE / UNMUTE
  ===================================================== */

  isMuted(item: ContentItem): boolean {
    return this.mutedByReel.get(String(item._id)) ?? true;
  }

  toggleMute(
    item: ContentItem,
    video: HTMLVideoElement,
    event: Event,
  ): void {
    event.stopPropagation();

    const id = String(item._id);

    const nextMutedState = !video.muted;

    video.muted = nextMutedState;

    this.mutedByReel.set(id, nextMutedState);

    this.cdr.markForCheck();
  }

  /* =====================================================
     VIDEO PROGRESS
  ===================================================== */

  updateProgress(
    item: ContentItem,
    video: HTMLVideoElement,
  ): void {
    const duration = video.duration;

    if (
      !Number.isFinite(duration) ||
      duration <= 0
    ) {
      return;
    }

    const progress = Math.min(
      100,
      Math.max(
        0,
        Math.floor((video.currentTime / duration) * 100),
      ),
    );

    const id = String(item._id);

    /*
     * Update only when the displayed percentage changes.
     */
    if (this.videoProgress[id] === progress) {
      return;
    }

    this.videoProgress[id] = progress;

    this.cdr.markForCheck();
  }

  progressFor(item: ContentItem): number {
    return this.videoProgress[String(item._id)] ?? 0;
  }

  /* =====================================================
     CAPTION
  ===================================================== */

  isCaptionExpanded(item: ContentItem): boolean {
    return this.expandedCaptions.has(String(item._id));
  }

  toggleCaption(
    item: ContentItem,
    event: Event,
  ): void {
    event.stopPropagation();

    const id = String(item._id);

    if (this.expandedCaptions.has(id)) {
      this.expandedCaptions.delete(id);
    } else {
      this.expandedCaptions.add(id);
    }

    this.cdr.markForCheck();
  }

  /* =====================================================
     COMMENTS
  ===================================================== */

  openComments(
    index: number,
    item: ContentItem,
  ): void {
    if (this.displayComments === index) {
      this.closeComments();
      return;
    }

    this.displayComments = index;

    const container =
      this.reelsContainerRef?.nativeElement;

    const article =
      container?.querySelectorAll<HTMLElement>('.reel')[index];

    article
      ?.querySelector<HTMLVideoElement>('video.reel-video')
      ?.pause();

    this.cdr.markForCheck();
  }

  closeComments(): void {
    this.displayComments = -1;

    this.cdr.markForCheck();

    /*
     * Re-observing visible Reels restores autoplay when the
     * comments drawer is closed.
     */
    this.scheduleObserveReelElements();
  }

  /* =====================================================
     LIKE
  ===================================================== */

  isLikePending(item: ContentItem): boolean {
    return this.likeInFlight.has(String(item._id));
  }

  addReelLike(item: ContentItem): void {
    const id = String(item._id);

    if (this.likeInFlight.has(id)) {
      return;
    }

    if (!this.userData?._id) {
      this.reelMessages[id] = 'Sign in to like this Reel.';
      this.cdr.markForCheck();
      return;
    }

    const previous = {
      liked: Boolean(item.viewerLiked),
      count: Number(item.likesCount ?? 0),
    };

    /*
     * Optimistic update.
     */
    item.viewerLiked = !previous.liked;

    item.likesCount = Math.max(
      0,
      previous.count + (item.viewerLiked ? 1 : -1),
    );

    this.likeInFlight.add(id);
    delete this.reelMessages[id];

    this.cdr.markForCheck();

    this.postService
      .like(item._id, 'reel')
      .pipe(
        takeUntil(this.destroy$),

        finalize(() => {
          this.likeInFlight.delete(id);
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (response) => {
          if (response?.success && response.data) {
            item.viewerLiked = response.data.liked;
            item.likesCount = response.data.likesCount;
          } else {
            this.restoreLikeState(
              item,
              previous.liked,
              previous.count,
            );

            this.reelMessages[id] =
              'Unable to update your like. Please try again.';
          }

          this.cdr.markForCheck();
        },

        error: () => {
          this.restoreLikeState(
            item,
            previous.liked,
            previous.count,
          );

          this.reelMessages[id] =
            'Unable to update your like. Check your connection.';

          this.cdr.markForCheck();
        },
      });
  }

  private restoreLikeState(
    item: ContentItem,
    liked: boolean,
    count: number,
  ): void {
    item.viewerLiked = liked;
    item.likesCount = count;
  }

  /* =====================================================
     SAVE / UNSAVE
  ===================================================== */

  isSavePending(item: ContentItem): boolean {
    return this.saveInFlight.has(String(item._id));
  }

  isSaved(item: ContentItem): boolean {
    return this.savedIds.has(String(item._id));
  }

  saveReel(item: ContentItem): void {
    const id = String(item._id);

    if (this.saveInFlight.has(id)) {
      return;
    }

    if (!this.userData?._id) {
      this.reelMessages[id] = 'Sign in to save this Reel.';
      this.cdr.markForCheck();
      return;
    }

    const wasSaved = this.savedIds.has(id);

    /*
     * Optimistic update.
     */
    if (wasSaved) {
      this.savedIds.delete(id);
    } else {
      this.savedIds.add(id);
    }

    this.saveInFlight.add(id);
    delete this.reelMessages[id];

    this.cdr.markForCheck();

    this.userService
      .savePost(item._id, 'Reel')
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

            this.reelMessages[id] =
              'Unable to save this Reel. Please try again.';

            this.cdr.markForCheck();
            return;
          }

          const saved = Boolean(
            response.data?.saved ?? !wasSaved,
          );

          if (saved) {
            this.savedIds.add(id);
          } else {
            this.savedIds.delete(id);
          }

          this.sharing.upsertSavedLocally(item, saved);

          this.cdr.markForCheck();
        },

        error: () => {
          this.restoreSavedState(id, wasSaved);

          this.reelMessages[id] =
            'Unable to update saved Reels. Check your connection.';

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
     CREATOR PROFILE
  ===================================================== */

  openUser(id: string | undefined | null): void {
    if (!id) {
      return;
    }

    this.sharing.toUser(id);
  }

  /* =====================================================
     DISPLAY HELPERS
  ===================================================== */

  formatCount(value: number | null | undefined): string {
    const count = Math.max(0, Number(value) || 0);

    if (count >= 1_000_000) {
      return `${this.trimDecimal(count / 1_000_000)}M`;
    }

    if (count >= 1_000) {
      return `${this.trimDecimal(count / 1_000)}K`;
    }

    return String(Math.floor(count));
  }

  private trimDecimal(value: number): string {
    return value.toFixed(1).replace(/\.0$/, '');
  }

  trackByReel(
    _: number,
    item: ContentItem,
  ): string {
    return String(item._id);
  }

  /* =====================================================
     KEYBOARD / CLEANUP
  ===================================================== */

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.displayComments !== -1) {
      this.closeComments();
    }
  }

  private pauseAllVideos(): void {
    const container =
      this.reelsContainerRef?.nativeElement;

    container
      ?.querySelectorAll<HTMLVideoElement>('video.reel-video')
      .forEach((video) => video.pause());
  }

  onAvatarError(event: Event): void {
    const image = event.target as HTMLImageElement;

    if (image.dataset['fallbackApplied'] === 'true') {
      image.style.visibility = 'hidden';
      return;
    }

    image.dataset['fallbackApplied'] = 'true';
    image.src = './assets/imgs/placeholder.png';
  }

  ngOnDestroy(): void {
    this.pauseAllVideos();

    if (this.observeElementsTimer !== null) {
      clearTimeout(this.observeElementsTimer);
      this.observeElementsTimer = null;
    }

    this.destroy$.next();
    this.destroy$.complete();

    this.intersectionObserver?.disconnect();
  }
}
