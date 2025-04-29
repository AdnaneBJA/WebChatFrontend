import { Component } from '@angular/core';
import { HttpService } from '../services/httpservices/http.service';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(public httpService: HttpService) {}

  onSubmit() {
    console.log('Form submitted');
    console.log(this.username, this.email, this.password);

    const user = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

    this.httpService.registerUser(user).subscribe(
      (res) => {
        console.log('Result of insertion: ', res);
        this.resetValues();
      },
      (err) => {
        console.log('Error when inserting user: ', err);
      }
    );
  }

  resetValues() {
    this.username = '';
    this.password = '';
    this.email = '';
  }
}
