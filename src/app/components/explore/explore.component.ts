import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { DomSanitizer } from '@angular/platform-browser';

interface PostItem {
  _id?: string;
  type: 'image' | 'video';
  src: string;
  caption:any;
  comments:any;
  createdAt:any;
  createdBy:any;
  likes:any;

}
@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent implements OnInit {
  @Input() userData: any;
  @Output() EXPLORE = new EventEmitter<any>();
  @Output() SEARCH = new EventEmitter<any>();

  loading = true;
  totalItems = 0;

  columns: PostItem[][] = [[], [], []];

   items: any[] = [];
  page = 1;
  limit = 20;
  hasMore = true;
  screen: 'lg' | 'md' | 'sm' = 'lg';
  allSearch: boolean = false;

  constructor(private postsService: PostsService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.detectScreen();
    this.loadPosts();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.detectScreen();
    this.distributeItems();
  }
  
  
  detectScreen() {
    const w = window.innerWidth;
    if (w > 900) this.screen = 'lg';
    else if (w > 600) this.screen = 'md';
    else this.screen = 'sm';
  }

// Component: loadPosts (محسّن)
// ========================================
loadPosts() {
  if (this.loading || !this.hasMore) return;

  this.loading = true;

  this.postsService.getExplorePosts(this.page, this.limit).subscribe({
    next: (res: any) => {
      console.log(res);

      // دعم الحقول المختلفة من السيرفر
      const serverItems = (res.items && Array.isArray(res.items) && res.items) ||
                          (res.posts && Array.isArray(res.posts) && res.posts) ||
                          [];

      const newItems = serverItems.map((p: any) => this.mapPostToItem(p));

      // تجنّب التكرار: تأكد إن الـ _id مش موجود أصلاً
      const existingIds = new Set(this.items.map(i => String(i._id)));
      const filtered = newItems.filter((it: any) => !existingIds.has(String(it._id)));

      if (filtered.length) {
        this.items.push(...filtered);
        // فقط زود الصفحة لو جبت عناصر جديدة
        this.page += 1;
      }

      // تحديث حالات
      this.hasMore = !!res.hasMore; // تأكد السيرفر يعيد hasMore
      this.loading = false;

      this.totalItems = this.items.length;
      this.distributeItems();
    },
    error: (err: any) => {
      console.error('Failed to load posts', err);
      this.loading = false;
    }
  });
}


@HostListener('window:scroll', [])
onScroll() {
  const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
  if (bottom) {
    this.loadPosts();
  }
}



// ========================================
// mapPostToItem: تحسين صغير لبناء src من public_id لو لزم
// ========================================
mapPostToItem(p: any): PostItem {
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

  // لو public_id من Cloudinary — لو عندك قاعدة لبناء URL ضعه هنا،
  // حالياً نستخدم media.url إن وُجد وإلا نستخدم public_id كـ fallback (قد تحتاج بناء URL فعلي)
  let src = media.url || media.public_id || '';

  return {
    _id: p._id,
    type,
    src,
    caption: p.caption,
    comments: p.comments,
    createdAt: p.createdAt,
    createdBy: p.createdBy,
    likes: p.likes
  };
}


  distributeItems() {
    this.columns = [[], [], []];

    if (this.screen === 'lg') {
      for (let i = 0; i < this.items.length; i++) {
        this.columns[i % 3].push(this.items[i]);
      }
    } else if (this.screen === 'md') {
      for (let i = 0; i < this.items.length; i++) {
        this.columns[i % 2].push(this.items[i]);
      }
    } else {
      this.columns[0] = [...this.items];
    }
  }

  openSearch() {
    this.SEARCH.emit('Search');
  }

  openEX(item: any) {
    console.log(item);
    
    this.EXPLORE.emit(item);
    const theDiv: any = document.getElementById('app-explore')?.childNodes[0];
    if (theDiv) {
      theDiv.classList.add('vh-100', 'overflow-hidden');
    }
  }

  trackById(_: number, item: PostItem) {
    return item._id || item.src;
  }
}
