import { Component } from '@angular/core';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
  activeTap: String = 'Posts';
  hide: any;
  postsFiles: any;
  storyFiles: any;
  reelFiles: any;
  imgStory: any;
  mainImgPost: any;
  reel: any;
  postsSrc: any[] = [];
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
        console.log(event.target.result);
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
        console.log(event.target.result);
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
    const imgs: any[] = [];
    for (let i = 0; i < this.reelFiles.length; i++) {
      const element = this.reelFiles[i];
      const reader = new FileReader();
      reader.readAsDataURL(element);
      reader.onload = (event: any) => {
        console.log(event.target.result);
        if (i == 0) {
          this.reel = event.target.result;
        }
        imgs.push(event.target.result);
      };
    }
    // this.productImg = imgs;
  }
}
