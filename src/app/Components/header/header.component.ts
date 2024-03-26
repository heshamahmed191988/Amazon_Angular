import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Icategory } from '../../models/icategory';
import { CategoryServiceService } from '../../services/category-service.service';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../register/register.component';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,CommonModule,RegisterComponent,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isloggd: boolean = false;
  categories: Icategory[] = [];

  constructor(private authService: AuthService, private router: Router,private CategoryService:CategoryServiceService) {}
  ngOnInit(): void {
    // this.isloggd = this.authService.isLoggedIn();
    this.authService.getloggedstatus().subscribe((loggedStatus) => {
      this.isloggd = loggedStatus;

      this.CategoryService.getAllCategory().subscribe({
        next: (res) => {
          this.categories = res;
          //console.log(this.categories)
        },
        error: (error) => {
          console.error('Error fetching categories:', error);
        }
      });
    })
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}


