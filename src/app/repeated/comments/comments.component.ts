import { Component, Input } from '@angular/core';
import { NavComponent } from 'src/app/components/nav/nav.component';
import { SharingService } from 'src/app/services/sharing.service';
import { DisplaypostsComponent } from '../displayposts/displayposts.component';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent {
@Input() size:any
@Input() commentDetails:any
// constructor(private _sharing:SharingService, private _nav:NavComponent,private _Displayposts:DisplaypostsComponent){}
  toUser(id:any){
    // console.log(id);
    // this._nav.tap = 'Profile'
    // this._Displayposts.closePost()
    // this._sharing.toUser(id)
  }
}
