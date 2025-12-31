import {
  Component,
  ElementRef,
  HostListener,
  Renderer2,
  Directive,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { SharingService } from 'src/app/services/sharing.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { UserService } from 'src/app/services/user.service';
import { PostsService } from 'src/app/services/posts.service';
import { SocketService } from 'src/app/services/socket.service';
import { NavComponent } from '../nav/nav.component';
import { DisplaypostsComponent } from 'src/app/repeated/displayposts/displayposts.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  slickConfig = {
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dots: true,
    infinite: false,

  };

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    autoWidth: true,   // << تفعيل
    margin: 6,
    responsive: {
      0: { items: 2 },
      400: { items: 2 },
      740: { items: 3 },
      940: { items: 9 },
    },
    nav: false,
  };
  @Output() visitProfile: EventEmitter<any> = new EventEmitter<any>();
  posts: any[] = [];
  page = 1;
  limit = 5;
  loading = false;
  hasMore = true;
  postNavigationStates: number[] = [];

  saved: any[] = [];
  num: any = 1;
  userData: any;
  displayPost: any;
  uploadFilesData: any;
  uploadStoryData: any;
  ifUploadStory: Boolean = false;
  instaLoading: Boolean = false;
  option: Boolean = false;
  comment: any = '';
  constructor(
    private elementRef: ElementRef,
    private _sharing: SharingService,
    private _user: UserService,
    private _post: PostsService,
    private _socket: SocketService,

  ) {
    if (window.innerWidth >= 767) {
      this.marginSize = 80;
      this.widthSize = 8;
    } else {
      this.marginSize = 90;
      this.widthSize = 4;
    }
    this.instaLoading = true;

  }
  showDiv: boolean = false;
  mouseX: number = 0;
  mouseY: number = 0;
  divTop: string = '0';
  divLeft: string = '0';
  storyOpened: Boolean = false;
  widthSize: any;
  marginSize: any;
  storyData: any;
  hoverData: any;

  ngOnInit(): void {

    this._sharing.currentUserData.subscribe((data: any) => {
      if (data) {
        console.log(data);
        if (data._id) {
          this.userData = data;
          
          this.loadPosts();
          this.instaLoading = false
        }
      }


    });
    // this._sharing.updateSaved();
    // this._sharing.currentSaved.subscribe((data: any) => {
    //   this.saved = data.saved;
    // });

  }
  loadPosts() {
    if (this.loading || !this.hasMore) return;

    this.loading = true;

    this._user.getPostsBasedOnSocialNetwork(this.page, this.limit).subscribe((res: any) => {

      this.posts.push(...res.posts);
      this.hasMore = res.hasMore;
      this.loading = false;

      this.page++;
      console.log(this.posts);
    });
  }
  trackById(index: number, post: any) {
    return post._id || index;
  }
  @HostListener("window:scroll", [])
  onScroll() {
    const bottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

    if (bottom) {
      this.loadPosts();
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['posts']) {
      this.initPostNavigationStates();
    }
  }
  toUser(id: any) {
    // this._nav.tap = 'Profile'
    // this._Displayposts.closePost()
    this.toProfile('Profile')
    this._sharing.toUser(id)
  }
  initPostNavigationStates() {
    if (!Array.isArray(this.posts)) {
      this.postNavigationStates = [];
      return;
    }
    const old = this.postNavigationStates;
    this.postNavigationStates = this.posts.map((p, idx) => {
      if (old && typeof old[idx] === 'number' && old[idx] >= 0) {
        const len = (p?.postsImgAndVideos?.length) || 0;
        if (len === 0) return 0;
        return Math.min(old[idx], len - 1);
      }
      return 0;
    });
  }

  getCurrentMedia(post: any, index: number) {
    const navIndex = this.postNavigationStates?.[index] ?? 0;
    const medias = post?.postsImgAndVideos || [];
    if (!Array.isArray(medias) || medias.length === 0) return null;
    const idx = Math.max(0, Math.min(navIndex, medias.length - 1));
    return medias[idx];
  }

  toggleValue(index: number, newValue: number) {
    const medias = this.posts?.[index]?.postsImgAndVideos;
    const len = Array.isArray(medias) ? medias.length : 0;
    if (len === 0) return;

    const wrapped = ((newValue % len) + len) % len;
    this.postNavigationStates[index] = wrapped;
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = './assets/imgs/placeholder.png';
    img.classList.add('img-error');
  }

  trackByPostId(index: number, item: any) {
    return item?._id ?? index;
  }


  onMouseMove(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    this.divTop = `${event.clientY}px`;
    this.divLeft = `${event.clientX - 60}px`;
  }
  mouseleave(event: any) {
    const relatedTargetName = (event.relatedTarget as HTMLElement).id;

    if (relatedTargetName != 'dataWhenHover') {
      this.showDiv = false;
    }
  }
  mouseEnter(data: any) {
    this.showDiv = true;
    this.hoverData = data;
  }
  hideDiv() {
    this.showDiv = false;
  }
  ngAfterViewInit() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const video = this.elementRef.nativeElement.querySelector('video');

    if (video) {
      const callback = (entries: any) => {
        entries.forEach((entry: any) => {
          if (entry.isIntersecting) {
            video.play();
          } else {
            video.pause();
          }
        });
      };

      const observer = new IntersectionObserver(callback, options);
      observer.observe(video);
    } else {
      console.error('Video element not found.');
    }
  }

  openStory(data: any) {
    if (data.stories.length != 0) {
      this.storyOpened = true;
      this.storyData = data;
    }
  }
  closeStory() {
    this.storyOpened = false;
    this.storyData = null;
  }

  uploadStory(event: any) {
    const file = event.target.files[0];
    this.uploadFilesData = file;

    if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        let duration = video.duration;

        if (duration > 30) {
          console.log(
            `Video ${file.name} is longer than 30 seconds. Truncating to 30 seconds.`
          );
          duration = 30;
        }

        const story: any = {
          name: file.name,
          size: file.size,
          type: file.type,
          duration: duration,
        };

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event: any) => {
          let data = {
            Src: event.target.result,
            type: file.type.split('/')[0],
            duration: duration,
          };
          this.uploadStoryData = data;
          this.storyOpened = !this.storyOpened;
        };
      };

      video.src = URL.createObjectURL(file);
    } else if (file.type.startsWith('image/')) {
      const story: any = {
        name: file.name,
        size: file.size,
        type: file.type,
      };

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        let data = {
          Src: event.target.result,
          type: file.type.split('/')[0],
        };
        this.uploadStoryData = data;

        this.storyOpened = !this.storyOpened;
      };
    }
  }
  toProfile(data: any) {
    this.visitProfile.emit(data);
  }

  like(item: any, index: any) {
    if (item.postsImgAndVideos) {
      let data = {
        type: 'post',
        _id: this.posts[index]._id,
      };
      this._post.like(data).subscribe((data: any) => {
        if (data.message == 'added') {
          this.posts[index].likes.push(this.userData._id);

          this._socket.emit('notification', {
            eventName: 'like',
            type: 'post',
            data: this.userData._id,
            redirect: this.posts[index]._id,
            to: this.posts[index].createdBy._id,
          });
        } else {
          this.posts[index].likes = this.posts[index].likes.filter(
            (element: any) => element !== this.userData._id
          );
        }
      });
    } else {
      let data = {
        _id: item._id,
        type: 'reel',
      };
      this._post.like(data).subscribe((data: any) => {
        if (data.success) {
          this.posts[index].likes = data.newItem.likes;
        }
      });
    }
  }
  savePost(item: any, index: any) {

if (this.userData.savedPosts.includes(item._id)) {
this.userData.savedPosts = this.userData.savedPosts.filter(
  (id:any) => id !== item._id
);
}else{
      this.userData.savedPosts.push(item._id)
}
  
      let data = {
        postId: item._id,
  ref: item.type.charAt(0).toUpperCase() + item.type.slice(1),
      };
      console.log(data);
      
      this._user.savePost(data).subscribe((data: any) => {
        if (data.success) {
          this._sharing.updateSaved();
        }
      });
   
  }
  addComment(item: any, index: any) {
    if (item.postsImgAndVideos) {
      let data = {
        type: 'post',
        _id: this.posts[index]._id,
        comment: this.comment,
      };
      this._post.addComment(data).subscribe((data: any) => {
        if (data.success) {
          this._post
            .getPostById(this.posts[index]._id)
            .subscribe((data: any) => {
              this.posts[index] = data.post;
              this.comment = '';
            });
          this._socket.emit('notification', {
            eventName: 'comment',
            type: 'post',
            data: this.userData._id,
            redirect: this.posts[index]._id,
            to: this.posts[index].createdBy._id,
          });
        }
      });
    } else {
      let data = {
        comment: this.comment,
        _id: this.posts[index]._id,
        type: 'reel',
      };
      this._post.addComment(data).subscribe((data: any) => {
        if (data.success) {
          this.posts[index] = data.post;
          this.comment = '';
        }
      });
    }
  }
isPostSaved(postId: string, type: 'post' | 'reel'): boolean {
  const id = String(postId);
if (type =='post') {
  
  const savedPosts = (this.userData?.savedPosts || []).map((p: any) =>
    typeof p === 'string' ? p : (p._id ? String(p._id) : String(p))
  
);
return savedPosts.includes(id);
}else{

  const savedReels = (this.userData?.savedReels || []).map((r: any) =>
    typeof r === 'string' ? r : (r._id ? String(r._id) : String(r))
  );
  return savedReels.includes(id);
}



}
  openPost(post: any) {
    console.log(post);
    let type:any
    if (post.postsImgAndVideos) {
      type = 'post'
    }else{
      type = 'reel'
    }
    post.isSaved = this.isPostSaved(post._id,type)
    console.log(post);
    
    this.displayPost = post;
  }
  openPostN(id: any) {
    this._post.getPostById(id).subscribe((data: any) => {
      this.openPost(data.post);
    });
  }
  openStoryN(data: any) {
    setTimeout(() => {
      this.storyOpened = true;
      console.log(this.storyOpened);

      this.storyData = this.userData;
    }, 200);
  }

}
