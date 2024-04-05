import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DealService } from '../../services/deal.service';
import { deal } from '../../models/deal';
import { CommonModule } from '@angular/common';
import { ProductServiceService } from '../../services/product-service.service';
import { Iproduct } from '../../models/iproduct';
import { Icategory } from '../../models/icategory';
import { Router, RouterLink } from '@angular/router';
import { SearchForProudectComponentComponent } from '../search-for-proudect-component/search-for-proudect-component.component';
import { CategoryServiceService } from '../../services/category-service.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AnimationService } from '../../services/animation.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule,RouterLink,SearchForProudectComponentComponent,RouterLink,NgxSpinnerModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  @ViewChild('carousel', { static: true }) carousel!: ElementRef;
  startSlider: number = 0;
  startSlider1: number = 0;
  imgItem: any;
  endSlider: number = 0;
  endSlider1: number = 0;
  deals: deal[] = [];
  CatId:number=0
  categories:Icategory[] = [];
  constructor(private _deal:DealService , 
    private prd:ProductServiceService,
    private router:Router,
    private categoryService:CategoryServiceService,
    private animationService:AnimationService)
  {

  }
  ngOnInit(): void {
    this.animationService.openspinner();
    this._deal.getDeals().subscribe(deals => {
      this.deals = deals;
      this.endSlider = (this.deals.length - 1) * 100;
      this.endSlider1 = (this.deals.length - 1) * 100;
    });

    this.loadCategories();
  }

  handleLeftBtn(): void {
    if (this.startSlider < 0) {
      this.startSlider = this.startSlider + 100;
    }
    this.translateSlider();
  }

  handleRightBtn(): void {
    if (this.startSlider >= -this.endSlider + 100) {
      this.startSlider = this.startSlider - 100;
    }
    this.translateSlider();
  }
  
  handleLeftBtn1(): void {
    if (this.startSlider1 < 0) {
      this.startSlider1 = this.startSlider1 + 100;
    }
    this.translateSlider1();
  }

  handleRightBtn1(): void {
    if (this.startSlider1 >= -this.endSlider1 + 100) {
      this.startSlider1 = this.startSlider1 - 100;
    }
    this.translateSlider1();
  }

  translateSlider(): void {
    this.imgItem.forEach((element: any) => {
      element.style.transform = `translateX(${this.startSlider}%)`;
    });
  }

  translateSlider1(): void {
    this.imgItem.forEach((element: any) => {
      element.style.transform = `translateX(${this.startSlider1}%)`;
    });
  }

  openSidebarNavigation(): void {
    const sidebarNavigationEl = document.getElementById("sidebar-container-navigation-id");
    if (sidebarNavigationEl) {
      sidebarNavigationEl.classList.toggle("slidebar-show");
    }
  }

  closeSidebarNavigation(): void {
    const sidebarNavigationEl = document.getElementById("sidebar-container-navigation-id");
    if (sidebarNavigationEl) {
      sidebarNavigationEl.classList.toggle("slidebar-show");
    }
  }
  getProductsByCategory(categoryId: number): void {
    this.prd.getproudectsbycatogry(categoryId).subscribe(
      (prd) => {
        this.categories = prd;
      },
      (error) => {
        console.error('Error fetching products by category:', error);
      }
    );
  }
  navigateToSearch(name: string, Id: number): void {
    this.router.navigate(['/SearchForProudectComponent'], { queryParams: { name: name, categoryId: Id } });
}
  loadCategories(): void {
    this.categoryService.getAllCategory().subscribe({
      next: (categories: Icategory[]) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }
  
  
}
