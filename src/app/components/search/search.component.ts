import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SharingService } from 'src/app/services/sharing.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  @Output() toProfile: EventEmitter<any> = new EventEmitter<any>();
  @Output() allSearch: EventEmitter<any> = new EventEmitter<any>();
  searchText: string = '';
  searched: any[] = [];
  closeSearch: Boolean = true;
  closeSearchIcone: Boolean = false;
  @Input() userData: any;
  recent: Boolean = true;
  constructor(
    private _user: UserService,
    private _sharing: SharingService,
    private Router: Router
  ) {}
  ngOnInit(): void {

    if(window.innerWidth >= 768){
      this.closeSearchIcone = false
    }else{
      this.closeSearchIcone = true

    }

    if (this.userData?.visited.length != 0) {
      this.searched = this.userData?.visited;
      this.recent = true;
    }
  }
  clear(data: Number) {
    if (data == 0) {
      this.searched = [];
    } else {
      let newSheared = [];
      for (let i = 0; i < this.searched.length; i++) {
        const element = this.searched[i];
        if (element._id != data) {
          newSheared.push(element);
        }
      }
      this.searched = newSheared;
    }
  }
  Close() {
    if(window.innerWidth >= 768){
      this.close.emit('true');
    }else{
this.closeSearch = !this.closeSearch
      const searchElement = document.getElementById('search');

      if (searchElement) {
if (this.closeSearch) {
  searchElement.style.setProperty('height', '100%', 'important');

}else(

  searchElement.style.setProperty('height', '5vh', 'important')
)
    }
    }

  }
  search() {

    let data = {
      text: this.searchText,
    };
    if (
      this.searchText != '' &&
      this.searchText != undefined &&
      this.searchText != null
    ) {

      this._user.searchUser(data).subscribe(
        (data: any) => {
          this.recent = false;
console.log(data);

          this.searched = data;
        },
        (err: HttpErrorResponse) => {
          if (
            err.error.message ==
            'No users found containing the specified character'
          ) {
            this.recent = true;
            this.searched = this.userData.visited;
          }
        }
      );
    } else if (this.searchText == '') {
      this.recent = true;
      this.searched = this.userData.visited;
    }
  }
  toUserProfile(data: any) {
    this.Router.navigate([`/userProfile/${data._id}`]);
    this._user.visited(data._id).subscribe((x: any) => {
      if (x.success) {
        this._sharing.updateUserData()
this.toProfile.emit('')
      }
    });
  }
}
