import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';

import { SharingService } from 'src/app/services/sharing.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reels',
  templateUrl: './reels.component.html',
  styleUrls: ['./reels.component.scss'],
})
export class ReelsComponent {
  displayComments: any;
  reels: any[] = [];
  page = 0;
  userData: any;
  visibleItemIndex = 0;
  loading: Boolean = true;
  arr: any[] = [];
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private _sharing: SharingService,
    private _post: PostsService,
    private _UserService: UserService
  ) {}
  ngOnInit(): void {
    this._sharing.currentUserData.subscribe((data: any) => {
      this.userData = data;
      data.savedReels.filter((item: any) => this.arr.push(item._id));
    });
    this._sharing.updateReel(this.page);
    this._sharing.currentReels.subscribe((data: any) => {
      this.reels = this.reels.concat(data);
      if (this.reels.length != 0) {
        this.loading = false;
      }
    });
  }

  handleScroll() {
    const container = document.querySelector('.reelsContainer');
    const scrollTop = container?.scrollTop || 0;
    const itemHeight = container?.clientHeight || 1;
    this.visibleItemIndex = Math.floor(scrollTop / itemHeight) + 2;
    if (this.visibleItemIndex == this.reels.length - 1 * 5 + 3) {
      this.page += 1;
      this._sharing.updateReel(this.page);
    }
  }

  addReelLike(item: any, index: any) {
    if (!this.reels[index].likes.includes(this.userData._id)) {
      this.reels[index].likes.push(this.userData._id);
    } else {
      this.reels[index].likes = this.reels[index].likes.filter(
        (userId: any) => userId !== this.userData._id
      );
    }
    let data = {
      _id: item._id,
      type: 'reel',
    };
    this._post.like(data).subscribe((data: any) => {
      if (data.success) {
        this.reels[index].likes = data.newItem.likes;
      }
    });
  }

  saveReel(id: any) {
    let data = {
      postId: id,
      ref: 'Reel',
    };
    this._UserService.savePost(data).subscribe((data: any) => {
      if (data.success) {
        this._sharing.updateUserData();
      }
    });
  }
  ifSaved(id: any) {
    console.log(id);

    let saved = this.userData?.saved?.filter((item: any) => item.item == id);
    if (saved?.length != 0) {
      return true;
    }
    return false;
  }
}
