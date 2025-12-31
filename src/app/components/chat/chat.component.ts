import {
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { SharingService } from 'src/app/services/sharing.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;

  search: Boolean = false;
  chat: any;
  chatExists: any;
  researched: any[] = [];
  searchText: String = '';
  message: any;
  userId: any;

  constructor(
    private _sharing: SharingService,
    private renderer: Renderer2,
    private _user: UserService,
    private _chat: ChatService,
    private _Socket: SocketService
  ) {
    this._sharing.currentSearch.subscribe((data: any) => {
      this.search = data;
    });
  }
  ngAfterViewInit() {
    var chatContainer:any = document.getElementById('scrollableDiv');
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
  ngOnInit(): void {

    this._Socket.listen('notification').subscribe((data: any) => {
      this._sharing.updateChatData({ to: this.chat._id });
      const audio = document.getElementById('backgroundAudio') as HTMLAudioElement;
      audio.play();
    });
    this._sharing.currentChatData.subscribe((data: any) => {
      this.chat = data.user;
      this.userId = localStorage.getItem('id');
      this.chatExists = data.chat;

    });
  }
  ngAfterViewChecked() {}
  getChat() {
    let data = {
      text: this.searchText,
    };
    if (
      this.searchText != '' &&
      this.searchText != undefined &&
      this.searchText != null
    ) {
      this._user.searchUser(data).subscribe(
        (data: any) => {
          this.researched = data;
        }
 
      );
    }
  }
  scrollToBottom(): void {
    try {
      this.renderer.setProperty(
        this.chatContainer.nativeElement,
        'scrollTop',
        this.chatContainer.nativeElement.scrollHeight
      );
    } catch (err) {}
  }
  send() {
    if (this.message && this.message != '') {
      let data = {
        message: this.message,
        to: this.chat._id,
        time: new Date().toLocaleTimeString('en-US', {
          hour12: true,
        }),
      };
      this._chat.sendMessage(data).subscribe((data: any) => {
        if (data.success) {
          this._Socket.emit('sendMessage', this.chat._id);
          this._Socket.emit('notification',{eventName:'message',type:'chat',data:localStorage.getItem('id'),redirect:this.chat._id,to:this.chat._id})

          this._sharing.updateChatData({ to: this.chat._id });
          this.message = '';
        }
      });
    }
  }
  closeChat() {
    this.chat = null
  }
}
