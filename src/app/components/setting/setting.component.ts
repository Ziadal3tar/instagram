import { Component, EventEmitter, Output } from '@angular/core';

type SettingTab =
  | 'Edit profile'
  | 'Apps and websites'
  | 'Email notifications'
  | 'Push notifications'
  | 'What you see'
  | 'Who can see your content'
  | 'How others can interact with you'
  | 'Supervision'
  | 'Help'
  | 'Subscriptions';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent {
  @Output() close = new EventEmitter<string>();

  activeTap: SettingTab = 'Edit profile';

  setActiveTab(tab: SettingTab): void {
    if (tab === 'Supervision') {
      return;
    }

    this.activeTap = tab;
  }

  Close(): void {
    this.close.emit('false');
  }
}
