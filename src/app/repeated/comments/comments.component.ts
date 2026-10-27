import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent {
  @Input() size: number | string = 38;
  @Input() commentDetails: any;

  toUser(_id: string | undefined): void {
    // Profile navigation is managed by the parent component in this project.
  }
  getTimeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();

  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) {
    return 'Just now';
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d`;
  }

  return new Date(date).toLocaleDateString('en-GB');
}
}
