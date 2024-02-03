import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-reels-comments',
  templateUrl: './reels-comments.component.html',
  styleUrls: ['./reels-comments.component.scss']
})
export class ReelsCommentsComponent {
  comment:any
  @Output() closeComments: EventEmitter<any> = new EventEmitter<any>();
@Input() reel:any
constructor(private _post:PostsService){}
close(){

  this.closeComments.emit('')
}

  addReelComment(){
  console.log(this.reel);

    console.log(this.comment);
let data = {
  comment: this.comment,
  _id: this.reel._id,
  type:'reel'
}
this._post.addComment(data).subscribe((data:any)=>{
  console.log(data);
if (data.success) {
this.reel = data.post
}
})
  }
}
