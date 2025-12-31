import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-image',
  templateUrl: './user-image.component.html',
  styleUrls: ['./user-image.component.scss']
})
export class UserImageComponent {
  @Input() story:Boolean= false
  @Input() data:any
  @Input() size:any
  ngOnInit(): void {
  }
}
