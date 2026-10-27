import { Component, Input } from '@angular/core';
import { SharingService } from 'src/app/services/sharing.service';
import { NavComponent } from '../nav/nav.component';
import { DisplaypostsComponent } from 'src/app/repeated/displayposts/displayposts.component';

@Component({
  selector: 'app-hoverdata',
  templateUrl: './hoverdata.component.html',
  styleUrls: ['./hoverdata.component.scss']
})
export class HoverdataComponent {
  @Input() data:any
  // constructor(private _sharing:SharingService, private _nav:NavComponent,private _Displayposts:DisplaypostsComponent){}
  
  ngOnInit(): void {
    console.log(this.data);
    
  }
    toUser(id:any){
    console.log(id);
    // this._nav.tap = 'Profile'
    // this._Displayposts.closePost()
    // this._sharing.toUser(id)
  }
}
