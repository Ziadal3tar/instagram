import {
  Component,
  ElementRef,
  HostListener,
  Renderer2,
  Directive,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { SharingService } from 'src/app/services/sharing.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { UserService } from 'src/app/services/user.service';
import { PostsService } from 'src/app/services/posts.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 5,
      },
      400: {
        items: 6,
      },
      740: {
        items: 7,
      },
      940: {
        items: 9,
      },
    },
    nav: false,
  };
  @Output() visitProfile: EventEmitter<any> = new EventEmitter<any>();
  posts: any[] = [];
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
    private _socket: SocketService
  ) {
    if (window.innerWidth >= 767) {
      this.marginSize = 80;
      this.widthSize = 8;
    } else {
      this.marginSize = 90;
      this.widthSize = 4;
    }
    this.instaLoading = true;
    this._user.getPostsBasedOnSocialNetwork().subscribe((data: any) => {
      if (data.allPosts) {
        this.instaLoading = false;
        this.posts = data.allPosts;
      }
    });
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
      this.userData = data;
    });
    this._sharing.updateSaved();
    this._sharing.currentSaved.subscribe((data: any) => {
      console.log(data);
      this.saved = data.saved;
    });
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
      threshold: 0.5, // Adjust this value to control when the video starts playing
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
    console.log(data.stories.length);

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

        // Limit the video duration to 30 seconds
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
    // const saveIcon = document.getElementById(`saveIcon${index}`)
    // console.log(saveIcon);

    if (item.postsImgAndVideos) {
      let data = {
        postId: item._id,
        ref: 'Post',
      };
      this._user.savePost(data).subscribe((data: any) => {
        if (data.success) {
          // this._sharing.updateUserData();
          this._sharing.updateSaved()
        }
      });
    } else {
      let data = {
        postId: item._id,
        ref: 'Reel',
      };
      this._user.savePost(data).subscribe((data: any) => {
        if (data.success) {
          // this._sharing.updateUserData();
          this._sharing.updateSaved()
        }
      });
    }
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
  isPostSaved(postId: string): boolean {
    console.log(postId);
    let post = this.saved.filter((post: any) => post._id == postId);
    if (post.length == 0) {
      return false;
    } else {
      return true;
    }
  }
  openPost(post: any) {
    this.displayPost = post;
  }
  openPostN(id: any) {
    this._post.getPostById(id).subscribe((data: any) => {
      this.openPost(data.post);
    });
  }
  openStoryN(data: any) {
    setTimeout(() => {
      console.log(this.storyOpened);
      // this.openStory(data)
      this.storyOpened = true;
      console.log(this.storyOpened);

      this.storyData = this.userData;
    }, 200);
  }
}
