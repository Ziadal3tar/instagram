import { Component } from '@angular/core';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
})
export class SubscriptionsComponent {
  showHelp = false;

  toggleHelp(): void {
    this.showHelp = !this.showHelp;
  }
}
