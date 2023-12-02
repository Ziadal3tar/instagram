import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharingService } from 'src/app/services/sharing.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeChats: EventEmitter<any> = new EventEmitter<any>();
  chats: any[] = [];
  friendData: any;
  constructor(private _sharing: SharingService) {
    this._sharing.updateFriendsChats();
    this._sharing.currentFriendChats.subscribe((data: any) => {
      this.chats = data;
    });
  }
  ngOnDestroy(): void {
  }
  Close() {
    this.close.emit('true');
  }
  openSearch() {
    this._sharing.updateSearch();
  }
  openChat(item: any) {
    let chat = [
      {
        id: '1',
        text: 'lorem! sdkg hierg dkrgh drgh sei',
        time: '1.23',
      },
      {
        id: '2',
        text: 'lorem! sdkq wrwepo uweop',
        time: '1.25',
      },
      {
        id: '2',
        text: 'lorem! sdkq wrwepo uweop wsetgwert iwep',
        time: '1.26',
      },
      {
        id: '1',
        text: 'lorem! sdkg hierg er ',
        time: '1.28',
      },
      {
        id: '1',
        text: 'lorem! sdkg hierg er gerth rsth rty hj',
        time: '1.29',
      },
      {
        id: '1',
        text: 'lorem! sdkg ertu epwort eji',
        time: '1.30',
      },
      {
        id: '2',
        text: 'lorem! sdkq wrwepo uwwe t ru e6ui eop',
        time: '1.32',
      },
      {
        id: '2',
        text: 'lorem! sdkq wrw eftge yrwawer hq3wuirt qipuwty oqhhbvuh igh h wepo uweop wsetgwert iwep',
        time: '1.33',
      },
      {
        id: '2',
        text: 'lorem! wrwepo uweop',
        time: '1.33',
      },
      {
        id: '2',
        text: 'lorem! sdkq  ertyioqt yheerg rwepo uweop wsetgwert iwep',
        time: '1.34',
      },
      {
        id: '1',
        text: 'lorem! sdkg hierg dkrgh drgh sei',
        time: '1.23',
      },
      {
        id: '2',
        text: 'lorem! sdkq wrwepo uweop',
        time: '1.25',
      },
      {
        id: '1',
        text: 'lorem! sdkg hierg dkrgh drgh sei',
        time: '1.23',
      },
      {
        id: '2',
        text: 'lorem! sdkq wrwepo uweop',
        time: '1.25',
      },
      {
        id: '2',
        text: 'lorem! sdkq wrwepo uweop',
        time: '1.25',
      },
      {
        id: '1',
        text: 'lorem! sdkg hierg dkrgh drgh sei',
        time: '1.23',
      },
      {
        id: '1',
        text: 'lorem! sdkg hierg dkrgh drgh sei',
        time: '1.23',
      },
      {
        id: '1',
        text: 'lorem! sdkg hierg dkrgh drgh sei',
        time: '1.23',
      },
      {
        id: '2',
        text: 'lorem! sdkq wrwepo uweop',
        time: '1.25',
      },
      {
        id: '2',
        text: 'lorem! sdkq wrwepo uweop',
        time: '1.25',
      },
      {
        id: '1',
        text: 'lorem! sdkg hierg dkrgh drgh sei',
        time: '1.23',
      },
      {
        id: '2',
        text: 'lorem! sdkq wrwepo uweop',
        time: '1.25',
      },
    ];
    this._sharing.updateChat(chat, item);
    if (window.innerWidth <=767) {
      this.closeChats.emit('true');

    }
  }
}
