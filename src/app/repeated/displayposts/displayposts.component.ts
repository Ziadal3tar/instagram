import { ChangeDetectionStrategy, Component, HostListener, Input, OnDestroy } from '@angular/core';
import { ContentItem } from '../../core/models/api.models';

@Component({
  selector: 'app-displayposts',
  templateUrl: './displayposts.component.html',
  styleUrls: ['./displayposts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplaypostsComponent implements OnDestroy {
  @Input() data: ContentItem[] = [];
  @Input() select = false;

  open = false;
  displayPost?: ContentItem;
  private previousBodyOverflow = '';

  trackById(_: number, item: ContentItem): string {
    return String(item._id);
  }

  openPost(item: ContentItem): void {
    if (!this.open) {
      this.previousBodyOverflow = document.body.style.overflow;
    }

    this.displayPost = item;
    this.open = true;
    document.body.style.overflow = 'hidden';
  }

  closePost(): void {
    if (!this.open) return;

    this.open = false;
    this.displayPost = undefined;
    document.body.style.overflow = this.previousBodyOverflow;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closePost();
  }

  mediaUrl(item: ContentItem): string {
    return item.postsImgAndVideos?.[0]?.url || item.url || './assets/imgs/placeholder.png';
  }

  isVideo(item: ContentItem): boolean {
    return item.type === 'reel' || item.postsImgAndVideos?.[0]?.type === 'video';
  }

  onImgError(event: Event): void {
    const image = event.target as HTMLImageElement | null;
    if (!image || image.dataset['fallbackApplied'] === 'true') {
      if (image) image.style.visibility = 'hidden';
      return;
    }

    image.dataset['fallbackApplied'] = 'true';
    image.src = './assets/imgs/placeholder.png';
  }

  ngOnDestroy(): void {
    if (this.open) {
      this.open = false;
      document.body.style.overflow = this.previousBodyOverflow;
    }
  }
}
