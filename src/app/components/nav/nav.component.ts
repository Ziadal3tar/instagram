import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';

import { CurrentUser } from '../../core/models/api.models';
import { AuthService } from '../../services/auth.service';
import { SharingService } from '../../services/sharing.service';
import { SocketService } from '../../services/socket.service';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
  userData: CurrentUser | null = null;

  showSearch = false;
  showNotifications = false;
  showMobileMenu = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly sharing: SharingService,
    private readonly auth: AuthService,
    private readonly socket: SocketService,
    private readonly session: SessionService,
  ) {}

  ngOnInit(): void {
    this.sharing.currentUserData
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.userData = user;
      });

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd =>
            event instanceof NavigationEnd,
        ),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.closePanels();
      });

    this.sharing.updateUserData(false);
  }

  get notificationCount(): number {
    return (
      this.userData?.unseenNotifications ??
      this.userData?.notifications?.filter((item) => !item.seen).length ??
      0
    );
  }

  isActive(path: string): boolean {
    return (
      this.router.url === path ||
      this.router.url.startsWith(`${path}/`)
    );
  }

  go(path: string): void {
    this.showMobileMenu = false;
    void this.router.navigate([path]);
  }

  toggleMobileMenu(): void {
    if (this.showMobileMenu) {
      this.closeMobileMenu();
      return;
    }

    this.closePanels();
    this.showMobileMenu = true;
  }

  closeMobileMenu(): void {
    this.showMobileMenu = false;
  }

  openNotificationsFromMenu(): void {
    this.closeMobileMenu();
    this.showSearch = false;
    this.showNotifications = true;
  }

  toggleSearch(): void {
    this.showMobileMenu = false;
    this.showNotifications = false;
    this.showSearch = !this.showSearch;
  }

  toggleNotifications(): void {
    this.showMobileMenu = false;
    this.showSearch = false;
    this.showNotifications = !this.showNotifications;
  }

  closePanels(): void {
    this.showSearch = false;
    this.showNotifications = false;
    this.showMobileMenu = false;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closePanels();
  }

  openProfile(): void {
    const id = this.userData?._id || this.session.userId;

    if (id) {
      this.go(`/userProfile/${id}`);
    }
  }

  logout(): void {
    this.showMobileMenu = false;
    this.socket.disconnect();
    this.auth.logout();

    void this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
