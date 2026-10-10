import { Component } from '@angular/core';

interface HelpTopic {
  qus: string;
  desc: string;
  icon: string;
}

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent {
  expandedIndex: number | null = null;

  readonly qus: HelpTopic[] = [
    {
      qus: 'Help Center',
      desc:
        'Find information about account settings, profile management, ' +
        'posts, messages and the features available in your account.',
      icon: 'bi-question-circle',
    },
    
    {
      qus: 'Account Status',
      desc:
        'Review account-related notices and learn where to look for ' +
        'information about restrictions or feature availability.',
        icon: 'bi-person-check',
    },
    {
      qus: 'Privacy and Security Help',
      desc:
        'Learn more about privacy controls, password security and ' +
        'ways to help protect your account.',
      icon: 'bi-shield-lock'
    },
    {
      qus: 'Support Requests',
      desc:
        'Find guidance on checking the status of reports or support ' +
        'requests submitted from your account, when this feature is available.',
      icon: 'bi-chat-left-text'
    },
  ];

  active(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }
}
