import { UserService } from './user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { ReelService } from './reel.service';
import { ChatComponent } from '../components/chat/chat.component';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root',
})
export class SharingService {
  constructor(
    private _Router: Router,
    private UserService: UserService,
    private _reel: ReelService,
    private _Chat: ChatService,
    
  ) {}
  private userData: any = new BehaviorSubject<any>([]);
  currentUserData = this.userData.asObservable();
  updateUserData() {
    console.log(this._Router.url.split('/').filter((item: any) => item != ''));
    
    if (localStorage.getItem('userToken')) {
      this.UserService.getUserData(localStorage.getItem('userToken')).subscribe(
        (data: any) => {
          console.log(data);
          
          this.userData.next(data.userData);
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          
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
    console.log('gfgfgf');
    
    let url = this._Router.url.split('/').filter((item: any) => item != '');
    this.UserService.getProfilesData({ _id: url[1] }).subscribe((data: any) => {
      console.log(data);
      
      this.ProfileDataDisplay.next(data.profile);
    });
  }



  private search = new BehaviorSubject<Boolean>(false);
  currentSearch = this.search.asObservable();
  updateSearch() {
    this.search.next(true);
  }
  private chatData = new BehaviorSubject<any>([]);
  currentChatData = this.chatData.asObservable();
  updateChatData(data: any) {
    this._Chat.getChat(data).subscribe((data: any) => {
      this.chatData.next(data);
    });
  }

  private reels = new BehaviorSubject<any>([]);
  currentReels = this.reels.asObservable();
  updateReel(page: any) {
    let data = {
      page,
    };
    this._reel.getAllReels(data).subscribe((data: any) => {
      this.reels.next(data.reels);
    });
  }










  private saved = new BehaviorSubject<any>([]);
  currentSaved = this.saved.asObservable();
  updateSaved() {
   this.UserService.getSaved().subscribe((data:any)=>{
    this.saved.next(data);
   })
  }


  toUser(id:any){
    this._Router.navigate([`/userProfile/${id}`]);

  }
}
