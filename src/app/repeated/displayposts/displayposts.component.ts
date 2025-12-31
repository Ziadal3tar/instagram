import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { LazyLoadDirective } from 'src/app/Directive/lazy-load.directive';
@Component({
  selector: 'app-displayposts',
  templateUrl: './displayposts.component.html',
  styleUrls: ['./displayposts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisplaypostsComponent {
  @Input() data: any[] = [];
  open = false;
  @Input() select = false;
  displayPost: any;
  selected: any[] = [];

  ngOnInit(): void {
 
  }

  trackById(index: number, item: any) {
    return item?._id ?? index;
  }

  openPost(data: any) {
    this.open = true;
    document.body.style.overflowY = 'hidden';
    this.displayPost = this.mapPostToItem(data);
  }

  mapPostToItem(p: any) {
    let media = null;
    if (p.postsImgAndVideos && p.postsImgAndVideos.length) {
      media = p.postsImgAndVideos[0];
    } else if (p.url) {
      media = { url: p.url, type: 'videos', public_id: p.public_id };
    }

    if (!media) {
      return {
        _id: p._id,
        type: 'image',
        src: './assets/imgs/anne.jpg',
        caption: p.caption,
        comments: p.comments,
        createdAt: p.createdAt,
        createdBy: p.createdBy,
        likes: p.likes
      };
    }

    const type = (media.type === 'videos' || media.type === 'video') ? 'video' : 'image';
    const src = media.url || media.public_id || '';

    return { _id: p._id, type, src, caption: p.caption, comments: p.comments, createdAt: p.createdAt, createdBy: p.createdBy, likes: p.likes };
  }

  closePost() {
    document.body.style.overflowY = 'auto';
    this.open = false;
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = './assets/imgs/placeholder.png';
  }
}
