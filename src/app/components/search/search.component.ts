import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  switchMap,
  of,
  map,
  catchError,
} from 'rxjs';

import { CurrentUser, UserSummary } from '../../core/models/api.models';
import { SharingService } from '../../services/sharing.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  @Input() userData: CurrentUser | null = null;

  @Output() close = new EventEmitter<boolean>();
  @Output() toProfile = new EventEmitter<string>();

  searchText = '';
  searched: UserSummary[] = [];
  loading = false;
  recent = true;
  searchError = false;

  private readonly search$ = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly userService: UserService,
    private readonly sharing: SharingService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.searched = (this.userData?.visited || []) as UserSummary[];

    this.search$
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        switchMap((value) => {
          const query = value.trim();

          if (!query) {
            this.loading = false;
            this.recent = true;
            this.searchError = false;

            return of({
              users: (this.userData?.visited || []) as UserSummary[],
              recent: true,
            });
          }

          this.recent = false;
          this.loading = true;
          this.searchError = false;

          return this.userService.searchUser(query).pipe(
            map((response) => ({
              users: response.data?.users || [],
              recent: false,
            })),
            catchError(() => {
              this.searchError = true;

              return of({
                users: [] as UserSummary[],
                recent: false,
              });
            }),
          );
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(({ users, recent }) => {
        this.searched = users;
        this.recent = recent;
        this.loading = false;
      });
  }

  onSearch(value: string): void {
    this.searchText = value;
    this.search$.next(value);
  }

  clear(id?: string): void {
    if (!id) {
      this.searched = [];
      return;
    }

    this.searched = this.searched.filter(
      (item) => String(item._id) !== String(id),
    );
  }

  closePanel(): void {
    this.close.emit(true);
  }

  toUserProfile(user: UserSummary): void {
    if (!user?._id) return;

    this.userService.visited(user._id).subscribe({
      complete: () => this.sharing.refreshCurrentUser(),
    });

    this.closePanel();
    this.toProfile.emit(user._id);

    void this.router.navigate(['/userProfile', user._id]);
  }

  trackById(_: number, item: UserSummary): string {
    return item._id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
