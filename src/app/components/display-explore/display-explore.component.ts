import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-display-explore',
  templateUrl: './display-explore.component.html',
  styleUrls: ['./display-explore.component.scss']
})
export class DisplayExploreComponent {
  @Input() exploreData:any
  exploreDataa:any = {
    type: 'image',
    src: '../../../assets/imgs/me.jpg',
  }


  @Output() open : EventEmitter<any> = new EventEmitter<any>() ;
  showDiv: boolean = false;
  mouseX: number = 0;
  mouseY: number = 0;
  divTop: string = '0';
  divLeft: string = '0';
data={
  name:'ksdujfghv'
}
  onMouseMove(event: MouseEvent) {

    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    this.divTop = `${event.clientY}px`;
    this.divLeft = `${(event.clientX)-60}px`;
  }
  mouseleave(event:any){
    const relatedTargetName = (event.relatedTarget as HTMLElement).id;
    if (relatedTargetName != 'dataWhenHover') {
this.showDiv = false
    }

  }
  hideDiv() {
    this.showDiv = false;
  }

}
