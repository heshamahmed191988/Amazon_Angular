import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Icategory } from '../../models/icategory';
import { CategoryServiceService } from '../../services/category-service.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  categories: Icategory[] = [];

  constructor(private authService: AuthService, private router: Router,private _CategoryService: CategoryServiceService) {}

  ngOnInit(): void {
   
    this._CategoryService.getAllCategory().subscribe({
      next: (res) => {
        this.categories = res;
        console.log(this.categories)
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}