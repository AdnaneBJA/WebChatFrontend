import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../services/httpservices/http.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(public router: Router, public httpService: HttpService) {}

  onSubmit() {
    console.log('Form submitted');
    console.log(`Username: ${this.username}, Password: ${this.password}`);

    const user = {
      username: this.username,
      password: this.password,
    };

    this.httpService.loginUser(user).subscribe(
      (res) => {
        localStorage.setItem('userID', res);
        console.log('Login result: ', localStorage.getItem('userID'));
      },
      (err) => {
        console.log('Login error: ', err);
      }
    );

    this.resetValues();
    this.router.navigate(['/chatbox']);
  }

  resetValues() {
    this.username = '';
    this.password = '';
  }
}
