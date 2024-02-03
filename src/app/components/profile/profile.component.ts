import { Component, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SharingService } from 'src/app/services/sharing.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  tap: String = 'posts';
  nameNewCollection: String = '';
  addNewCollection: Boolean = false;
  SelectionStage: Boolean = false;
  edit: Boolean = false;
  setting: Boolean = false;
  follower: Boolean = false;
  following: Boolean = false;
  openCollection: any;
  selected: any = [];
  displayData: any;
  userId: any;
  saved: any[] = [
    {
      id: '0',
      image: './assets/imgs/aboobida.jpg',
    },
    {
      id: '1',
      image: './assets/imgs/anne.jpg',
    },
    {
      id: '2',
      image: './assets/imgs/fortune_wheel-removebg-preview.png',
    },
    {
      id: '3',
      image: './assets/imgs/ivana-square.jpg',
    },
    {
      id: '4',
      image: './assets/imgs/team-4.jpg',
    },
    {
      id: '5',
      image: './assets/imgs/team-3.jpg',
    },
    {
      id: '6',
      image: './assets/imgs/Sophie.jpg',
    },
    {
      id: '7',
      image: './assets/imgs/marie.jpg',
    },
  ];
  collections: any[] = [
    {
      name: 'favorite',
      items: [
        this.saved[5],
        this.saved[3],
        this.saved[1],
        this.saved[6],
        this.saved[0],
      ],
    },
  ];
  constructor(
    private _Route: Router,
    private _sharing: SharingService,
    private _userServices: UserService
  ) {

  }
  ngOnInit(): void {
    let url = this._Route.url.split('/').filter((item: any) => item != '');

    this.userId = localStorage.getItem('id');
    this._sharing.currentProfileDataDisplay.subscribe((data: any) => {





  this.displayData = data;
  if (this.displayData?.followers?.includes(this.userId)) {
    this.following = true;
  } else if (this.displayData?.following?.includes(this.userId)) {
    this.follower = true;
  }else{
    this.following = false;
    this.follower = false;

  }
})

  }
  changeProfileTaps(data: any) {}

  select(item: any) {
    let ifAdded = this.selected.includes(item.id);
    if (ifAdded) {
      for (let i = 0; i < this.selected.length; i++) {
        const element = this.selected[i];
        if (element == item.id) {
          this.selected.splice(i, 1);
        }
      }
    } else {
      this.selected.push(item.id);
    }
  }
  close() {
    this.nameNewCollection = '';
    this.SelectionStage = false;
    this.selected = [];
    this.addNewCollection = false;
  }
  back() {
    this.SelectionStage = false;
  }
  addCollection() {
    let items = [];
    for (let i = 0; i < this.selected.length; i++) {
      const element = this.selected[i];
      const elementSelected = this.saved.find((item) => item.id === element);
      items.push(elementSelected);
    }
    let collection = {
      name: this.nameNewCollection,
      items: items,
    };
    this.collections.push(collection);
    this.close();
  }
  closeSetting(event: any) {
    if (event.target.id == 'close') {
      this.setting = false;
    }
  }
  logOut() {
    localStorage.removeItem('userToken');
    this._Route.navigate(['/register']);
  }
  follow() {
    this._userServices.follow(this.displayData._id).subscribe((data: any) => {
      if (data.success) {

        this._sharing.updateProfileDataDisplay();

      }
    });
  }
}
