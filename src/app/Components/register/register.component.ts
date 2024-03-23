import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  password = '';
  email = '';
  confirmPassword = '';
  roleName = 'User'; // Assuming a default role; adjust as necessary
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
        this.handleRegistrationError(error);
      }
    });
  }


  handleRegistrationError(error: any): void {
    // Default error message
    this.errorMessage = "An unexpected error occurred. Please try again later.";
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      console.error('An error occurred:', error.error.message);
    } else {
      // Backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      // such as custom error messages from your API.
      if (error.status === 400) {
        // Attempt to use server-provided error message, fall back to generic message
        this.errorMessage = error.error.message || "Registration failed: Invalid input.";
      } else {
        // For other statuses, you might want to add additional handling
        this.errorMessage = error.statusText || this.errorMessage;
      }
    }
  }
}
