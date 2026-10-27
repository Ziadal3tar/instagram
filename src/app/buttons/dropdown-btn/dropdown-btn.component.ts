import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown-btn',
  templateUrl: './dropdown-btn.component.html',
  styleUrls: ['./dropdown-btn.component.scss']
})
export class DropdownBtnComponent {
@Input()lis:any[]=[]
@Input()indexes:any[]=[]
@Output()toAddToCollection:EventEmitter<any>= new EventEmitter<any>()
onclick(data:any){
  console.log(data);
  
  if (data == 'Add from saved') {
this.toAddToCollection.emit('Add from saved')
  }else if(data == 'Delete collection'){
this.toAddToCollection.emit('delete')

  }
}
}









