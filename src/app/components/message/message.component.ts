import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharingService } from 'src/app/services/sharing.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  @Output() ifOpen: EventEmitter<any> = new EventEmitter<any>();
  @Output() hideNavs: EventEmitter<any> = new EventEmitter<any>();

  chats: any[] = [];
  friendData: any;
  constructor(private _sharing: SharingService) {}
  ngOnInit(): void {
    this._sharing.currentUserData.subscribe((data: any) => {
      for (let i = 0; i < data?.chats?.length; i++) {
        const element = data.chats[i];
        let userData = element.userIds.filter(
          (item: any) => item._id != localStorage.getItem('id')
        );

        let user = {
          lastMessage: element.messages[element.messages.length-1],
          profilePic: userData[0].profilePic,
          userName: userData[0].fullName,
          _id: userData[0]._id,
        };
        this.chats.push(user);
      }

    });
  }
  Close() {
    this.close.emit('true');
  }
  hide() {
    this.hideNavs.emit('true');
  }
  openSearch() {
    this.ifOpen.emit('closeTaps');
  }
  openChat(item: any) {


this._sharing.updateChatData({to:item._id})
    this.ifOpen.emit('true');
    if (window.innerWidth <=767) {
      this.hide()
    }
  }
}
