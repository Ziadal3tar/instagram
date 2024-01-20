import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-qnotifications',
  templateUrl: './qnotifications.component.html',
  styleUrls: ['./qnotifications.component.scss'],
})
export class QnotificationsComponent {
  @Input() data: any;
  if2: any = ['Off', 'On'];
  if3: any = ['Off', 'From profiles I follow', 'From everyone'];
  @Output() value: EventEmitter<any> = new EventEmitter<any>();
  Value: any;
  constructor() {}
  ngOnInit(): void {
    this.Value = this.data.value;

    let inputs = document.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
      const element = inputs[i];

      let ifIt = false;
      for (let x = 0; x < element.classList.length; x++) {
        const elementX = element.classList[x];
        if (this.Value == 'Off') {
          if (elementX == this.Value) {
            ifIt = true;
          }
        }else{
          var wordsArray = this.Value.split(' ');

          if (elementX == wordsArray[1]) {
            ifIt = true;
          }
        }

      }
      if (ifIt) {
        element.checked = true;
      }
    }
  }
  check(event: any, divId: any, value: any) {
    let id = event.target.id;
    let inputs: any = document.getElementById(divId);
    for (let i = 0; i < inputs?.childNodes.length; i++) {
      const element = inputs?.childNodes[i];
      let item: any = element?.childNodes[0]?.childNodes[0];
      if (item?.id != id) {
        item.checked = false;
      } else {
        this.Value = value;
        this.value.emit(value);
      }
    }
  }
}
