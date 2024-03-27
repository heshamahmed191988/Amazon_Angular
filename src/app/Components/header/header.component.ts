import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Icategory } from '../../models/icategory';
import { CategoryServiceService } from '../../services/category-service.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  public totalITeam:number=0
  isloggd: boolean = false;
  categories: Icategory[] = [];

  constructor(private authService: AuthService, private router: Router,
    private CategoryService:CategoryServiceService,private _cart:CartService) {}
  ngOnInit(): void {
    // this.isloggd = this.authService.isLoggedIn();
    this.authService.getloggedstatus().subscribe((loggedStatus) => {
      this.isloggd = loggedStatus;

      this.CategoryService.getAllCategory().subscribe({
        next: (res) => {
          this.categories = res;
          console.log(this.categories)
        },
        error: (error) => {
          console.error('Error fetching categories:', error);
        }
      });
    })
  this._cart.getProduct()
   .subscribe(res=>{
    this.totalITeam=res.length;

   })
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}


