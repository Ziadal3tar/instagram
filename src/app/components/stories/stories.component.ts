import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss'],
})
export class StoriesComponent {
  @Input() storyData: any[] = [];
  yourNumber: any = 0;
  stop: Boolean = false;
  imgId: number = 0;
  counter: any = 5;
  timeoutId: any;
  time = 6;
  constructor() {}
  ngAfterViewInit(): void {
    // document.documentElement.style.setProperty(
    //   '--storyLength',
    //   this.storyData.length.toString()
    // );
    document.documentElement.style.setProperty('--time', this.time.toString());
    // document.documentElement.style.setProperty(
    //   '--counter',
    //   this.counter.toString()
    // );
    this.startStory();
  }

  startStory() {
    for (let i = 0; i < this.storyData.length; i++) {
      const NextStory = setTimeout(() => {
        if (i != 0) {
          this.imgId++;
        }
        for (let c = 1; c < 6; c++) {
          const counter = setTimeout(() => {
            // if (this.stop) {
            //   let count = c + 1;
            //   this.time = 0;
            //   document.documentElement.style.setProperty(
            //     '--time',
            //     this.time.toString()
            //   );
            //   document.documentElement.style.setProperty(
            //     '--counter',
            //     count.toString()
            //   );
            //   this.stopCounter();
            // }
          }, c * 1000);
          this.timeoutArray.push(counter);
        }
      }, i * 5100);
      this.timeoutArray.push(NextStory);
    }
  }

  timeoutArray: any[] = [];

  Counter(): void {
    for (let i = 1; i <= 5; i++) {
      const timeout = setTimeout(() => {
      }, i * 1000);
      this.timeoutArray.push(timeout);
    }
  }

  stopCounter(): void {
    this.timeoutArray.forEach((timeout) => clearTimeout(timeout));
    this.timeoutArray = [];
  }

  clear(): void {
    this.stop = true;
  }
}
