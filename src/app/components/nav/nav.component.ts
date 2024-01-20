import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  title = 'insta';
  exploreData: any;
  open: Boolean = false;
  hide: Boolean = false;
  closeSearch: Boolean = true;
  closeMessage: Boolean = true;
  closeNotification: Boolean = true;
  tapId: any;

  onDropdownItemClick(event: any) {
    event.stopPropagation();
  }
  ExploreData(data: any) {
    this.exploreData = data;
    this.open = true;
  }
  closeEX() {
    this.open = false;
    let theDiv: NodeListOf<ChildNode> | any =
      document.getElementById('app-explore')?.childNodes[0];
    theDiv.classList.remove('vh-100');
    theDiv.classList.remove('overflow-hidden');
  }
  openSidePage(data: any) {
    if (data == 'search') {
      this.closeSearch = false;
      this.closeMessage = true;
      this.closeNotification = true;
    } else if (data == 'message') {
      this.closeSearch = true;
      this.closeMessage = false;
      this.closeNotification = true;
    } else if (data == 'Notification') {
      this.closeSearch = true;
      this.closeMessage = true;
      this.closeNotification = false;
    }
  }
  closeTap(data: any, id: any) {
    if (id == 'search') {
      this.closeSearch = data;
    } else if (id == 'message') {
      this.closeMessage = data;
    } else if (id == 'notification') {
      this.closeNotification = data;
    }
  }

  closeAllTaps() {
    this.closeNotification = true;
    this.closeMessage = true;
    this.closeSearch = true;
  }
  openCreate() {
    let Create: any = document.getElementById('Create-tab-pane');
    let tap: any = document.getElementById('myTabContent')?.childNodes;
    for (let i = 0; i < tap.length; i++) {
      const element: any = tap[i];
      const ifhave = element.classList.contains('active');
      if (ifhave) {
        element.classList.remove('active');
        element.classList.remove('show');
        Create.classList.add('active');
        Create.classList.add('show');
        // ---------------
        let lis: HTMLCollection | any =
          document.getElementById('myTab2')?.children;

        // if (lis) {
        for (let i = 0; i < lis.length; i++) {
          const element = lis[i] as HTMLElement | any;
          console.log(element);

          if (element.children[0].classList.contains('active')) {
            element.children[0].tabIndex = -1;
            element.children[0].setAttribute('aria-selected', 'false');
            element.children[0].classList.remove('active');
          }
        }
      }
    }
  }
  closeCreate() {
    let Create: any = document.getElementById('Create-tab-pane');

    Create.classList.remove('active');
    Create.classList.remove('show');
  }
  hideNavs() {
    this.hide = true;
  }
  tapClick(tapName: String) {
    if (tapName == 'home') {
      this.closeAllTaps();
      this.closeEX();
      this.closeCreate();
    } else if (tapName == 'search') {
      this.closeAllTaps();
      this.closeEX();
      this.closeCreate();
    } else if (tapName == 'reel') {
      this.closeAllTaps();
      this.closeEX();
      this.closeCreate();
    } else if (tapName == 'profile') {
      this.closeAllTaps();
      this.closeEX();
      this.closeCreate();
    } else if (tapName == 'message') {
      this.closeEX();
    }
  }
  handelActive() {
    //     let lis:any = document.getElementById('myTap2')?.childNodes
    //     for (let i = 0; i < lis.length; i++) {
    //       const element = lis[i];
    // element.childNodes[0].classList.remove('active')
    //     }
  }
}
