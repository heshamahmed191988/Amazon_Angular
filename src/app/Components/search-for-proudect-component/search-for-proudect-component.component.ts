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
  public pageNumber: number = 1;
  public pageSize: number =12;
  totalProducts: number =50; // Represents the total number of products found

  Above_2500:number = 999999;
  Quant: number = 0;
  lang: string = 'en'; 
  brands: any[] = [];
  filteredResults: Iproduct[] = [];
  selectedCategoryId: number = 0;
  randomProducts: Iproduct[] = [];
  //public pageSize = 4; 
  //public pageNumber = 1;

  selectedCategory: string = 'All';
  constructor(private router: Router,private route: ActivatedRoute,private _productService: ProductServiceService
    ,private translate:TranslateService,
    private reviewService:ReviewService,
    private animationService:AnimationService) {}

  ngOnInit(): void {
    this.animationService.openspinner();
    //this.searchResults = [];
    this.route.paramMap.subscribe(paramMap => {
      this.searchQuery = paramMap.get('name') ?? '';
      this.selectedCategoryId = Number(paramMap.get('categoryId')) || 0;
      this.loadProducts();
     
       console.log( this.selectedCategoryId);
      if (this.searchQuery !== '' && this.selectedCategoryId==0) { 
        this._productService.filterdbynameProducts(this.searchQuery,this.pageSize,this.pageNumber).subscribe({
          next: (res: any) => {
            if (Array.isArray(res) ) {
              this.searchResults = res;
              
              this.sortProducts(this.sortBy);
              this.calculateProductRatings();
              this.Quant = this.searchResults.length;
            } else {
              console.log('Invalid response format');
              this.searchResults = [];
            }
          },
          error: (err) => {
            console.log(err);
          }
        });
      }
    });
    // this.route.paramMap.subscribe(paramMap => {
    //   this.searchQuery = paramMap.get('nameEn') ?? '';
    //   this.selectedCategoryId = Number(paramMap.get('categoryId')) || 0;

    //   this.loadProducts();
    //   if (this.searchQuery !== '') {
    //     this._productService.filterdbynameProducts(this.searchQuery).subscribe({
    //       next: (res: any) => {
    //         if (res ) {
    //           this.searchResults = res;
    //           this.Quant = this.searchResults.length;
    //           this.sortProducts(this.sortBy);
    //           this.calculateProductRatings();
    //           //console.log(this.searchResults);
    //         } else {
    //           console.log('Invalid response format');
    //         }
    //       },
    //       error: (err) => {
    //         console.log(err);
    //       }
    //     });
    //   }
    // });

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
    this.sortBy = sortOption; // Update current sort preference

    let sortOrder = 'asc'; // Default sort order
    switch (sortOption) {
        case 'featured':
            // Implement your logic for 'featured' if it involves a specific sort or is a default view
            break;
        case 'lowToHigh':
            this.searchResults.sort((a, b) => a.price - b.price);
            break;
        case 'highToLow':
            this.searchResults.sort((a, b) => b.price - a.price);
            break;
        default:
            // Handle other sorting criteria
            break;
    }

    // After sorting searchResults, you may want to update the sortedProducts as well
    // if you plan to use it for other purposes. If not, this line can be omitted.
    this.sortedProducts = [...this.searchResults];

    // Now, update the paginated view to reflect the new order
    this.updatePaginatedProducts();
    // No need to reset pageNumber here unless you specifically want to start from page 1 after sorting
}

  onSortChange(event: Event): void {
    console.log("onSortChange triggered", event);

    this.sortBy = (event.target as HTMLSelectElement).value;
    console.log("Sorting by:", this.sortBy);

    this.sortProducts(this.sortBy);}

    updatePaginatedProducts(): void {
      const startIndex = (this.pageNumber - 1) * this.pageSize;
      this.paginatedProducts = this.sortedProducts.slice(startIndex, startIndex + this.pageSize);
      this.paginatedProducts = [...this.searchResults];
    }
    updatePaginatedProducts2(): void {
      const startIndex = (this.pageNumber - 1) * this.pageSize;
      this.paginatedProducts = this.sortedProducts.slice(startIndex, startIndex + this.pageSize);
    }
  
    totalPages(): number {
      return Math.ceil(this.totalProducts / this.pageSize);
    }
  
    // changePage(page: number) {
    //   this.currentPage = page;
    //   this.updatePaginatedProducts();
    // }
    NavigateToDetails(proId: number) {
      this.router.navigateByUrl(`/Details/${proId}`);
    }
 
    filterByPrice(minPrice: number, maxPrice: number): void {
      // Validation for user input
      minPrice = isNaN(minPrice) ? 0 : minPrice; // Default to 0 if input is NaN
      maxPrice = isNaN(maxPrice) ? Infinity : maxPrice; // Default to Infinity if input is NaN
  
      // Ensure logical min/max values
      if (minPrice > maxPrice) {
          console.warn('Minimum price cannot be greater than maximum price. Reverting to default.');
          minPrice = 0;
          maxPrice = Infinity;
      }
  
      // Filter operation
      if (minPrice === 0 && maxPrice === Infinity) {
          // No specific price filter applied, revert to all search results
          this.sortedProducts = [...this.searchResults];
      } else {
          // Filter searchResults based on price range
          this.sortedProducts = this.searchResults.filter(product =>
              product.price >= minPrice && product.price <= maxPrice
          );
      }
  
      // Reset to the first page
      this.pageNumber = 1;
  
      // Update the paginated products to reflect the newly filtered set
      this.updatePaginatedProducts2(); // Assuming you have corrected the method name as per your code
  
      // Recalculate product ratings, if applicable
      this.calculateProductRatings();
  
      // Log the action for debugging
      console.log(`Filtered by price: ${minPrice} to ${maxPrice}. Products found: ${this.sortedProducts.length}`);
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
      this._productService.filterdbybrandname(brand,this.pageSize,this.pageNumber).subscribe({
        next: (res: any) => {
          if (Array.isArray(res)) {
            this.animationService.openspinner();
            // console.log( this.filteredResults);
            this.searchResults = res;
            console.log(this.searchResults)
            this.Quant = this.searchResults.length;
            this.sortProducts(this.sortBy);
            this.calculateProductRatings();

          } else {
            console.log('Invalid response format');
            this.searchResults = [];
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
      this._productService.filterdbynameProducts(this.searchQuery,this.pageSize,this.pageNumber).subscribe({
        next: (res: Iproduct[]) => {
          if (Array.isArray(res)) {
            this.searchResults = res;
            
            //this.sortedProducts=res;
            this.Quant = this.searchResults.length;
            this.updatePaginatedProducts();
            this.sortProducts(this.sortBy);
            this.calculateProductRatings();
          } else {
            console.log('Invalid response format');
            this.searchResults = [];
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      this._productService.filterProductsByCategoryAndName(this.selectedCategoryId, this.searchQuery,this.pageSize,this.pageNumber).subscribe({
        next: (res: Iproduct[]) => {
          if (Array.isArray(res)) {
            this.searchResults = res;
            this.sortedProducts=res;
            console.log( "llok" ,this.searchResults );
            this.Quant = this.searchResults.length;
          
            this.sortProducts(this.sortBy);
            this.calculateProductRatings();
            
          } else {
            console.log('Invalid response format');
            this.searchResults = [];
          }
         
        },
        error: (err) => {
          console.log(err);
        }
      });
      
    }
   // this.RandomProducts();
  } 
  else 
  {
    if(this.selectedCategoryId === 0) {
     
      this._productService.getAllProducts(this.pageSize,this.pageNumber).subscribe({
        next: (res: any) => {
          if (res) {
            this.searchResults = res;
            console.log( this.searchResults ,"yees");
            this.Quant = this.searchResults.length;
            this.updatePaginatedProducts();

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
          this._productService.getproudectsbycatogry(this.selectedCategoryId,this.pageSize,this.pageNumber).subscribe({
              next: (res) => {
                  this.searchResults = res;
                  this.Quant = this.searchResults.length;
                  this.updatePaginatedProducts();

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
    this._productService.getAllProducts(this.pageSize, this.pageNumber).subscribe({
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

changePage(page: number): void {
  this.pageNumber = page;
  this.updatePaginatedProducts();
  this.loadProducts();
}
goToNextPage() {
  if (this.pageNumber < this.totalPages()) {
    this.changePage(this.pageNumber + 1);
this.loadProducts();
  }
}

goToPreviousPage() {
  if (this.pageNumber > 1) {
    this.changePage(this.pageNumber - 1);
    this.loadProducts();

  }
}
get visiblePageNumbers(): number[] {
  let startPage: number, endPage: number;
  const visiblePages = 3;
  const totalPages = this.totalPages();

  if (totalPages <= visiblePages) {
    // Less than `visiblePages` total pages so show all
    startPage = 1;
    endPage = totalPages;
  } else {
    // More than `visiblePages` total pages so calculate start and end pages
    if (this.pageNumber <= 2) {
      startPage = 1;
      endPage = visiblePages;
    } else if (this.pageNumber + 1 >= totalPages) {
      startPage = totalPages - 2;
      endPage = totalPages;
    } else {
      startPage = this.pageNumber - 1;
      endPage = this.pageNumber + 1;
    }
  }

  // create an array of pages to ng-repeat in the pager control
  let pages: number[] = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

  return pages;
}

}