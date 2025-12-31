import { HttpErrorResponse } from '@angular/common/http';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SharingService } from 'src/app/services/sharing.service';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { SocialAuthService } from '@abacritt/angularx-social-login';
import { FacebookLoginProvider } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { SocketService } from 'src/app/services/socket.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  user: any;
  loggedIn: any;
  registerType: any;
  loading: Boolean = false;
  ErrorResponse: String = '';
  logInForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
  });
  constructor(
    private _auth: AuthService,
    private _sharing: SharingService,
    private _Route: Router,
    private _Socket: SocketService,
    private authService: SocialAuthService
  ) {}
  ngOnInit(): void {
    localStorage.clear();
    this.logInForm.value.registerType = 'default';

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
        this._auth.logInWithFbOrGoogle(data).subscribe(
          (data: any) => {
            this.loading = !this.loading;
            data;

            if (data.success) {
              this.ifSuccess(data);
            }
          },
          (err: HttpErrorResponse) => {
            this.ErrorResponse = err.error.message;
          }
        );
      }
    });
  }

  logInWithFB(): void {
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
        profilePicType: 'fbImage',
        registerType: this.registerType,
      };
      this._auth.logInWithFbOrGoogle(data).subscribe(
        (data: any) => {
          this.loading = !this.loading;
          if (data.success) {
            this.ifSuccess(data);
          }
        },
        (err: HttpErrorResponse) => {
          this.ErrorResponse = err.error.message;
        }
      );
    }
  }
  logIn() {
    this.loading = true;

    this.ErrorResponse = '';
    const data = this.logInForm.value;
    this._auth.logIn(data).subscribe(
      (response: any) => {
        console.log(response);

        if (response.message === 'welcome') {
          this.ifSuccess(response);
        }
        this.loading = false;
      },
      (err: any) => {
        console.log(err);

        this.loading = !this.loading;
        this.ErrorResponse = err.error.message;
      }
    );
  }

  ifSuccess(data: any) {

    localStorage.setItem('userToken', data.token);
              this._Socket.connect(data.token);

    localStorage.setItem('id', data.id);
    this._Route.navigate([`/userProfile/${data.id}`]);
    this._sharing.updateUserData();
  }
}
