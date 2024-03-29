import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Icategory } from '../../models/icategory';
import { CategoryServiceService } from '../../services/category-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import {  EventEmitter, Output } from '@angular/core';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,CommonModule,FormsModule ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  categories: Icategory[] = [];
  searchQuery: string = '';
  @Output() categorySelected = new EventEmitter<number>();

  //@Output() categorySelected = new EventEmitter<number>(); 
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

  searchProducts(): void {
    if (this.searchQuery !== '') {
      this.router.navigateByUrl(`/SearchForProudectComponent/${this.searchQuery}`);
      console.log(this.searchQuery)
    }
  }
  
  selectCategory(categoryId: number): void {
    this.categorySelected.emit(categoryId);
  }
  
}