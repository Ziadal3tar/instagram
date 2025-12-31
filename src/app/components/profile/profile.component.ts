import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SharingService } from 'src/app/services/sharing.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  tap: String = 'posts';
  addNewCollection: Boolean = false;
  SelectionStage: Boolean = false;
  edit: Boolean = false;
  setting: Boolean = false;
  follower: Boolean = false;
  following: Boolean = false;
  toAddToCollection: Boolean = false;
  openCollection: any;
  selected: any = [];
  saved: any = [];
  allPosts: any = [];
  displayData: any;
  userId: any;
  url: any;
  collectionName: any;

  loading: boolean = true

  private destroy$ = new Subject<void>();


  @Output() OpenChat: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private _Route: Router,
    private _sharing: SharingService,
    private _userServices: UserService,
    private _socket: SocketService,
    private _ActivatedRoute: ActivatedRoute,
  ) { }
  ngOnInit(): void {
    this.loading = true
    if (this.saved.length == 0) {
      console.log('f');

      this._sharing.updateSaved();
    }
    this._sharing.currentSaved.subscribe((data: any) => {
      this.saved = data.saved;
    });

    this._ActivatedRoute.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const id = params.get('id');
        this.url = id;
        this.loading = true
        this._sharing.updateProfileDataDisplay();
      });
    this.userId = localStorage.getItem('id');

    this._Route.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const urlParts = this._Route.url.split('/').filter((it: any) => it !== '');
        this.url = urlParts[1] || this.url;
      });

    this._sharing.currentSaved
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.saved = data.saved;
        console.log('saved/allPosts updated', data);
      });

    this._sharing.currentProfileDataDisplay
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.displayData = data;
        this.allPosts = data.posts || this.allPosts;
        console.log('profile display data', data);
        // this.loading = false
        if (this.url == data?._id) {
          this.loading = false

        } else {
          this.loading = true

        }
        const to = { to: this.displayData._id };
        this._sharing.updateChatData(to);

        const myId = this.userId;
        if (this.displayData?.followers?.includes(myId)) {
          this.following = true;
          this.follower = false;
        } else if (this.displayData?.following?.includes(myId)) {
          this.follower = true;
          this.following = false;
        } else {
          this.following = false;
          this.follower = false;
        }
      });

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeProfileTaps(data: any) { }


  close() {
    this.SelectionStage = false;
    this.selected = [];
    this.addNewCollection = false;
  }
  back() {
    this.SelectionStage = false;
  }

  closeSetting(event: any) {
    if (event.target.id == 'close') {
      this.setting = false;
    }
  }
  logOut() {
    localStorage.removeItem('userToken');
    this._Route.navigate(['/register']);
  }
  follow() {
    const targetId = this.displayData._id;
    this._userServices.follow(targetId).subscribe((res: any) => {
      if (res.success) {
        this._sharing.updateProfileDataDisplay();

        this._socket.emit('notification', {
          eventName: 'follow',
          type: 'user',
          data: localStorage.getItem('id'),
          redirect: `/profile/${targetId}`,
          to: targetId,
        });
      }
    });
  }

  newCollection() {
    let data = {
      collectionName: this.collectionName,
    };
    this._userServices.newCollection(data).subscribe((data: any) => {
      if (data.success) {
        this._sharing.updateProfileDataDisplay();
      }
    });
  }

  trackById(index: number, item: any) {
    return item._id || index;
  }

  select(id: string) {
    if (!id) return;
    const idx = this.selected.indexOf(id);
    if (idx > -1) {
      this.selected.splice(idx, 1);
    } else {
      this.selected.push(id);
    }
  }

  confirmAdd() {
    if (!this.openCollection?._id) {
      console.warn('no openCollection');
      return;
    }
    if (this.selected.length === 0) {
      return;
    }

    const payload = {
      selected: this.selected,
      collectionId: this.openCollection._id
    };

    this._userServices.addToCollection(payload).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.openCollection = undefined;
          this.toAddToCollection = false;
          this.selected = [];
        } else {
          console.error(res);
        }
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }
  mapPostToItem(p: any) {
    let media = null;
    if (p.postsImgAndVideos && p.postsImgAndVideos.length) {
      media = p.postsImgAndVideos[0];
    } else if (p.url) {
      media = { url: p.url, type: 'videos', public_id: p.public_id };
    }

    if (!media) {
      return { _id: p._id, type: 'image', src: './assets/imgs/anne.jpg', caption: p.caption, comments: p.comments, createdAt: p.createdAt, createdBy: p.createdBy, likes: p.likes };
    }


    const type = (media.type === 'videos' || media.type === 'video') ? 'video' : 'image';
    let src = media.url || media.public_id || '';

    return { _id: p._id, type, src, caption: p.caption, comments: p.comments, createdAt: p.createdAt, createdBy: p.createdBy, likes: p.likes };
  }
  openCollectionFromItem(item: any) {
    const saved = item?.saved ?? [];
    return saved.map((p: any) => this.mapPostToItem(p));
  }
  fromBtns(data: any) {
    console.log(data);
    if (data == 'Add from saved') {
      this.toAddToCollection = true
    } else if (data = 'delete') {
      this._userServices.deleteCollection(this.openCollection._id).subscribe((data: any) => {
        console.log(data);
        if (data.success) {
          this.openCollection = undefined
          this._sharing.updateProfileDataDisplay();
        }
      })
    }
  }
  openChat() {
    this.OpenChat.emit('');
  }
}
