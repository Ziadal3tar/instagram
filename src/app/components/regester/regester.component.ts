import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialAuthService, FacebookLoginProvider } from '@abacritt/angularx-social-login';
import { Subject, finalize, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-regester',
  templateUrl: './regester.component.html',
  styleUrls: ['./regester.component.scss'],
})
export class RegesterComponent implements OnInit, OnDestroy {
  loading = false;
  showPassword = false;
  errorResponse = '';
  registerType: 'facebook' | 'google' | null = null;

  readonly signUpForm = new FormGroup({
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    password: new FormControl<string | null>(null, [Validators.required]),
    fullName: new FormControl<string | null>(null, [Validators.required]),
    userName: new FormControl<string | null>(null, [Validators.required]),
    registerType: new FormControl<string | null>('default'),
  });

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly socialAuth: SocialAuthService,
  ) {}

  ngOnInit(): void {
    (window as any).handleCredentialResponse = (response: unknown) => this.handleCredentialResponse(response);

    this.socialAuth.authState
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user && this.registerType === 'facebook') {
          this.registerSocial({
            userName: `${user.firstName}_${user.lastName}`,
            fullName: `${user.firstName} ${user.lastName}`,
            email: user.email,
            profilePic: user.photoUrl,
            profilePicType: 'fbImage',
            registerType: 'facebook',
          });
        }
      });
  }

  signInWithFB(): void {
    this.errorResponse = '';
    this.registerType = 'facebook';
    this.socialAuth.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  handleCredentialResponse(response: any): void {
    try {
      const payload = JSON.parse(atob(String(response?.credential ?? '').split('.')[1]));
      this.registerType = 'google';
      this.registerSocial({
        userName: `${payload.given_name}_${payload.family_name}`,
        fullName: payload.name,
        email: payload.email,
        profilePic: payload.picture,
        profilePicType: 'googleImage',
        registerType: 'google',
      });
    } catch {
      this.errorResponse = 'Unable to sign up with Google.';
    }
  }

  register(): void {
    if (this.signUpForm.invalid || this.loading) return;

    this.errorResponse = '';
    this.loading = true;
    this.auth.register(this.signUpForm.getRawValue())
      .pipe(finalize(() => (this.loading = false)), takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) void this.router.navigate(['/login']);
        },
        error: (error: HttpErrorResponse) => this.setError(error),
      });
  }

  private registerSocial(data: unknown): void {
    if (this.loading) return;

    this.errorResponse = '';
    this.loading = true;
    const request = this.registerType === 'google'
      ? this.auth.loginWithGoogle(data)
      : this.auth.loginWithFB(data);

    request
      .pipe(finalize(() => (this.loading = false)), takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) void this.router.navigate(['/login']);
        },
        error: (error: HttpErrorResponse) => this.setError(error),
      });
  }

  private setError(error: HttpErrorResponse): void {
    this.errorResponse = error.error?.message || 'Unable to create your account. Please try again.';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
