import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-image',
  templateUrl: './user-image.component.html',
  styleUrls: ['./user-image.component.scss'],
})
export class UserImageComponent {
  @Input() story: boolean = false;
  @Input() data: any;
  @Input() size: number | string = 40;

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement | null;
    if (!image) return;

    if (image.dataset['fallbackApplied'] === 'true') {
      image.style.visibility = 'hidden';
      return;
    }

    image.dataset['fallbackApplied'] = 'true';
    image.src = './assets/imgs/anne.jpg';
  }
}
