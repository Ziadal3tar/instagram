import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

import { SocialAuthService } from '@abacritt/angularx-social-login';
import { FacebookLoginProvider } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-regester',
  templateUrl: './regester.component.html',
  styleUrls: ['./regester.component.scss'],
})
export class RegesterComponent {
  signUpForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
    fullName: new FormControl(null, [Validators.required]),
    userName: new FormControl(null, [Validators.required]),
    registerType: new FormControl(null),
  });

  user: any;
  loggedIn: any;
  registerType: any;
  loading: Boolean = false;
  ErrorResponse: String = '';

  constructor(
    private _auth: AuthService,
    private _Route: Router,
    private authService: SocialAuthService,
  ) {}

  ngOnInit(): void {

       alert(
  'Login Info\n' +
  'Email: admin@gmail.com\n' +
  'Password: admin'
);
    (window as any).handleCredentialResponse =
      this.handleCredentialResponse.bind(this);
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = user != null;
      if (this.registerType == 'facebook') {
        this.loading = !this.loading;
        let data = {
          userName: `${user.firstName}_${user.lastName}`,
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.email,
          profilePic: user.photoUrl,
          profilePicType: 'fbImage',
          registerType: this.registerType,
        };

        this._auth.loginWithFB(data).subscribe((data: any) => {
          this.loading = !this.loading;

          if (data.success) {
        this.ErrorResponse = '';

            this._Route.navigate(['/login']);
          }
        },
        (err: HttpErrorResponse) => {
        this.loading = !this.loading;



        });
      }
    });
  }

  signInWithFB(): void {
    this.registerType = 'facebook';
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  handleCredentialResponse(response: any) {
    const responsePayload = JSON.parse(atob(response.credential.split('.')[1]));
    JSON.parse(atob(response.credential.split('.')[1]));
    this.registerType = 'google';
    if (this.registerType == 'google') {
      this.loading = !this.loading;
      let data = {
        userName: `${responsePayload.given_name}_${responsePayload.family_name}`,
        fullName: responsePayload.name,
        email: responsePayload.email,
        profilePic: responsePayload.picture,
        profilePicType: 'googleImage',
        registerType: this.registerType,
      };
      this._auth.loginWithGoogle(data).subscribe((data: any) => {
        this.loading = !this.loading;
        if (data.success) {
        this.ErrorResponse = '';

          this._Route.navigate(['/login']);
        }
      },
      (err: HttpErrorResponse) => {
        this.loading = !this.loading;

        this.ErrorResponse = err.error.message;
      });
    }
  }

  register() {
    this.loading = !this.loading;

    let data = this.signUpForm.value;

    this._auth.register(data).subscribe(
      (response: any) => {
        console.log(response);

        if (response.message == 'added successfully') {
          this.ErrorResponse = '';
          this._Route.navigate(['/login']);
        }
      },
      (err: any) => {
        this.loading = !this.loading;
        this.ErrorResponse = err.error.message;
      }
    );
  }
}
