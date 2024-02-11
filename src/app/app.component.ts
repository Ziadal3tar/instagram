
import {
  Component,
} from '@angular/core';
import { Router } from '@angular/router';
import { SharingService } from './services/sharing.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent  {
constructor(private _sharing : SharingService){
  if (localStorage.getItem('userToken')) {

    this._sharing.updateUserData()
  }

}
ngOnInit(): void {
  // localStorage.clear()

}
}

