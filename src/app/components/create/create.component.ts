import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';
import { ReelService } from 'src/app/services/reel.service';
import { SharingService } from 'src/app/services/sharing.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
  activeTap: String = 'Posts';
  hide: any;
  captionPost: any;
  captionReel: any;
  captionStory: any;
  postsFiles: any;
  storyFiles: any;
  reelFiles: any;
  imgStory: any;
  mainImgPost: any;
  reel: any;
  postsSrc: any[] = [];
  loading: Boolean = false;
  ErrorResponse: any;

  constructor(private _posts: PostsService, private _sharing: SharingService,private _reels: ReelService) {}
  uploadPost(event: any) {
    this.hide = '';
    const { files } = event.target;
    this.postsFiles = files;
    const imgs: any[] = [];
    for (let i = 0; i < this.postsFiles.length; i++) {
      const element = this.postsFiles[i];
      const reader = new FileReader();
      reader.readAsDataURL(element);
      reader.onload = (event: any) => {
        if (i == 0) {
          this.mainImgPost = event.target.result;
        }
        imgs.push(event.target.result);
      };
    }
    this.postsSrc = imgs;
  }
  uploadStory(event: any) {
    this.hide = '';
    const { files } = event.target;
    this.storyFiles = files;
    const imgs: any[] = [];
    for (let i = 0; i < this.storyFiles.length; i++) {
      const element = this.storyFiles[i];
      const reader = new FileReader();
      reader.readAsDataURL(element);
      reader.onload = (event: any) => {
        if (i == 0) {
          this.imgStory = event.target.result;
        }
        imgs.push(event.target.result);
      };
    }
    // this.productImg = imgs;
  }
  uploadReel(event: any) {
    // this.hide = '';
    const { files } = event.target;
    this.reelFiles = files;
    // console.log(this.reelFiles);

    // const imgs: any[] = [];
    // for (let i = 0; i < this.reelFiles.length; i++) {
    // const element = this.reelFiles[i];
    const reader = new FileReader();
    reader.readAsDataURL(this.reelFiles[0]);
    reader.onload = (event: any) => {
      // if (i == 0) {
      this.reel = event.target.result;
      // }
      // imgs.push(event.target.result);
      // };
    };
  }

  addPost() {
    this.loading = !this.loading;

    const formData = new FormData();
    for (let i = 0; i < this.postsFiles.length; i++) {
      const element = this.postsFiles[i];
      let type = element.type.split('/')[0];
      formData.append(type, element);
    }
    formData.append('caption', this.captionPost);
    this._posts.addPost(formData).subscribe(
      (data: any) => {
        if (data.success) {
          this._sharing.updateUserData();
          this.loading = !this.loading;
        }
      },
      (err: HttpErrorResponse) => {
        this.loading = !this.loading;

        this.ErrorResponse = err.error.message;
      }
    );
  }
  addReel() {
    this.loading = !this.loading;

    const formData = new FormData();
    // for (let i = 0; i < this.postsFiles.length; i++) {
    //   const element = this.postsFiles[i];
    //   let type = element.type.split('/')[0];
    formData.append('reel', this.reelFiles[0]);
    // }
    formData.append('caption', this.captionReel);
    this._reels.addReel(formData).subscribe(
      (data: any) => {
        if (data.success) {
          this._sharing.updateUserData();
          this.loading = !this.loading;
        }
      },
      (err: HttpErrorResponse) => {
        this.loading = !this.loading;

        this.ErrorResponse = err.error.message;
      }
    );
  }
}
