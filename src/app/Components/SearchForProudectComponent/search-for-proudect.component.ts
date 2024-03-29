import { Component, Input, OnInit } from '@angular/core';
import{ProductServiceService} from '../../services/product-service.service';
import { Iproduct } from '../../models/iproduct';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-for-proudect',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-for-proudect.component.html',
  styleUrl: './search-for-proudect.component.css',
})


export class SearchForProudectComponent implements OnInit {
  searchQuery!: string;
  searchResults: Iproduct[] = [];
  sortedProducts: Iproduct[] = [];
  sortBy: string = 'featured'; 
  paginatedProducts: Iproduct[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  Above_2500:number = 999999;
  Quant: number = 0;
  constructor(private router: Router,private route: ActivatedRoute,private _productService: ProductServiceService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.searchQuery = paramMap.get('name') ?? '';
      if (this.searchQuery !== '') {
        this._productService.filterdbynameProducts(this.searchQuery).subscribe({
          next: (res: any) => {
            if (res ) {
              this.searchResults = res;
              this.Quant = this.searchResults.length;
              this.sortProducts(this.sortBy);
              console.log(this.searchResults);
            } else {
              console.log('Invalid response format');
            }
          },
          error: (err) => {
            console.log(err);
          }
        });
      }
    });
  }

  sortProducts(sortOption: string): void {
    switch (sortOption) {
      case 'featured':
       
        this.sortedProducts = [...this.searchResults];
        break;
      case 'lowToHigh':
     
        this.sortedProducts = [...this.searchResults].sort((a, b) => a.price - b.price);
        break;
      case 'highToLow':
        
        this.sortedProducts = [...this.searchResults].sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    this.updatePaginatedProducts();
  }
  onSortChange(event: Event): void {
    this.sortBy = (event.target as HTMLSelectElement).value;
    this.sortProducts(this.sortBy);}

    updatePaginatedProducts() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedProducts = this.sortedProducts.slice(startIndex, endIndex);
    }
    
  
    totalPages(): number {
      return Math.ceil(this.searchResults.length / this.itemsPerPage);
    }
  
    changePage(page: number) {
      this.currentPage = page;
      this.updatePaginatedProducts();
    }
    NavigateToDetails(proId: number) {
      this.router.navigateByUrl(`/Details/${proId}`);
    }
 
    filterByPrice(minPrice: number, maxPrice: number): void {
      if (minPrice === 0 && maxPrice === Infinity) {
         //---------No price filter
        this.sortedProducts = [...this.searchResults];
      } else {
          //---------Filter products based on price range
        this.sortedProducts = this.searchResults.filter(product => 
          product.price >= minPrice && product.price <= maxPrice
        );
      }
      this.currentPage = 1;
      this.updatePaginatedProducts();
    }
}