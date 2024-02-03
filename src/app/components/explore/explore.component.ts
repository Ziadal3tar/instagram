import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent {
  a1: any;
  a2: any;
  a3: any;
  q1: any;
  q2: any;
  q3: any;
  screen:any
  @Output() EXPLORE : EventEmitter<any> = new EventEmitter<any>();
  @Output() SEARCH : EventEmitter<any> = new EventEmitter<any>();
  @Input() userData:any



   allSearch:Boolean = false

constructor(){

}

  ngOnInit(): void {
    if (window.innerWidth > 900) {
      this.screen = 'lg'
    } else if (window.innerWidth < 900 && window.innerWidth > 600) {
      this.screen = 'md'
    } else if (window.innerWidth < 600) {
      this.screen = 'sm'
    }
  }
  array: any[] = [
    {
      type: 'video',
      src: './assets/imgs/WhatsApp Video 2023-10-24 at 21.21.05_182fd982.mp4',
    },

    {
      type: 'image',
      src: './assets/imgs/anne.jpg',
    },
    {
      type: 'image',
      src: './assets/imgs/me.jpg',
    },
    {
      type: 'image',
      src: './assets/imgs/marie.jpg',
    },
    {
      type: 'image',
      src: './assets/imgs/ivana-square.jpg',
    },
    {
      type: 'image',
      src: './assets/imgs/mosalah.jpg',
    },
  ];
  openSearch(){
    this.SEARCH.emit('Search');

  }
  openEX(item:any){

    this.EXPLORE.emit(item);
    let theDiv:NodeListOf<ChildNode>|any = document.getElementById('app-explore')?.childNodes[0];
    theDiv.classList.add('vh-100')
    theDiv.classList.add('overflow-hidden')
  }

}
