import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule,TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userName: string | undefined; // Renamed for consistency with the 'Login' interface
  password: string | undefined;
  errorMessage: string | undefined;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (this.userName && this.password) {
      this.authService.login({userName: this.userName, password: this.password }).subscribe({
        next: (data) => {
          console.log('Login successful', data);
          localStorage.setItem('token', data.token); //'data.token' is  JWT token
          this.router.navigate(['/main']);
        },
        error: (error) => {
          console.error('Login failed', error);
          this.errorMessage = 'Invalid login attempt. Please try again.';
        }
      });
    }
  }
}
