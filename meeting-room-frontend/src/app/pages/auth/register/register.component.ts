import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

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
  isLoading = false;
  hidePassword = true;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  register() {
    if (!this.first_name || !this.last_name || !this.username || !this.email || !this.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Required Fields',
        text: 'Please fill in all fields',
        confirmButtonColor: '#667eea',
      });
      return;
    }

    this.isLoading = true;

    const data = {
      first_name: this.first_name,
      last_name: this.last_name,
      username: this.username,
      email: this.email,
      password: this.password,
    };

    this.authService.register(data).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: response.message,
          confirmButtonColor: '#667eea',
        }).then(() => {
          this.router.navigate(['/login']);
        });
        this.isLoading = false;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: error.error.error || 'Please try again',
          confirmButtonColor: '#667eea',
        });
        this.isLoading = false;
      },
    );
  }
}