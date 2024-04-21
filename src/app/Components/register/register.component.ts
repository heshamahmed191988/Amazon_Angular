// RegisterComponent

import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule,NgClass],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  password = '';
  email = '';
  confirmPassword = '';
  roleName = 'User';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    const user = {
      userName: this.username,
      password: this.password,
      email: this.email,
      confirmPassword: this.confirmPassword,
      roleName: this.roleName,
    };

    this.authService.register(user).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration failed', error);
        if (error.status && error.status < 300) {
          // This check ensures even if there is an error object, we proceed if the status is under 300 (successful response)
          this.router.navigate(['/login']);
        } else {
          this.handleRegistrationError(error);
        }
      }
    });
  }

  handleRegistrationError(error: any): void {
    this.errorMessage = "An unexpected error occurred. Please try again later.";
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      if (error.status === 400) {
        this.errorMessage = error.error.message || "Registration failed: Invalid input.";
      } else {
        this.errorMessage = error.statusText || this.errorMessage;
      }
    }
  }
}
