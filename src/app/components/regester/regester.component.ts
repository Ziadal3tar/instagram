import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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
  });
  constructor(private _auth: AuthService,private _Route:Router) {}
  register() {
    let data = this.signUpForm.value;
    this._auth.register(data).subscribe((data: any) => {
      if (data.message == 'added successfully') {
        this._Route.navigate(['/login'])
      }
    });
  }
}
