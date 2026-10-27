import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { SharingService } from 'src/app/services/sharing.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-your-collections',
  templateUrl: './your-collections.component.html',
  styleUrls: ['./your-collections.component.scss'],
})
export class YourCollectionsComponent {
  @Input() collections: any[] = [];
  @Input() post: any;
  @Input() ref: any;
  @Output() close = new EventEmitter<any>();

  collectionSelected: string | null = null;
  saving = false;
  errorMessage = '';

  constructor(
    private readonly userService: UserService,
    private readonly sharingService: SharingService,
  ) {}

  getId(collection: any): string {
    return String(collection?._id ?? '');
  }

  trackById(_: number, collection: any): string {
    return this.getId(collection);
  }

  closeCollections(): void {
    if (this.saving) return;
    this.close.emit('');
  }

  select(_event: Event, collection: any): void {
    if (this.saving) return;
    this.collectionSelected = this.getId(collection) || null;
    this.errorMessage = '';
  }

  save(): void {
    if (!this.collectionSelected || !this.post?._id || this.saving) return;

    this.saving = true;
    this.errorMessage = '';

    this.userService
      .addToCollection({
        collectionId: this.collectionSelected,
        selected: [this.post._id],
      })
      .subscribe({
        next: (response: any) => {
          this.saving = false;

          if (response?.success) {
            this.sharingService.updateSaved(true);
            this.close.emit('');
            return;
          }

          this.errorMessage = response?.message || 'Could not save this post to the collection. Please try again.';
        },
        error: (error: any) => {
          this.saving = false;
          this.errorMessage = error?.error?.message || 'Could not save this post. Check your connection and try again.';
        },
      });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeCollections();
  }
}
