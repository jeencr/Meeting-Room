import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  login() {
    const data = {
      username: this.username,
      password: this.password,
    };

    this.authService.login(data).subscribe(
      (response: any) => {
        localStorage.setItem('user_id', response.user_id);

        localStorage.setItem('username', response.username);

        localStorage.setItem('group', response.group);

        if (response.group == 'Admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/rooms']);
        }
      },

      (error) => {
        this.errorMessage = error.error.error;
      },
    );
  }
}
