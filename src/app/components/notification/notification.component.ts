import { Component, EventEmitter, Output } from '@angular/core';
import { SharingService } from 'src/app/services/sharing.service';
import { MessageComponent } from '../message/message.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  @Output() goHome: EventEmitter<any> = new EventEmitter<any>();
  notification: any[] = [];
  constructor(
    private _sharing: SharingService,
    private MessageComponent: MessageComponent,
    private Router: Router
  ) {}
  ngOnInit(): void {
 

    this._sharing.currentUserData.subscribe((data: any) => {
      if (data.notifications) {
        if (data.notifications?.length != 0) {
          this.notification = [...data.notifications].reverse();
        }
      }
    });
  }
  Close() {
    this.close.emit('true');
  }

  openN(data: any) {
    this.Close();
    console.log(data);
    
    if (data.type == 'chat') {
      this.goHome.emit(data);
      this._sharing.updateChatData({ to: data.data._id });
    } else if (data.type == 'user') {
      this.Router.navigate([`/userProfile/${data.data._id}`]);
      this._sharing.updateUserData();
    } else if (data.type == 'post') {
      this.Router.navigate([`/userProfile/${localStorage.getItem('id')}`]);

      this.goHome.emit(data);
    } else if (data.type == 'story') {
      this.goHome.emit(data);
    }
  }
}
