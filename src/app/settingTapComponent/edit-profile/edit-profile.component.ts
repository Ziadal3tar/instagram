import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CurrentUser } from '../../core/models/api.models';
import { SharingService } from '../../services/sharing.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<boolean>();

  userData: CurrentUser | null = null;
  bio = '';
  previewUrl = '';
  selectedImage?: File;
  savingImage = false;
  savingBio = false;
  error = '';
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly userService: UserService,
    private readonly sharing: SharingService,
  ) {}

  ngOnInit(): void {
    this.sharing.currentUserData.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.userData = user;
      this.bio = user?.bio ?? '';
      this.previewUrl = user?.profilePic?? './assets/imgs/anne.jpg';
    });
  }

  upload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.error = 'Please select an image file.';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.error = 'Image must be smaller than 5 MB.';
      return;
    }
    this.error = '';
    this.selectedImage = file;
    const reader = new FileReader();
    reader.onload = () => this.previewUrl = String(reader.result || '');
    reader.readAsDataURL(file);
  }

  saveImage(): void {
    if (!this.selectedImage || this.savingImage) return;
    const formData = new FormData();
    formData.append('image', this.selectedImage);
    this.savingImage = true;
    this.error = '';
    this.userService.changeUserImage(formData).subscribe({
      next: (response) => {
        this.savingImage = false;
        if (response.success) {
          this.selectedImage = undefined;
          this.sharing.refreshCurrentUser();
        }
      },
      error: (error) => {
        this.savingImage = false;
        this.error = error?.error?.message || 'Unable to update profile photo.';
      },
    });
  }

  saveBio(): void {
    if (this.savingBio) return;
    const value = this.bio.trim();
    this.savingBio = true;
    this.error = '';
    this.userService.bio(value).subscribe({
      next: (response) => {
        this.savingBio = false;
        if (response.success) this.sharing.refreshCurrentUser();
      },
      error: (error) => {
        this.savingBio = false;
        this.error = error?.error?.message || 'Unable to update bio.';
      },
    });
  }

  closePage(saved = false): void {
    this.close.emit(saved);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
