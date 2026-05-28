import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  first_name = '';

  last_name = '';

  username = '';

  email = '';

  password = '';

  errorMessage = '';

  successMessage = '';

  constructor(
    private authService: AuthService,

    private router: Router,
  ) {}

  register() {
    const data = {
      first_name: this.first_name,

      last_name: this.last_name,

      username: this.username,

      email: this.email,

      password: this.password,
    };

    this.authService.register(data).subscribe(
      (response: any) => {
        this.successMessage = response.message;

        this.errorMessage = '';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },

      (error) => {
        this.errorMessage = error.error.error;

        this.successMessage = '';
      },
    );
  }
}
