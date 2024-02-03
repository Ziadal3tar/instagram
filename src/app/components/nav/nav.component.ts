import { Component, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ChatComponent } from '../chat/chat.component';
import { HomeComponent } from '../home/home.component';
import { SharingService } from 'src/app/services/sharing.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  constructor(
    private _Route: Router,
    private _sharing: SharingService,
    private _UserService: UserService
  ) {
    this._Route.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // this._sharing.updateUserData()

          this.handelProfileData();

      }
    });
  }
  @ViewChild(ChatComponent) ChatComponent: ChatComponent | any;
  @ViewChild(HomeComponent) HomeComponent: ChatComponent | any;

  title = 'insta';
  exploreData: any;
  open: Boolean = false;
  hide: Boolean = false;
  closeSearch: Boolean = true;
  closeMessage: Boolean = true;
  closeNotification: Boolean = true;
  userData: any;
  tapId: any;
  tap: any = 'Reels';
toprofile: Boolean = false
  ngOnInit() {
this.toprofile = true
  }

  handelProfileData() {


    let url = this._Route.url.split('/').filter((item: any) => item != '');


    this._sharing.currentUserData.subscribe((data:any)=>{
      this.userData = data

      if (data?._id != url[1] && url[1] != undefined) {
        if (this.toprofile) {

          this.tap = 'Profile';
        }

        this._UserService.getProfilesData({ _id: url[1] }).subscribe((data1: any) => {
            this._sharing.updateProfileDataDisplay();
          });

      }else{
        this._sharing.updateProfileDataDisplay();

      }
    })

  //   let url = this._Route.url.split('/').filter((item: any) => item != '');
  //   this._sharing.currentUserData.subscribe((data: any) => {
  //     this.userData = data;

  //     if (data?._id != url[1] && data?._id != undefined) {


  //       console.log('g');

  //       this.tap = 'Profile';
  //       this._UserService.getProfilesData({ _id: url[1] }).subscribe((data1: any) => {
  //           this._sharing.updateProfileDataDisplay(data1.profile);
  //         });
  //     } else {
  //       console.log('g1');

  //       this._sharing.updateProfileDataDisplay(data);
  //     }
  //   });
  }

  onDropdownItemClick(event: any) {
    event.stopPropagation();
  }

  ExploreData(data: any) {
    this.exploreData = data;
    this.open = true;
  }

  closeEX() {
    this.open = false;
    let theDiv: NodeListOf<ChildNode> | any =
      document.getElementById('app-explore')?.childNodes[0];
    theDiv?.classList?.remove('vh-100');
    theDiv?.classList?.remove('overflow-hidden');
  }

  openSidePage(data: any) {
    if (data == 'Search') {
      this.closeSearch = false;
      this.closeMessage = true;
      this.closeNotification = true;
    } else if (data == 'Message') {
      this.closeSearch = true;
      this.closeMessage = false;
      this.closeNotification = true;
    } else if (data == 'Notification') {
      this.closeSearch = true;
      this.closeMessage = true;
      this.closeNotification = false;
    }
  }

  closeTap(data: any, id: any) {
    if (id == 'search') {
      this.closeSearch = data;
    } else if (id == 'message') {
      this.closeMessage = data;
    } else if (id == 'notification') {
      this.closeNotification = data;
    }
  }

  closeAllTaps(tap: any) {
    this._Route.navigate([`/userProfile/${this.userData._id}`]);

    this.tap = tap;
    this.closeNotification = true;
    this.closeMessage = true;
    this.closeSearch = true;
  }

  hideNavs() {
    this.hide = true;
  }

  tapClick(tapName: String) {
    if (tapName == 'Home') {
      this.closeAllTaps(tapName);
      this.closeEX();
    } else if (tapName == 'Explore') {
      this.closeAllTaps(tapName);
      this.closeEX();
    } else if (tapName == 'Reels') {
      this.closeAllTaps(tapName);
      this.closeEX();
    } else if (tapName == 'Profile') {
      this.closeAllTaps(tapName);
      this.closeEX();
    } else if (tapName == 'Message') {
      this.openSidePage(tapName);
      this.closeEX();
    }
  }

  openChat() {
    this.tap = 'Message';
  }

  logOut() {
    localStorage.removeItem('userToken');
    this._Route.navigate(['/register']);
  }
  toProfile(id: any) {
    // this.tap = 'Profile';
    // this._Route.navigate([`/userProfile/${id}`]);
  }
}
