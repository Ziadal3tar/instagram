import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SharingService } from 'src/app/services/sharing.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';

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
  @Output() OpenChat: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private _Route: Router,
    private _sharing: SharingService,
    private _userServices: UserService,
    private _socket: SocketService
  ) {}
  ngOnInit(): void {
    this._sharing.currentSaved.subscribe((data: any) => {
      this.saved = data.saved;
      // this.allPosts = data.allPosts;
      console.log(data);
    });
    let url = this._Route.url.split('/').filter((item: any) => item != '');
    this.url = url[1];
    this.userId = localStorage.getItem('id');

    this._sharing.currentProfileDataDisplay.subscribe((data: any) => {
      this.displayData = data;
      this.allPosts =data.posts

      let to = { to: this.displayData._id };
      this._sharing.updateChatData(to);
      if (this.displayData?.followers?.includes(this.userId)) {
        this.following = true;
      } else if (this.displayData?.following?.includes(this.userId)) {
        this.follower = true;
      } else {
        this.following = false;
        this.follower = false;
      }
    });
  }
  changeProfileTaps(data: any) {}

  select(data: any) {
    if (data == 'add') {
      let data = {
        selected: this.selected,
        collectionId: this.openCollection._id,
      };

      this._userServices.addToCollection(data).subscribe((data: any) => {
        if (data.success) {
          this.openCollection = undefined;
          this.toAddToCollection = false;
        }
      });
    } else {
      if (this.selected.includes(data._id)) {
        this.selected = this.selected.filter((item: any) => item !== data._id);
      } else {
        this.selected.push(data._id);
      }
    }
  }
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
    this._userServices.follow(this.displayData._id).subscribe((data: any) => {
      if (data.success) {
        this._sharing.updateProfileDataDisplay();

        this._socket.emit('notification', {
          eventName: 'follow',
          type: 'user',
          data: localStorage.getItem('id'),
          redirect: localStorage.getItem('id'),
          to: this.displayData._id,
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
  openChat() {
    this.OpenChat.emit('');
  }
  addToCollection(collection: any) {
    console.log(collection);
  }
}
