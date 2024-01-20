import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SharingService } from 'src/app/services/sharing.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  ErrorResponse: String = '';
  logInForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
  });
  constructor(private _auth: AuthService,private _sharing: SharingService, private _Route: Router) {}

  logIn() {
    this.ErrorResponse = '';
    let data = this.logInForm.value;
    this._auth.logIn(data).subscribe(
      (data: any) => {
        if (data.message == 'welcome') {
          localStorage.setItem('userToken', data.token);
          this._Route.navigate([`/home`]);
        }
      },
      (err: HttpErrorResponse) => {
        this.ErrorResponse = err.error.message;
      }
    );
  }
}
