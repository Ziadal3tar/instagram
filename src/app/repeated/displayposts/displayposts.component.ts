import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-displayposts',
  templateUrl: './displayposts.component.html',
  styleUrls: ['./displayposts.component.scss']
})
export class DisplaypostsComponent {
@Input() data:any
open:Boolean = false
displayPost:any
openPost(data:any){
  this.open = true
  // document.styleSheets[0].insertRule('body { height: 100vh; }', 0);
  // document.styleSheets[0].insertRule('body { overflow-y: hidden; }', 0);
  document.getElementsByTagName('body')[0].style.overflowY = 'hidden';


 this.displayPost= data
}
closePost(){
  document.getElementsByTagName('body')[0].style.overflowY = 'auto';
  this.open = false

}
}
