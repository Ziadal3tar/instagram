import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';
import { SharingService } from 'src/app/services/sharing.service';

@Component({
  selector: 'app-reels-comments',
  templateUrl: './reels-comments.component.html',
  styleUrls: ['./reels-comments.component.scss'],
})
export class ReelsCommentsComponent {
  comment: any;
  userData: any;
  @Output() closeComments: EventEmitter<any> = new EventEmitter<any>();
  @Input() reel: any;
  constructor(private _post: PostsService, private _sharing:SharingService) {}
  close() {
    this.closeComments.emit('');
  }
ngOnInit(): void {
this._sharing.currentUserData.subscribe((data:any)=>{
  console.log(data);
this.userData = data
})
}
  addReelComment() {
    let data = {
      comment: this.comment,
      _id: this.reel._id,
      type: 'reel',
    };
    this._post.addComment(data).subscribe((data: any) => {
      if (data.success) {
        this.reel = data.post;

      }
    });
  }

}
