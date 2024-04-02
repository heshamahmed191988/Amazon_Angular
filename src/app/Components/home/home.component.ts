import { Component, OnInit } from '@angular/core';
import { deal } from '../../models/deal';

import { DealService } from '../../services/deal.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  startSlider: number = 0;
  startSlider1: number = 0;
  imgItem: any;
  endSlider: number = 0;
  endSlider1: number = 0;
  deals: deal[] = [];


  constructor(private _deal: DealService) { }

  ngOnInit(): void {
    this._deal.getDeals().subscribe(deals => {
      this.deals = deals;
      this.imgItem = document.querySelectorAll(".today_deals_product_item");
      this.endSlider = (this.imgItem.length - 1) * 100;
      this.endSlider1 = (this.imgItem.length - 1) * 100; 
    });
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
}
