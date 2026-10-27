import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialAuthService, FacebookLoginProvider } from '@abacritt/angularx-social-login';
import { Subject, finalize, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SharingService } from '../../services/sharing.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loading = false;
  showPassword = false;
  errorResponse = '';
  registerType: 'facebook' | 'google' | null = null;

  readonly logInForm = new FormGroup({
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    password: new FormControl<string | null>(null, [Validators.required]),
  });

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly auth: AuthService,
    private readonly sharing: SharingService,
    private readonly router: Router,
    private readonly socialAuth: SocialAuthService,
  ) {}

  ngOnInit(): void {
    (window as any).handleCredentialResponse = (response: unknown) => this.handleCredentialResponse(response);

    this.socialAuth.authState
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user && this.registerType === 'facebook') {
          this.loginSocial({
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

  logInWithFB(): void {
    this.errorResponse = '';
    this.registerType = 'facebook';
    this.socialAuth.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  handleCredentialResponse(response: any): void {
    try {
      const payload = JSON.parse(atob(String(response?.credential ?? '').split('.')[1]));
      this.registerType = 'google';
      this.loginSocial({
        userName: `${payload.given_name}_${payload.family_name}`,
        fullName: payload.name,
        email: payload.email,
        profilePic: payload.picture,
        profilePicType: 'googleImage',
        registerType: 'google',
      });
    } catch {
      this.errorResponse = 'Unable to sign in with Google.';
    }
  }

  logIn(): void {
    if (this.logInForm.invalid || this.loading) return;

    this.errorResponse = '';
    this.loading = true;

    this.auth.logIn(this.logInForm.getRawValue())
      .pipe(finalize(() => (this.loading = false)), takeUntil(this.destroy$))
      .subscribe({
        next: (response:any) => {
          console.log(response);
// localStorage.setItem('token', response.token);
          if (response.success){ this.onSuccess()};
        },
        error: (error: HttpErrorResponse) => this.setError(error),
      });
  }

  private loginSocial(data: unknown): void {
    if (this.loading) return;

    this.errorResponse = '';
    this.loading = true;

    this.auth.logInWithFbOrGoogle(data)
      .pipe(finalize(() => (this.loading = false)), takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) this.onSuccess();
        },
        error: (error: HttpErrorResponse) => this.setError(error),
      });
  }

  private onSuccess(): void {
    this.sharing.updateUserData(true);
    this.router.navigate(['/home']);
  }

  private setError(error: HttpErrorResponse): void {
    this.errorResponse = error.error?.message || 'Unable to sign in. Please try again.';
  }

  /** Fill the login form with the public demo account credentials. */
  useDemoCredentials(): void {
    this.errorResponse = '';
    this.logInForm.patchValue({
      email: 'demo@gmail.com',
      password: 'Demo12345!',
    });
    this.logInForm.markAsDirty();
    this.logInForm.markAllAsTouched();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
