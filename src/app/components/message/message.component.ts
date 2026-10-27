import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import {
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  of,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs';

import {
  ChatMessage,
  ChatSummary,
  CurrentUser,
  UserSummary,
} from '../../core/models/api.models';

import { SharingService } from '../../services/sharing.service';
import { UserService } from '../../services/user.service';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent implements OnInit, OnDestroy {
  userData: CurrentUser | null = null;

  chats: ChatSummary[] = [];

  searchText = '';

  searchResults: UserSummary[] = [];

  activeChatId = '';

  searchLoading = false;

  searchError: string | null = null;

  private readonly search$ = new Subject<string>();

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly sharing: SharingService,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly session: SessionService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  /* =====================================================
     LIFECYCLE
  ===================================================== */

  ngOnInit(): void {
    this.sharing.currentUserData
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.userData = user;
        this.chats = user?.chats ?? [];


        this.cdr.markForCheck();
      });

    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.activeChatId = params.get('to') || '';

        this.cdr.markForCheck();
      });

    /*
     * Debounced user search.
     * switchMap cancels obsolete requests while typing.
     */
    this.search$
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        startWith(''),

        switchMap((value) => {
          const query = value.trim();

          this.searchError = null;

          if (!query) {
            this.searchLoading = false;
            this.searchResults = [];

            this.cdr.markForCheck();

            return of(null);
          }

          this.searchLoading = true;

          this.cdr.markForCheck();

          return this.userService
            .searchUser(query)
            .pipe(
              catchError(() => {
                this.searchError =
                  'Search failed. Please try again.';

                return of(null);
              }),

              finalize(() => {
                this.searchLoading = false;
                this.cdr.markForCheck();
              }),
            );
        }),

        takeUntil(this.destroy$),
      )
      .subscribe((response) => {
        this.searchResults =
          response?.data?.users ?? [];

        this.cdr.markForCheck();
      });
  }

  /* =====================================================
     ACTIVE CONVERSATION
  ===================================================== */

  get activeChatUser(): UserSummary | null {
    if (!this.activeChatId) {
      return null;
    }

    const existingChat = this.findChatByOtherUser(
      this.activeChatId,
    );

    if (existingChat) {
      return this.otherUser(existingChat);
    }

    return (
      this.searchResults.find(
        (person) =>
          String(person._id) ===
          String(this.activeChatId),
      ) ?? null
    );
  }

  isConversationActive(chat: ChatSummary): boolean {
    const person = this.otherUser(chat);

    return Boolean(
      person &&
      String(person._id) ===
        String(this.activeChatId),
    );
  }

  private findChatByOtherUser(
    userId: string,
  ): ChatSummary | undefined {
    return this.chats.find((chat) =>
      (chat.userIds ?? []).some((member) => {
        const memberId =
          typeof member === 'object' && member !== null
            ? member._id
            : member;

        return String(memberId) === String(userId);
      }),
    );
  }

  /**
   * Resolve the other participant from the chat.
   */
  otherUser(chat: ChatSummary): UserSummary | null {
    const myId = String(this.session.userId ?? '');

    const participants =
      (chat.userIds ?? []) as unknown as Array<
        UserSummary | string
      >;

    const other = participants.find((member) => {
      const id =
        typeof member === 'object' && member !== null
          ? member._id
          : member;

      return String(id ?? '') !== myId;
    });

    if (!other || typeof other === 'string') {
      return null;
    }

    return other as UserSummary;
  }

  /* =====================================================
     LAST MESSAGE PREVIEW
  ===================================================== */

  chatPreview(chat: ChatSummary): string {
    const messages = chat.messages ?? [];

    if (!messages.length) {
      return '';
    }

    const lastMessage =
      messages[messages.length - 1] as ChatMessage;

    if (!lastMessage?.message) {
      return '';
    }

    const sender = lastMessage.sender as unknown as
      | string
      | { _id?: string };

    const senderId =
      typeof sender === 'object' && sender !== null
        ? sender._id
        : sender;

    const messageText = String(
      lastMessage.message,
    ).replace(/\s+/g, ' ').trim();

    const preview =
      messageText.length > 45
        ? `${messageText.slice(0, 45)}…`
        : messageText;

    if (
      String(senderId ?? '') ===
      String(this.session.userId ?? '')
    ) {
      return `You: ${preview}`;
    }

    return preview;
  }

  /* =====================================================
     SEARCH
  ===================================================== */

  onSearch(value: string): void {
    this.searchText = value;

    this.search$.next(value);
  }

  clearSearch(input: HTMLInputElement): void {
    input.value = '';

    this.searchText = '';
    this.searchResults = [];
    this.searchError = null;
    this.searchLoading = false;

    this.search$.next('');

    this.cdr.markForCheck();

    input.focus();
  }

  focusSearch(input: HTMLInputElement): void {
    input.focus();
  }

  /* =====================================================
     NAVIGATION
  ===================================================== */

  selectChat(userId: string): void {
    if (!userId) {
      return;
    }

    this.searchText = '';
    this.searchResults = [];
    this.searchError = null;
    this.searchLoading = false;

    this.search$.next('');

    this.cdr.markForCheck();

    void this.router.navigate(
      ['/messages'],
      {
        queryParams: {
          to: userId,
        },
      },
    );
  }

  closeChat(): void {
    void this.router.navigate(['/messages']);
  }

  /* =====================================================
     IMAGE FALLBACK
  ===================================================== */

  onAvatarError(event: Event): void {
    const image =
      event.target as HTMLImageElement;

    if (
      image.dataset['fallbackApplied'] === 'true'
    ) {
      image.style.visibility = 'hidden';
      return;
    }

    image.dataset['fallbackApplied'] = 'true';

    image.src = './assets/imgs/placeholder.png';
  }

  /* =====================================================
     TRACK BY
  ===================================================== */

  trackById(
    _: number,
    item: { _id: string },
  ): string {
    return String(item._id);
  }

  /* =====================================================
     CLEANUP
  ===================================================== */

  ngOnDestroy(): void {
    this.search$.complete();

    this.destroy$.next();
    this.destroy$.complete();
  }
}
