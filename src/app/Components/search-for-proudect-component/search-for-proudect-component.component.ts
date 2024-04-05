import { Component, OnInit } from '@angular/core';
import { Iproduct } from '../../models/iproduct';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductServiceService } from '../../services/product-service.service';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReviewService } from '../../services/review.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AnimationService } from '../../services/animation.service';

@Component({
  selector: 'app-search-for-proudect-component',
  standalone: true,
  imports: [CommonModule,TranslateModule,NgxSpinnerModule],
  templateUrl: './search-for-proudect-component.component.html',
  styleUrl: './search-for-proudect-component.component.css'
})
export class SearchForProudectComponentComponent implements OnInit {
  searchQuery!: string;
  searchResults: Iproduct[] = [];
  sortedProducts: Iproduct[] = [];
  sortBy: string = 'featured'; 
  paginatedProducts: Iproduct[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  Above_2500:number = 999999;
  Quant: number = 0;
  lang: string = 'en'; 
  brands: any[] = [];
  filteredResults: Iproduct[] = [];
  selectedCategoryId: number = 0;
  randomProducts: Iproduct[] = [];

  selectedCategory: string = 'All';
  constructor(private router: Router,private route: ActivatedRoute,private _productService: ProductServiceService
    ,private translate:TranslateService,
    private reviewService:ReviewService,
    private animationService:AnimationService) {}

  ngOnInit(): void {
    this.animationService.openspinner();
    this.route.paramMap.subscribe(paramMap => {
      this.searchQuery = paramMap.get('nameEn') ?? '';
      this.selectedCategoryId = Number(paramMap.get('categoryId')) || 0;
      this.loadProducts();
       console.log( this.selectedCategoryId);
      if (this.searchQuery !== '' && this.selectedCategoryId==0) { 
        this._productService.filterdbynameProducts(this.searchQuery).subscribe({
          next: (res: any) => {
            if (res ) {
              this.searchResults = res;
              this.sortProducts(this.sortBy);
              this.calculateProductRatings();
              this.Quant = this.searchResults.length;
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
    this.route.paramMap.subscribe(paramMap => {
      this.searchQuery = paramMap.get('nameEn') ?? '';
      this.selectedCategoryId = Number(paramMap.get('categoryId')) || 0;

      this.loadProducts();
      if (this.searchQuery !== '') {
        this._productService.filterdbynameProducts(this.searchQuery).subscribe({
          next: (res: any) => {
            if (res ) {
              this.searchResults = res;
              this.Quant = this.searchResults.length;
              this.sortProducts(this.sortBy);
              this.calculateProductRatings();
              //console.log(this.searchResults);
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

    this._productService.getbrandsname().subscribe({
      next: (res) => {
        this.brands = res;
        console.log(this.brands )
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
    this.lang = localStorage.getItem('lang') || 'en'; // Initialize language from localStorage
    this.translate.use(this.lang); // Use the language with TranslateService

    // Subscribe to language changes
    this.translate.onLangChange.subscribe(langChangeEvent => {
      this.lang = langChangeEvent.lang;
      // Optionally, refresh data that depends on the current language here
    });
    this.RandomProducts();
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
    getProductName(product: Iproduct): string {
      return this.lang === 'en' ? product.nameEn : product.nameAr;
    }
  
    getProductDescription(product: Iproduct): string {
      return this.lang === 'en' ? product.descriptionEn : product.descriptionAr;
    }
  
    getBrandName(product: Iproduct): string {
      return this.lang === 'en' ? product.brandNameEn : product.brandNameAr;
    }

    filterByBrand(brand: string): void {
      this._productService.filterdbybrandname(brand).subscribe({
        next: (res: any) => {
          if (res) {
            // this.filteredResults=this.searchResults.filter(product => product.BrandName ===brand);
            // console.log( this.filteredResults);
            this.searchResults = res;
            console.log(this.searchResults)
            this.Quant = this.searchResults.length;
            this.sortProducts(this.sortBy);
            this.calculateProductRatings();

          } else {
            console.log('Invalid response format');
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
    
    calculateProductRatings(): void {
      //---------Calculate ratings for each product 
for (let product of this.searchResults) {
this.reviewService.getReviewsByProductId(product.id!).subscribe({
  next: (reviews) => {
    if (reviews && reviews.length > 0)
     {         
        let totalRating = 0
        for (let review of reviews) 
        {
          totalRating += review.rating || 0;
        }
        product.rating = totalRating / reviews.length;
    }
     else
    {
         product.rating = 0;
    }
  },
  error: (err) => {
    console.error('Error fetching reviews:', err);
  }
});
}
}
    
filterByRating(minRating: number): void {
  this.paginatedProducts = this.sortedProducts.filter(product => product.rating !== undefined && product.rating >= minRating);
}

loadProducts(): void {
  if (this.searchQuery !== '') {
    if (this.selectedCategoryId === 0) {
      this._productService.filterdbynameProducts(this.searchQuery).subscribe({
        next: (res: any) => {
          if (res) {
            this.searchResults = res;
            this.Quant = this.searchResults.length;
            this.sortProducts(this.sortBy);
            this.calculateProductRatings();
          } else {
            console.log('Invalid response format');
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      this._productService.filterProductsByCategoryAndName(this.selectedCategoryId, this.searchQuery).subscribe({
        next: (res: Iproduct[]) => {
          if (res) {
            this.searchResults = res;
            this.sortedProducts=res;
            console.log( "llok" ,this.searchResults );
            this.Quant = this.searchResults.length;
          
            this.sortProducts(this.sortBy);
            this.calculateProductRatings();
          } else {
            console.log('Invalid response format');
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
      
    }
    this.RandomProducts();
  } 
  else 
  {
    if(this.selectedCategoryId === 0) {
     
      this._productService.getAllProducts().subscribe({
        next: (res: any) => {
          if (res) {
            this.searchResults = res;
            console.log( this.searchResults ,"yees");
            this.Quant = this.searchResults.length;
            this.sortProducts(this.sortBy);
            this.calculateProductRatings();
          } else {
            console.log('Invalid response format');
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      
      this.filterProductsByCategory();
    }
  }
}

    filterProductsByCategory(): void {
      if (this.selectedCategoryId !== 0) {
          this._productService.getproudectsbycatogry(this.selectedCategoryId).subscribe({
              next: (res) => {
                  this.searchResults = res;
                  this.Quant = this.searchResults.length;
                  this.sortProducts(this.sortBy);
                  this.calculateProductRatings();

              },
              error: (error) => {
                  console.error('Error fetching products by category:', error);
              }
          });
      }
    }    

    ///select according to category
// RandomProducts(): void {
//   if (this.selectedCategoryId === 0) {
//     this._productService.getAllProducts().subscribe({
//       next: (res: Iproduct[]) => {
//         this.randomProducts = this.getRandomProducts(res);
//       },
//       error: (err) => {
//         console.error('Error fetching random products:', err);
//       }
//     });
//   } else {
//     this._productService.getproudectsbycatogry(this.selectedCategoryId).subscribe({
//       next: (res: Iproduct[]) => {
//         this.searchResults = res; 
//         this.randomProducts = this.getRandomProducts(this.searchResults);
//       },
//       error: (err) => {
//         console.error('Error fetching random products:', err);
//       }
//     });
//   }
// }

/////////-------------------------------new----random

//select from all proudect 
RandomProducts(): void {
  if (this.selectedCategoryId === 0 ||this.selectedCategoryId != 0 ) {
    this._productService.getAllProducts().subscribe({
      next: (res: Iproduct[]) => {
        this.searchResults = res; 
        this.randomProducts = this.getRandomProducts(this.searchResults);
      },
      error: (err) => {
        console.error('Error fetching random products:', err);
      }
    });
  }
}



getRandomProducts(products: Iproduct[]): Iproduct[] {
  let randomProducts: Iproduct[] = [];
  let maxIndex = Math.min(6, products.length);
  let randomIndices: number[] = [];
  while (randomIndices.length < maxIndex) {
    let randomIndex = Math.floor(Math.random() * products.length);
    if (!randomIndices.includes(randomIndex)) {
      randomIndices.push(randomIndex);
      randomProducts.push(products[randomIndex]);
    }
  }
  return randomProducts;
}
}