import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @Output() close:EventEmitter<any> = new EventEmitter<any>

  searched: any[] = [
    {
      id: '1',
      name: 'mosalah',
      userName: 'Mohamed Salah',
      image: './assets/imgs/mosalah.jpg',
      followers: '63M',
    },
    {
      id: '2',
      name: 'annemarie',
      userName: 'ANNE-MARIE',
      image: './assets/imgs/anne.jpg',
      followers: '9.6M',
    },
    {
      id: '3',
      name: 'aboutrikamohammed',
      userName: 'محمد ابوتريكة',
      image: './assets/imgs/MAB.jpg',
      followers: '8B',
    },
  ];
  clear(data: Number) {
    if (data == 0) {
      this.searched = [];
    } else {
      let newSheared = [];
      for (let i = 0; i < this.searched.length; i++) {
        const element = this.searched[i];
        if (element.id != data) {
          newSheared.push(element);
        }
      }
      this.searched = newSheared;
    }
  }
  Close(){
this.close.emit('true')
  }
}
