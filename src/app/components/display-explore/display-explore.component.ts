import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';
import { SharingService } from 'src/app/services/sharing.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-display-explore',
  templateUrl: './display-explore.component.html',
  styleUrls: ['./display-explore.component.scss'],
})
export class DisplayExploreComponent {

  @Input() exploreData: any;

  userData: any;
  comment: any;
  doubleClick: boolean = false;
  yourCollections: boolean = false;
  @Output() open: EventEmitter<any> = new EventEmitter<any>();
  value = 0;

  showDiv: boolean = false;
  isSaved: boolean = false;
  mouseX: number = 0;
  mouseY: number = 0;
  divTop: string = '0';
  divLeft: string = '0';
  data = {
    name: 'ksdujfghv',
  };
  constructor(
    private _post: PostsService,
    private _sharing: SharingService,
    private _UserService: UserService,
    private _socket: SocketService,
  ) { }
  ngOnInit(): void {
    this.toggleValue(0)
console.log(this.exploreData);
this.isSaved =this.exploreData.isSaved
    this._sharing.currentUserData.subscribe((data: any) => {
      this.userData = data;

      // this.isItemSaved()
    });
  }

  toggleValue(newValue: number) {
    const media = this.exploreData?.postsImgAndVideos || (this.exploreData ? [{ url: this.exploreData.src, type: this.exploreData.type }] : []);
    const len = media.length || 1;

    if (newValue < 0) {
      newValue = len - 1;
    } else if (newValue > len - 1) {
      newValue = 0;
    }

    this.value = newValue;
    if (media[this.value]) {
      this.exploreData.src = media[this.value].url;
      this.exploreData.type = media[this.value].type;
    }
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
  hideDiv() {
    this.showDiv = false;
  }
  like() {
    let likeIcons = Array.from(document.getElementsByClassName('like'));
    likeIcons.forEach((icon) => {
      icon.classList.toggle('bi-heart');
      icon.classList.toggle('bi-heart-fill');
      icon.classList.toggle('text-danger');
    });
    let data = {
      type: 'post',
      _id: this.exploreData._id,
    };
    this._post.like(data).subscribe((data: any) => {
      if (data.message == 'added') {
        this._socket.emit('notification', { eventName: 'like', type: 'post', data: this.userData._id, redirect: this.exploreData._id, to: this.exploreData.createdBy._id })

        this.exploreData.likes.push(this.userData._id);
      } else {
        this.exploreData.likes = this.exploreData.likes.filter(
          (element: any) => element !== this.userData._id
        );
      }
    });
  }
  ifDoubleClick() {
    if (this.doubleClick) {
      this.like();
    }
    this.doubleClick = true;

    setTimeout(() => {
      this.doubleClick = false;
    }, 1000);
  }
  addComment() {
    let data = {
      type: 'post',
      _id: this.exploreData._id,
      comment: this.comment,
    };
    this._post.addComment(data).subscribe((data: any) => {
      if (data.success) {
        this._post.getPostById(this.exploreData._id).subscribe((data: any) => {
          this.exploreData = data.post;
        });
        this._socket.emit('notification', { eventName: 'comment', type: 'post', data: this.userData._id, redirect: this.exploreData._id, to: this.exploreData.createdBy._id })
      }
    });
  }
  // isItemSaved() {
  //   console.log(this.exploreData);
  //    if (this.exploreData.postsImgAndVideos) {

  //     const savedPosts = (this.userData?.savedPosts || []).map((p: any) =>
  //  p == this.exploreData._id
  // );
  // console.log(savedPosts.includes(this.exploreData._id));

  //    }else{
  //      const savedReels = (this.userData?.savedReels || []).map((p: any) =>
  //  p == this.exploreData._id
  // );

  // console.log(savedReels.includes(this.exploreData._id));
    //  }
     
    // let arr = this.userData?.saved?.filter((savedItem: any) => savedItem._id === this.exploreData?._id);
    // if (arr?.length == 0) {
    //   this.idSaved = false
    // } else {
    //   this.idSaved = true
    // }
  // }
  savePost(item: any) {
    console.log(item);
    let data = {
      postId: item._id,
      ref: ''
    }
    if (item.postsImgAndVideos
    ) {
data.ref = 'Post'
    } else {
data.ref = 'Reel'

    }
    if (this.userData.savedPosts.includes(item._id)) {
      this.userData.savedPosts = this.userData.savedPosts.filter(
        (id: any) => id !== item._id
      );
    } else {
      this.userData.savedPosts.push(item._id)
    }

   
    console.log(data);

    this._UserService.savePost(data).subscribe((data: any) => {
      if (data.success) {
        this._sharing.updateSaved();
      }
    });

  }

}
