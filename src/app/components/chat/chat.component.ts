import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import {
  Subject,
  finalize,
  takeUntil,
} from 'rxjs';

import {
  ChatMessage,
  UserSummary,
} from '../../core/models/api.models';

import { ChatService } from '../../services/chat.service';
import { SharingService } from '../../services/sharing.service';
import { SocketService } from '../../services/socket.service';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('chatContainer')
  chatContainer?: ElementRef<HTMLDivElement>;

  @ViewChild('messageInput')
  messageInput?: ElementRef<HTMLTextAreaElement>;

  user: UserSummary | null = null;

  messages: ChatMessage[] = [];

  message = '';

  loading = true;

  sending = false;

  currentUserId = '';

  loadError: string | null = null;

  sendError: string | null = null;

  private targetId = '';

  private loadSequence = 0;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly chatService: ChatService,
    private readonly sharing: SharingService,
    private readonly socket: SocketService,
    private readonly session: SessionService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  /* =====================================================
     LIFECYCLE
  ===================================================== */

  ngOnInit(): void {
    this.currentUserId = this.session.userId || '';

    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const id = params.get('to') || '';

        if (id && id !== this.targetId) {
          this.load(id);
        }
      });

    this.socket
      .listen<any>('notification')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        const payload = event?.payload;

        if (
          this.targetId &&
          payload?.type === 'chat' &&
          (
            String(payload.data) === this.targetId ||
            String(payload.from) === this.targetId
          )
        ) {
          this.load(this.targetId, true);
        }
      });
  }

  /* =====================================================
     LOAD CONVERSATION
  ===================================================== */

  private load(
    targetId: string,
    silent = false,
  ): void {
    if (!targetId) {
      return;
    }

    const requestId = ++this.loadSequence;

    const targetChanged =
      targetId !== this.targetId;

    this.targetId = targetId;

    if (targetChanged) {
      this.user = null;
      this.messages = [];
      this.message = '';
      this.sendError = null;
      this.loadError = null;
    }

    if (!silent || targetChanged) {
      this.loading = true;
    }

    this.cdr.markForCheck();

    this.chatService
      .getChat(targetId, 80)
      .pipe(
        takeUntil(this.destroy$),

        finalize(() => {
          if (requestId !== this.loadSequence) {
            return;
          }

          this.loading = false;

          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (response:any) => {
          if (
            requestId !== this.loadSequence ||
            this.targetId !== targetId
          ) {
            return;
          }

          if (!response?.success || !response.data) {
            console.log(response);

            if (!silent) {
              this.loadError =
                'The server did not return the conversation data.';
            }

            this.cdr.markForCheck();
            return;
          }

          const previousMessages = this.messages;

          const shouldStickToBottom =
            !silent || this.isNearBottom();

          this.user = response.data.user;

          this.messages = Array.isArray(
            response.data.chat?.messages,
          )
            ? response.data.chat.messages
            : [];

          this.loadError = null;

          this.cdr.markForCheck();

          if (shouldStickToBottom) {
            this.scheduleScrollToBottom();
          } else if (
            previousMessages.length === 0 &&
            this.messages.length > 0
          ) {
            this.scheduleScrollToBottom();
          }
        },

        error: () => {
          if (requestId !== this.loadSequence) {
            return;
          }

          if (!silent) {
            this.loadError =
              'Unable to load messages. Check your connection and try again.';
          }

          this.cdr.markForCheck();
        },
      });
  }

  retryLoad(): void {
    if (this.targetId) {
      this.loadError = null;
      this.load(this.targetId);
    }
  }

  /* =====================================================
     SEND MESSAGE
  ===================================================== */

  send(): void {
    const value = this.message.trim();

    const recipientId = this.targetId;

    if (
      !value ||
      !recipientId ||
      this.sending ||
      !this.currentUserId
    ) {
      return;
    }

    this.sending = true;
    this.sendError = null;

    const messageTime = new Date().toLocaleTimeString(
      'en-US',
      {
        hour: 'numeric',
        minute: '2-digit',
      },
    );

    /*
     * Optimistic UI: display the message immediately.
     */
    const optimistic: ChatMessage = {
      _id: `local-${Date.now()}`,
      message: value,
      sender: this.currentUserId,
      time: messageTime,
    };

    this.messages = [
      ...this.messages,
      optimistic,
    ];

    this.message = '';

    this.resetComposerHeight();

    this.cdr.markForCheck();

    this.scheduleScrollToBottom();

    this.chatService
      .sendMessage(
        recipientId,
        value,
        messageTime,
      )
      .pipe(
        takeUntil(this.destroy$),

        finalize(() => {
          this.sending = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: (response) => {
          const stillInSameConversation =
            this.targetId === recipientId;

          if (
            !response?.success ||
            !response.data?.message
          ) {
            if (stillInSameConversation) {
              this.messages = this.messages.filter(
                (item) => item._id !== optimistic._id,
              );

              this.message = value;

              this.sendError =
                'The message could not be sent. Please try again.';
            }

            this.cdr.markForCheck();
            return;
          }

          if (stillInSameConversation) {
            const returnedMessage =
              response.data.message;

            const returnedId = String(
              returnedMessage._id,
            );

            /*
             * Replace the temporary message and avoid duplicates
             * if a socket reload already delivered the saved message.
             */
            this.messages = [
              ...this.messages.filter(
                (item) =>
                  item._id !== optimistic._id &&
                  String(item._id) !== returnedId,
              ),
              returnedMessage,
            ];

            this.sendError = null;

            this.cdr.markForCheck();

            this.scheduleScrollToBottom();
          }

          this.sharing.refreshCurrentUser();

          this.socket.emit('notification', {
            eventName: 'message',
            type: 'chat',
            data: this.currentUserId,
            to: recipientId,
            redirect: recipientId,
          });
        },

        error: () => {
          if (this.targetId === recipientId) {
            this.messages = this.messages.filter(
              (item) => item._id !== optimistic._id,
            );

            this.message = value;

            this.sendError =
              'Unable to send the message. Check your connection and try again.';

            this.cdr.markForCheck();
          }
        },
      });
  }

  /* =====================================================
     COMPOSER
  ===================================================== */

  onComposerKeydown(event: KeyboardEvent): void {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.isComposing
    ) {
      event.preventDefault();

      this.send();
    }
  }

  resizeComposer(event: Event): void {
    const textarea =
      event.target as HTMLTextAreaElement;

    textarea.style.height = 'auto';

    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      125,
    )}px`;
  }

  private resetComposerHeight(): void {
    const textarea =
      this.messageInput?.nativeElement;

    if (textarea) {
      textarea.style.height = 'auto';
    }
  }

  /* =====================================================
     MESSAGE HELPERS
  ===================================================== */

  isMine(item: ChatMessage): boolean {
    const sender = item.sender as unknown as
      | string
      | { _id?: string };

    const senderId =
      typeof sender === 'object' && sender !== null
        ? sender._id
        : sender;

    return String(senderId ?? '') === this.currentUserId;
  }

  isOptimistic(item: ChatMessage): boolean {
    return String(item._id ?? '').startsWith('local-');
  }

  trackById(
    index: number,
    item: ChatMessage,
  ): string {
    return String(item._id ?? index);
  }

  /* =====================================================
     SCROLL
  ===================================================== */

  private isNearBottom(): boolean {
    const element =
      this.chatContainer?.nativeElement;

    if (!element) {
      return true;
    }

    return (
      element.scrollHeight -
        element.scrollTop -
        element.clientHeight <
      140
    );
  }

  scrollToBottom(): void {
    const element =
      this.chatContainer?.nativeElement;

    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }

  private scheduleScrollToBottom(): void {
    /*
     * Allow Angular to render the new message before scrolling.
     */
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);
  }

  /* =====================================================
     NAVIGATION
  ===================================================== */

  backToList(): void {
    void this.router.navigate(['/messages']);
  }

  openUserProfile(): void {
    const userId = (
      this.user as UserSummary & { _id?: string }
    )?._id;

    if (userId) {
      void this.router.navigate([
        '/userProfile',
        userId,
      ]);
    }
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
     CLEANUP
  ===================================================== */

  ngOnDestroy(): void {
    this.loadSequence++;

    this.destroy$.next();
    this.destroy$.complete();
  }
}
