import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductServiceService } from '../../services/product-service.service';
import { Iproduct } from '../../models/iproduct';
import { TranslateModule } from '@ngx-translate/core';

@Component({
 
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Iproduct[] = [];
  paginatedProducts: Iproduct[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 4; // Adjust based on your preference

  constructor(private router: Router, private productService: ProductServiceService) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(products => {
      this.products = products;
      this.updatePaginatedProducts();
    });
  }

  updatePaginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.products.slice(startIndex, endIndex);
  }

  totalPages(): number {
    return Math.ceil(this.products.length / this.itemsPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
    this.updatePaginatedProducts();
  }
  NavigateToDetails(proId:number)
  {
    this.router.navigateByUrl(`/Details/${proId}`);
  }
}
