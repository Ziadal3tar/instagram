import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-display-collection',
  templateUrl: './display-collection.component.html',
  styleUrls: ['./display-collection.component.scss']
})
export class DisplayCollectionComponent {
  @Input() collections:any
 @Output() sendData = new EventEmitter<any>();



}
