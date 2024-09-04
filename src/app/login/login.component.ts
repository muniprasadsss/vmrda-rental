import { Component } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,PrimeNgModule,RouterOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private router:Router){}
  username: string = '';
  password: string = '';
  formError: string = '';
  Login(form: any) {
    if (form.valid) {
      this.router.navigateByUrl("/dashboard")
      this.formError = '';
    } else {
      this.formError = 'Please fill out both username and password.';
      form.controls.username.markAsTouched();
      form.controls.password.markAsTouched();
    }
  }
}
