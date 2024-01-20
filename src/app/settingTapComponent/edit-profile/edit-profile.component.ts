import { Component } from '@angular/core';
import { SharingService } from 'src/app/services/sharing.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {
  bio:String=''
  checked:any
  image:any
  url:String = ''
  userData:any
  changed:Boolean = false
  loading:Boolean = false
  constructor(
    private _userService: UserService,
    private _sharing: SharingService,
  ) {

  }
  ngOnInit(): void {
    this._sharing.currentUserData.subscribe((data: any) => {
      this.userData = data;
      this.url = data.profilePic
    });
  }

  upload(event: any) {
    this.changed = !this.changed
    const file = event.target.files[0];
    this.image = file;

   // Assuming you want to display the selected image in the template
   const reader = new FileReader();
   reader.onload = (e) => {
     this.url = e.target?.result as string;
   };
   reader.readAsDataURL(file);
  }
  save() {
this.loading = !this.loading

    // this.loading=true
    const formdata = new FormData();
    formdata.append('image', this.image);
    this._userService.changeUserImage(formdata).subscribe((data: any) => {
      if (data.success) {
        this.changed = !this.changed
        this.loading = !this.loading
      }
    });
  }
  cancel() {
    this.changed = !this.changed
    this.url = this.userData.profilePic;
  }
}
