import { Component, EventEmitter, Output } from '@angular/core';
import { SharingService } from 'src/app/services/sharing.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  @Output() close:EventEmitter<any> = new EventEmitter<any>
  notification:any[]=[]
  constructor(private _sharing:SharingService){}
ngOnInit(): void {
this._sharing.updateUserNotification()
this._sharing.currentUserNotification.subscribe((data:any)=>{
this.notification = data
for (let i = 0; i < data.length; i++) {
  const element = data[i];

}
})
}
  Close(){
    this.close.emit('true')
      }
}
