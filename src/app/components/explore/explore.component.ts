import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';

import {
  Subject,
  finalize,
  takeUntil,
} from 'rxjs';

import {
  ContentItem,
  CurrentUser,
} from '../../core/models/api.models';

import { PostsService } from '../../services/posts.service';
import { SharingService } from '../../services/sharing.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreComponent implements OnInit, OnDestroy {
  /* =====================================================
     DATA
  ===================================================== */

  items: ContentItem[] = [];

  selected?: ContentItem;

  userData: CurrentUser | null = null;

  readonly limit = 24;

  readonly skeletonCards = Array.from(
    { length: 12 },
    (_, index) => index,
  );

  /* =====================================================
     PAGINATION
  ===================================================== */

  loading = true;

  loadingMore = false;

  page = 1;

  hasMore = true;

  loadError: string | null = null;

  /* =====================================================
     MEDIA STATE
  ===================================================== */

  private readonly unavailableVideoIds = new Set<string>();

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly postsService: PostsService,
    private readonly sharing: SharingService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  /* =====================================================
     LIFECYCLE
  ===================================================== */

  ngOnInit(): void {
    this.sharing.currentUserData
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.userData = user;
        this.cdr.markForCheck();
      });

    this.load();
  }

  /* =====================================================
     LOAD EXPLORE POSTS
  ===================================================== */

  load(): void {
    if (this.loadingMore || !this.hasMore) {
      return;
    }

    const requestedPage = this.page;

    this.loading = this.items.length === 0;
    this.loadingMore = true;
    this.loadError = null;

    this.cdr.markForCheck();

    this.postsService
      .getExplorePosts(requestedPage, this.limit)
      .pipe(
        takeUntil(this.destroy$),

        finalize(() => {
          this.loading = false;
          this.loadingMore = false;

          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (response) => {
          if (!response?.success || !response.data) {
            this.loadError =
              'The server did not return the expected content.';

            this.cdr.markForCheck();
            return;
          }

          const data = response.data;

          const incomingItems: ContentItem[] =
            Array.isArray(data.items)
              ? data.items
              : [];

          /*
           * Prevent duplicates when loading subsequent pages.
           */
          const existingIds = new Set<string>(
            requestedPage === 1
              ? []
              : this.items.map((item) => String(item._id)),
          );

          const uniqueItems = incomingItems.filter((item) => {
            const id = String(item._id);

            if (existingIds.has(id)) {
              return false;
            }

            existingIds.add(id);

            return true;
          });

          this.items =
            requestedPage === 1
              ? uniqueItems
              : [...this.items, ...uniqueItems];

          /*
           * Use server pagination metadata when available.
           */
          this.hasMore =
            typeof data.hasMore === 'boolean'
              ? data.hasMore
              : incomingItems.length >= this.limit;

          /*
           * Never advance the current page after a failed request.
           */
          this.page =
            (typeof data.page === 'number'
              ? data.page
              : requestedPage) + 1;

          this.loadError = null;

          this.cdr.markForCheck();
        },

        error: () => {
          /*
           * Keep hasMore unchanged so this page can be retried.
           */
          this.loadError =
            'Unable to load posts. Check your connection and try again.';

          this.cdr.markForCheck();
        },
      });
  }

  /**
   * Retry the failed request.
   */
  retry(): void {
    this.loadError = null;

    /*
     * If the first request returned an empty result and marked
     * the feed as complete, permit an explicit refresh.
     */
    if (!this.items.length) {
      this.page = 1;
      this.hasMore = true;
    }

    this.load();
  }

  /**
   * Refresh from the first page.
   */
  refresh(): void {
    if (this.loadingMore) {
      return;
    }

    this.items = [];
    this.page = 1;
    this.hasMore = true;
    this.loadError = null;

    this.unavailableVideoIds.clear();

    this.loading = true;

    this.cdr.markForCheck();

    this.load();
  }

  /* =====================================================
     INFINITE SCROLL
  ===================================================== */

  onScroll(event: Event): void {
    if (this.selected) {
      return;
    }

    const element = event.currentTarget as HTMLElement | null;

    if (!element) {
      return;
    }

    const nearBottom =
      element.scrollTop + element.clientHeight >=
      element.scrollHeight - 500;

    if (nearBottom) {
      this.load();
    }
  }

  /* =====================================================
     FEATURED GRID ITEMS
  ===================================================== */

  /**
   * Add visual variety to the grid without changing its data.
   */
  isFeatured(index: number): boolean {
    const position = index % 12;

    return position === 2 || position === 9;
  }

  /* =====================================================
     MEDIA HELPERS
  ===================================================== */

  mediaUrl(item: ContentItem): string {
    if (item.type === 'reel') {
      return item.url || '';
    }

    return (
      item.postsImgAndVideos?.[0]?.url ||
      item.url ||
      './assets/imgs/placeholder.png'
    );
  }

  isVideo(item: ContentItem): boolean {
    return (
      item.type === 'reel' ||
      item.postsImgAndVideos?.[0]?.type === 'video'
    );
  }

  isCarousel(item: ContentItem): boolean {
    return (
      item.type !== 'reel' &&
      (item.postsImgAndVideos?.length ?? 0) > 1
    );
  }

  isVideoUnavailable(item: ContentItem): boolean {
    return this.unavailableVideoIds.has(
      String(item._id),
    );
  }

  /**
   * Play a muted preview on desktop hover.
   */
  previewVideo(event: Event): void {
    const video = event.currentTarget as HTMLVideoElement | null;

    if (!video) {
      return;
    }

    video.muted = true;

    void video.play().catch(() => {
      // Autoplay may be blocked by the browser.
    });
  }

  /**
   * Stop previews when the pointer leaves a card.
   */
  pausePreview(event: Event): void {
    const video = event.currentTarget as HTMLVideoElement | null;

    if (!video) {
      return;
    }

    video.pause();

    try {
      video.currentTime = 0;
    } catch {
      // Ignore when metadata is not available.
    }
  }

  /**
   * Track unavailable videos so their cards show a fallback.
   */
  onVideoError(item: ContentItem): void {
    this.unavailableVideoIds.add(String(item._id));

    this.cdr.markForCheck();
  }

  /**
   * Replace broken image URLs with the project placeholder.
   * Prevent a failed placeholder from triggering an endless loop.
   */
  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement | null;

    if (!image) {
      return;
    }

    if (image.dataset['fallbackApplied'] === 'true') {
      image.style.visibility = 'hidden';
      return;
    }

    image.dataset['fallbackApplied'] = 'true';
    image.src = './assets/imgs/placeholder.png';
  }

  /* =====================================================
     OPEN / CLOSE POST
  ===================================================== */

  open(item: ContentItem): void {
    this.selected = item;

    this.cdr.markForCheck();
  }

  close(): void {
    this.selected = undefined;

    this.cdr.markForCheck();
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.selected) {
      this.close();
    }
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

  /* =====================================================
     CLEANUP
  ===================================================== */

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
