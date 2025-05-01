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

  constructor(private router: Router, private httpService: HttpService) {}

  onSubmit() {
    console.log('Form submitted');
    console.log(`Username: ${this.username}, Password: ${this.password}`);

    const user = {
      username: this.username,
      password: this.password,
    };

    // Login the user and put the jwt token in local storage
    this.httpService.loginUser(user).subscribe(
      (res) => {
        localStorage.setItem('jwtToken', res);

        this.httpService.retrieveUserInfo(user).subscribe(
          (res: any) => {
            const email = res.email;
            const username = res.username;
            const userID = res.id;
            const avatar = res.profilePicture;

            localStorage.setItem('userID', userID);
            localStorage.setItem('email', email);
            localStorage.setItem('username', username);
            localStorage.setItem('avatar', avatar);
            console.log(res);
          },
          (err) => {
            console.log('Error when retrieving user info: ', err);
          }
        );

        this.router.navigate(['/profile']);
      },
      (err) => {
        console.log('Login error: ', err);
      }
    );

    // Retrive the user's info (username, email, picture)

    this.resetValues();
  }

  resetValues() {
    this.username = '';
    this.password = '';
  }
}
