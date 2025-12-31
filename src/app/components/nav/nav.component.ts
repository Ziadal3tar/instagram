import { HomeComponent } from './../home/home.component';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ChatComponent } from '../chat/chat.component';
import { SharingService } from 'src/app/services/sharing.service';
import { UserService } from 'src/app/services/user.service';
import { SocketService } from 'src/app/services/socket.service';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  constructor(
    private _Route: Router,
    private _sharing: SharingService,
    private _UserService: UserService,
    private _Socket: SocketService,
    private HomeComp: HomeComponent
  ) {
    this._Route.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
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
  numberOfNotifications: any;
  tap: any = 'Home';
  ngOnInit() {
    this._sharing.currentUserData.subscribe((data: any) => {
      this.userData = data;

      let notSeen = data.notifications?.filter(
        (item: any) => item.seen == false
      );
      this.numberOfNotifications = notSeen?.length;
      if (data._id) {

      }

      let url = this._Route.url.split('/').filter((item: any) => item != '');
      if (localStorage.getItem('id') != url[1]) {
        this.tap = 'Profile';
      }
    });
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
      this._UserService.allNotificationSeen().subscribe((data: any) => {
        if (data.success) {
          this.numberOfNotifications = 0
        }
      });
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

  openChat(data: any) {
    this.closeAllTaps('');
    this.tap = 'Message';
    if (data == 'closeTaps') {
      this.ChatComponent.chat = null;
    }
  }

  logOut() {
    localStorage.removeItem('userToken');
    this._Route.navigate(['/register']);
  }
  toProfile() {
    this.tap = 'Profile';

    this.closeNotification = true;
    this.closeMessage = true;
    this.closeSearch = true;
  }
  openN(data: any) {

    if (data.type == 'chat') {
      this.openChat('');
    } else if (data.type == 'post') {
      this.tap = 'Home'
      this.HomeComp.openPostN(data.redirect)
    } else if (data.type == 'story') {
      let user = this.userData.following.filter((user: any) => user._id == data.data._id)

      this.HomeComp.openStoryN(user[0])
    }
  }
}
