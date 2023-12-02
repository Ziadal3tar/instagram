import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-displayposts',
  templateUrl: './displayposts.component.html',
  styleUrls: ['./displayposts.component.scss']
})
export class DisplaypostsComponent {
@Input() data:any
}
