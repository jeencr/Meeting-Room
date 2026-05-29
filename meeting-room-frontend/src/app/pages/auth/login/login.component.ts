import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username = '';
  password = '';
  isLoading = false;
  hidePassword = true;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  login() {
    if (!this.username || !this.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Required Fields',
        text: 'Please enter both username and password',
        confirmButtonColor: '#667eea',
      });
      return;
    }

    this.isLoading = true;

    const data = {
      username: this.username,
      password: this.password,
    };

    this.authService.login(data).subscribe(
      (response: any) => {
        localStorage.setItem('user_id', response.user_id);
        localStorage.setItem('username', response.username);
        localStorage.setItem('group', response.group);

        Swal.fire({
          icon: 'success',
          title: 'Welcome!',
          text: `Logged in as ${response.username}`,
          timer: 1500,
          showConfirmButton: false,
        });

        if (response.group == 'Admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/rooms']);
        }
        
        this.isLoading = false;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.error.error || 'Invalid credentials',
          confirmButtonColor: '#667eea',
        });
        this.isLoading = false;
      },
    );
  }
}