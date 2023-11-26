import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hoverdata',
  templateUrl: './hoverdata.component.html',
  styleUrls: ['./hoverdata.component.scss']
})
export class HoverdataComponent {
  @Input() data:any
}
