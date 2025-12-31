import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { fromEvent, Subject, timer } from 'rxjs';
import { throttleTime, takeUntil } from 'rxjs/operators';
import { PostsService } from 'src/app/services/posts.service';
import { SharingService } from 'src/app/services/sharing.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reels',
  templateUrl: './reels.component.html',
  styleUrls: ['./reels.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReelsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('reelsContainer', { static: false }) reelsContainerRef!: ElementRef;

  reels: any[] = [];
  page = 0;
  userData: any;
  loading = true;
  arr: string[] = []; // saved reel ids
  displayComments = -1;

  private destroy$ = new Subject<void>();
  private intersectionObserver?: IntersectionObserver;
  private likeInFlight = new Set<string>();
  private saveInFlight = new Set<string>();
  private loadThreshold = 300;

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private _sharing: SharingService,
    private _post: PostsService,
    private _UserService: UserService
  ) {}

  ngOnInit(): void {
    this._sharing.currentUserData.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      this.userData = data;
      if (data?.savedReels) {
        this.arr = data.savedReels.map((s: any) => s._id);
      } else {
        this.arr = [];
      }
      this.cdr.markForCheck();
    });

    this._sharing.updateReel(this.page);

    this._sharing.currentReels.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      if (Array.isArray(data) && data.length) {
        const existingIds = new Set(this.reels.map(r => r._id));
        const newItems = data.filter((r: any) => !existingIds.has(r._id));
        this.reels = this.reels.concat(newItems);
        this.loading = false
      } else if (this.reels.length === 0) {
      }
      this.cdr.markForCheck();
      this.observeReelElements();
    });
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      const container = this.reelsContainerRef?.nativeElement;
      if (!container) return;

      fromEvent(container, 'scroll')
        .pipe(throttleTime(200), takeUntil(this.destroy$))
        .subscribe(() => {
          this.ngZone.run(() => this.handleScroll());
        });
    });

    this.intersectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const reelEl = entry.target as HTMLElement;
          const video = reelEl.querySelector('video') as HTMLVideoElement | null;
          if (!video) return;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            video
              .play()
              .catch(() => {
              });
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: [0.4, 0.6, 0.8],
      }
    );

    this.observeReelElements();
  }

  
  private observeReelElements() {
    if (!this.intersectionObserver) return;
    this.intersectionObserver.disconnect();

    const container: HTMLElement | null = this.reelsContainerRef?.nativeElement || null;
    if (!container) return;
    const reelEls = Array.from(container.querySelectorAll('.reel')) as HTMLElement[];
    reelEls.forEach(el => this.intersectionObserver!.observe(el));
  }

 
  handleScroll() {
    const container: HTMLElement | null = this.reelsContainerRef?.nativeElement || null;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const clientHeight = container.clientHeight;
    const scrollHeight = container.scrollHeight;

    if (scrollTop + clientHeight >= scrollHeight - this.loadThreshold) {
      this.loadNextPage();
    }
  }

  private loadingPage = false;
  private loadNextPage() {
    if (this.loadingPage) return;
    this.loadingPage = true;
    this.page += 1;
    this._sharing.updateReel(this.page);

    timer(1500)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadingPage = false;
      });
  }


  addReelLike(item: any, index: number) {
    if (!this.userData?._id) return;
    const reelId = item?._id;
    if (!reelId) return;

    if (this.likeInFlight.has(reelId)) return;
    this.likeInFlight.add(reelId);

    const userId = this.userData._id;
    const likes: string[] = this.reels[index].likes || [];
    const hasLiked = likes.includes(userId);

    if (!hasLiked) {
      this.reels[index].likes = [...likes, userId];
    } else {
      this.reels[index].likes = likes.filter((id: string) => id !== userId);
    }
    this.cdr.markForCheck();

    const payload = { _id: reelId, type: 'reel' };
    this._post.like(payload).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if (res?.success && res.newItem) {
          this.reels[index].likes = res.newItem.likes || [];
        } else {
          if (hasLiked) {
            this.reels[index].likes = [...likes]; 
          } else {
            this.reels[index].likes = [...likes];
          }
        }
        this.likeInFlight.delete(reelId);
        this.cdr.markForCheck();
      },
      error: () => {
        this.reels[index].likes = likes;
        this.likeInFlight.delete(reelId);
        this.cdr.markForCheck();
      },
    });
  }


  saveReel(id: string) {
    if (!this.userData?._id || !id) return;

    if (this.saveInFlight.has(id)) return;
    this.saveInFlight.add(id);

    const data = { postId: id, ref: 'Reel' };

    const already = this.arr.includes(id);
    if (!already) {
      this.arr = [...this.arr, id];
    } else {
      this.arr = this.arr.filter(i => i !== id);
    }
    this.cdr.markForCheck();

    this._UserService.savePost(data).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this._sharing.updateUserData();
        } else {
          if (!already) {
            this.arr = this.arr.filter(i => i !== id);
          } else {
            this.arr = [...this.arr, id];
          }
          this.cdr.markForCheck();
        }
        this.saveInFlight.delete(id);
      },
      error: () => {
        if (!already) {
          this.arr = this.arr.filter(i => i !== id);
        } else {
          this.arr = [...this.arr, id];
        }
        this.saveInFlight.delete(id);
        this.cdr.markForCheck();
      },
    });
  }


  ifSaved(id: string) {
    return this.arr.includes(id);
  }

  
  trackByReel(index: number, reel: any) {
    return reel?._id ?? index;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
}
