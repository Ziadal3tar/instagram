import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { SharingService } from './services/sharing.service';
import { SocketService } from './services/socket.service';
import { SessionService } from './core/services/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly sharing: SharingService,
    private readonly socket: SocketService,
    private readonly session: SessionService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.socket.listen<any>('notification')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => this.sharing.applyIncomingNotification(event));

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntil(this.destroy$),
    ).subscribe(() => {
      if (this.session.hasToken()) this.startSession();
    });

    if (this.session.hasToken()) this.startSession();
  }

  private startSession(): void {
    if (!this.session.token) return;
    this.socket.connect();
    this.sharing.updateUserData(false);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.socket.disconnect();
  }
}
