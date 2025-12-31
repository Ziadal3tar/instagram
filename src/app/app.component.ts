import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharingService } from './services/sharing.service';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private _sharing: SharingService,
    private _Socket: SocketService
  ) {
    if (localStorage.getItem('userToken')) {
              this._Socket.connect(localStorage.getItem('userToken'));

      this._sharing.updateUserData();
    }
  }
  ngOnInit(): void {
    this._Socket.listen('notification').subscribe((data: any) => {


      this._sharing.updateUserData();
      const audio = document.getElementById(
        'backgroundAudio'
      ) as HTMLAudioElement;
      audio.play();
    });
  }
}
