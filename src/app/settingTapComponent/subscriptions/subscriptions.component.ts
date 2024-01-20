import { Component } from '@angular/core';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent {
  active( event: any) {
    if (event.target.childNodes[1].classList.contains('bi-chevron-right')) {
      event.target.childNodes[1].classList.replace(
        'bi-chevron-right',
        'bi-chevron-down'
      );
    } else {
      event.target.childNodes[1].classList.replace(
        'bi-chevron-down',
        'bi-chevron-right'
      );
    }
    let desc = document.getElementById(`desc1`);
    if (desc?.classList.contains('active')) {
      desc.classList.remove('active');
    } else {
      desc?.classList.add('active');
    }
  }
}
