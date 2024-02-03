import { UserService } from './user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { ReelService } from './reel.service';

@Injectable({
  providedIn: 'root',
})
export class SharingService {
  constructor(private _Router: Router, private UserService: UserService,private _reel:ReelService) {}
  private userData: any = new BehaviorSubject<any>([]);
  currentUserData = this.userData.asObservable();
  updateUserData() {
    if (localStorage.getItem('userToken')) {
      this.UserService.getUserData(localStorage.getItem('userToken')).subscribe(
        (data: any) => {
          this.userData.next(data.userData);
        },
        (err: HttpErrorResponse) => {
          if (
            err.error.message == 'jwt expired' ||
            err.error.message == 'jwt malformed'
          ) {
            localStorage.removeItem('userToken');
            this._Router.navigate([`/login`]);
          } else {
            localStorage.removeItem('userToken');
            this._Router.navigate(['/login']);
          }
        }
      );
    } else {
      this.userData.next(undefined);
    }
    // this.userData.next(data);
  }














  private ProfileDataDisplay = new BehaviorSubject<Boolean>(false);
  currentProfileDataDisplay = this.ProfileDataDisplay.asObservable();
  updateProfileDataDisplay() {
    let url = this._Router.url.split('/').filter((item: any) => item != '');
this.UserService.getProfilesData({_id:url[1]}).subscribe((data:any)=>{
          this.ProfileDataDisplay.next(data.profile);
  })
  }


  private chat = new BehaviorSubject<any>([]);
  currentChat = this.chat.asObservable();
updateChat(data: any, friend: any) {
    this.chat.next(data);
    this.friend.next(friend);
  }
  private friend = new BehaviorSubject<any>([]);
  currentFriend = this.friend.asObservable();


  private friendsChats = new BehaviorSubject<any>([]);
  currentFriendChats = this.friendsChats.asObservable();
  updateFriendsChats() {
    const friendChats: any[] = [
      {
        name: 'ziad almorsy',
        image: './assets/imgs/team-4.jpg',
      },
      {
        name: 'nada josef',
        image: './assets/imgs/anne.jpg',
      },
      {
        name: 'amr khalid',
        image: './assets/imgs/ivana-square.jpg',
      },
      {
        name: 'fares ali',
        image: './assets/imgs/team-3.jpg',
      },
      {
        name: 'yasser mohamed',
        image: './assets/imgs/mosalah.jpg',
      },
      {
        name: 'Abu Obeida',
        image: './assets/imgs/aboobida.jpg',
      },
      {
        name: 'saif adel',
        image: './assets/imgs/me.jpg',
      },
      {
        name: 'yasser mohamed',
        image: './assets/imgs/mosalah.jpg',
      },
      {
        name: 'Abu Obeida',
        image: './assets/imgs/aboobida.jpg',
      },
      {
        name: 'saif adel',
        image: './assets/imgs/me.jpg',
      },
    ];
    this.friendsChats.next(friendChats);
  }

  private userNotification = new BehaviorSubject<any>([]);
  currentUserNotification = this.userNotification.asObservable();
  updateUserNotification() {
    const notification: any[] = [
      {
        user: {
          name: 'ziad almorsy',
          image: './assets/imgs/team-4.jpg',
        },
        notification: {
          text: 'who you might know, is on instagram',
          users: [],
        },
      },
      {
        user: {
          name: 'nada josef',
          image: './assets/imgs/anne.jpg',
        },
        notification: {
          text: 'Started following you',
          users: [],
        },
      },
      {
        user: {
          name: 'amr khalid',
          image: './assets/imgs/ivana-square.jpg',
        },
        notification: {
          text: 'added new story',
          users: [],
        },
      },
      {
        user: {
          name: 'fares ali',
          image: './assets/imgs/team-3.jpg',
        },
        notification: {
          text: 'Like your post',
          users: [],
        },
      },
      {
        user: {
          name: 'yasser mohamed',
          image: './assets/imgs/mosalah.jpg',
        },
        notification: {
          text: 'Comment on your post',
          users: [],
        },
      },
      {
        user: {
          name: 'Abu Obeida',
          image: './assets/imgs/aboobida.jpg',
        },
        notification: {
          text: 'fu*ked Israel',
          users: [],
        },
      },
      {
        user: {
          name: 'saif adel',
          image: './assets/imgs/me.jpg',
        },
        notification: {
          text: 'Started following your friend',
          users: [
            {
              name: 'ali ahmed',
            },
          ],
        },
      },
    ];
    this.userNotification.next(notification);
  }

  private search = new BehaviorSubject<Boolean>(false);
  currentSearch = this.search.asObservable();
  updateSearch() {
    this.search.next(true);
  }


  private reels = new BehaviorSubject<any>([]);
  currentReels = this.reels.asObservable();
  updateReel(page:any) {
    let data={
      page
    }
   this._reel.getAllReels(data).subscribe((data:any)=>{
    // console.log(data);

    this.reels.next(data.reels);

   })
  }
}
