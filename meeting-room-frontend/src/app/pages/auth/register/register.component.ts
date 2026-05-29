import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;
  
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
    // Check if form is valid
    if (this.registerForm?.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.controls[key].markAsTouched();
      });
      
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Form',
        text: 'Please fix the validation errors before submitting',
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
        // Handle specific error cases
        let errorMessage = 'Please try again';
        
        if (error.error?.error) {
          errorMessage = error.error.error;
        } else if (error.error?.email) {
          errorMessage = 'Email is already registered';
        } else if (error.error?.username) {
          errorMessage = 'Username is already taken';
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: errorMessage,
          confirmButtonColor: '#667eea',
        });
        this.isLoading = false;
      },
    );
  }
}