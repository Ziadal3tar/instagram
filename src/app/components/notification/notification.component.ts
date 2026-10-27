import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { NotificationItem } from '../../core/models/api.models';
import { SharingService } from '../../services/sharing.service';
import { UserService } from '../../services/user.service';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<boolean>();

  notification: NotificationItem[] = [];
  markingAllRead = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly sharing: SharingService,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly session: SessionService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.sharing.currentUserData
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.notification = [...(user?.notifications ?? [])].sort(
          (a, b) =>
            String(b.createdAt ?? '').localeCompare(
              String(a.createdAt ?? ''),
            ),
        );

        this.cdr.markForCheck();
      });
  }

  get hasUnread(): boolean {
    return this.notification.some((item) => !item.seen);
  }

  get unreadCount(): number {
    return this.notification.filter((item) => !item.seen).length;
  }

  closePanel(): void {
    this.close.emit(true);
  }

  openN(item: NotificationItem): void {
    const id = item.data?._id || item.actorId;

    this.closePanel();

    if (
      id &&
      (item.type === 'user' ||
        item.type === 'follow' ||
        item.type === 'chat')
    ) {
      if (item.type === 'chat') {
        void this.router.navigate(['/messages'], {
          queryParams: { to: id },
        });
      } else {
        void this.router.navigate(['/userProfile', id]);
      }

      return;
    }

    if (item.type === 'post') {
      const currentId = this.session.userId;

      if (currentId) {
        void this.router.navigate(['/userProfile', currentId]);
      }
    }
  }

  markAllRead(): void {
    if (!this.hasUnread || this.markingAllRead) return;

    this.markingAllRead = true;
    this.cdr.markForCheck();

    this.userService
      .allNotificationSeen()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.markingAllRead = false;
          this.sharing.refreshCurrentUser();
          this.cdr.markForCheck();
        },
        error: () => {
          this.markingAllRead = false;
          this.cdr.markForCheck();
        },
      });
  }

  formatTime(value: string | Date | null | undefined): string {
    if (!value) return '';

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) return '';

    const elapsed = Math.max(0, Date.now() - date.getTime());
    const minutes = Math.floor(elapsed / 60_000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;

    const hours = Math.floor(minutes / 60);

    if (hours < 24) return `${hours}h`;

    const days = Math.floor(hours / 24);

    if (days < 7) return `${days}d`;

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  }

  trackById(index: number, item: NotificationItem): string {
    return String(item._id ?? index);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
