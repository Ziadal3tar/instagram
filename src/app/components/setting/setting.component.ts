import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent {
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  activeTap:String='Edit profile'
  Close() {
    this.close.emit('false');
  }
}
