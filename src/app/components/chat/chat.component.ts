import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { SharingService } from 'src/app/services/sharing.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;

  search: Boolean = false;
  chat: any[] = [];
  researched: String = '';
  message: any;
  friend: any;
  constructor(private _sharing: SharingService,private renderer: Renderer2) {
    this._sharing.currentSearch.subscribe((data: any) => {
      this.search = data;
    });
    this._sharing.currentChat.subscribe((data: any) => {
      this._sharing.currentFriend.subscribe((data: any) => {
        this.friend = data;
      });
      this.chat = data;

    });
  }
   ngAfterViewChecked() {
  }

  scrollToBottom(): void {
    try {
      this.renderer.setProperty(this.chatContainer.nativeElement, 'scrollTop', this.chatContainer.nativeElement.scrollHeight);
    } catch(err) { }
  }
  send() {
    if (this.message && this.message != '') {
    }
  }
  closeChat(){
    this.chat = []
  }
}
