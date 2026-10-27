import { Component } from '@angular/core';

type ApplicationTab = 'Active' | 'Expired' | 'Removed';

@Component({
  selector: 'app-apps-and-websites',
  templateUrl: './apps-and-websites.component.html',
  styleUrls: ['./apps-and-websites.component.scss'],
})
export class AppsAndWebsitesComponent {
  activeTap: ApplicationTab = 'Active';

  setActiveTab(tab: ApplicationTab): void {
    this.activeTap = tab;
  }
}
