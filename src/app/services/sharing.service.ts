import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, of, shareReplay, tap } from 'rxjs';
import { UserService } from './user.service';
import { ApiResponse, CurrentUser, SavedPage, UserSummary } from '../core/models/api.models';
import { SessionService } from '../core/services/session.service';

@Injectable({ providedIn: 'root' })
export class SharingService {
  private readonly userDataSubject = new BehaviorSubject<CurrentUser | null>(null);
  readonly currentUserData = this.userDataSubject.asObservable();

  private readonly savedSubject = new BehaviorSubject<SavedPage>({ page: 1, limit: 50, items: [], hasMore: false });
  readonly currentSaved = this.savedSubject.asObservable();

  private userRequest?: Observable<ApiResponse<{ userData: CurrentUser }>>;
  private savedRequest?: Observable<ApiResponse<SavedPage>>;

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly session: SessionService,
  ) {}

  get currentUser(): CurrentUser | null { return this.userDataSubject.value; }
  get currentSavedPage(): SavedPage { return this.savedSubject.value; }

  updateUserData(force = true): void {
    if (!this.session.hasToken()) {
      this.userDataSubject.next(null);
      return;
    }
    if (!force && (this.userDataSubject.value || this.userRequest)) return;

    this.userRequest = this.userService.getUserData().pipe(
      tap((response) => {
        if (response.success && response.data?.userData) this.userDataSubject.next(response.data.userData);
      }),
      catchError(() => {
        this.session.clear();
        this.userDataSubject.next(null);
        void this.router.navigate(['/login']);
        return of({ success: false } as ApiResponse<{ userData: CurrentUser }>);
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
    this.userRequest.subscribe();
  }

  refreshCurrentUser(): void { this.updateUserData(true); }

  applyIncomingNotification(event: any): void {
    const payload = event?.payload;
    const current = this.userDataSubject.value;
    if (!current || !payload?.text) return;
    const notification = {
      _id: `socket-${Date.now()}`,
      text: payload.text,
      seen: false,
      type: payload.type,
      actorId: payload.data ? String(payload.data) : undefined,
      data: null,
      createdAt: payload.createdAt,
    };
    this.userDataSubject.next({
      ...current,
      notifications: [notification, ...(current.notifications ?? [])].slice(0, 30),
      unseenNotifications: (current.unseenNotifications ?? 0) + 1,
    });
  }

  updateSaved(force = true): void {
    if (!force && this.savedSubject.value.items.length) return;
    if (this.savedRequest && !force) { this.savedRequest.subscribe(); return; }

    this.savedRequest = this.userService.getSaved(1, 50).pipe(
      tap((response) => {
        if (response.success && response.data) this.savedSubject.next(response.data);
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
    this.savedRequest.subscribe();
  }

  upsertSavedLocally(item: any, saved: boolean): void {
    const current = this.savedSubject.value;
    const id = String(item?._id);
    if (!id || id === 'undefined') return;
    const exists = current.items.some((entry) => String(entry._id) === id);
    const items = saved
      ? (exists ? current.items : [item, ...current.items])
      : current.items.filter((entry) => String(entry._id) !== id);
    this.savedSubject.next({ ...current, items });
  }

  applyFollowingState(profile: UserSummary, isFollowing: boolean): void {
    const current = this.userDataSubject.value;
    if (!current) return;
    const following = current.following ?? [];
    const exists = following.some((user) => String(user._id) === String(profile._id));
    const nextFollowing = isFollowing
      ? (exists ? following : [...following, { ...profile }])
      : following.filter((user) => String(user._id) !== String(profile._id));
    this.userDataSubject.next({ ...current, following: nextFollowing });
  }

  toUser(id: string): void { if (id) void this.router.navigate(['/userProfile', id]); }
}
