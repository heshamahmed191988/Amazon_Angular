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
  totalProducts: number =100; // Represents the total number of products found
selectedBrand: string = '';
  Above_2500:number = 999999;
  Quant: number = 0;
  lang: string = 'en'; 
  brands: any[] = [];
  filteredResults: Iproduct[] = [];
  public selectedCategoryId: number = 0;
  randomProducts: Iproduct[] = [];
  noResultsMessage: boolean =true;/////////////--new
 
  isExpanded: boolean = false;

toggleExpand(product: Iproduct) {
  product.isExpanded = !product.isExpanded;
}
  //public pageSize = 4; 
  //public pageNumber = 1;

  selectedCategory: string = 'All';
  constructor(private router: Router,private route: ActivatedRoute,private _productService: ProductServiceService
    ,private translate:TranslateService,
    private reviewService:ReviewService,
    private animationService:AnimationService) {}

  ngOnInit(): void {
  

    this.animationService.openspinner();
   this.calculateProductRatings();
   const savedState = localStorage.getItem('searchState');
   if (savedState) {
     const state = JSON.parse(savedState);
     this.pageNumber = state.pageNumber;
     this.searchQuery = state.searchQuery;
     this.sortBy = state.sortBy;
     this.selectedCategoryId = state.selectedCategoryId;
     // Restore any other state variables here
 
     // Since we've restored state, we might need to load products accordingly
     //this.loadProducts();
   }
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
              
              //this.sortProducts(this.sortBy);
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

//   sortProducts(sortOption: string, brand?: string): void {
//     this.sortBy = sortOption;
//   this.selectedBrand!=brand;
//     let sortOrder = 'asc'; // Default sort order
//     if (sortOption === 'highToLow') {
//         sortOrder = 'desc';
//     }
  
//     console.log("Sort Order:", sortOrder); // Log to confirm what's being sent

//     // Pass the brand directly to the filtering method to handle it server-side
//     this._productService.filterProductsByCategoryAndNameAndPrice(
//         this.selectedCategoryId, 
//         sortOrder, 
//         this.pageSize, 
//         this.pageNumber,
//         brand // Now passing the brand to the API
//     ).subscribe({
//         next: (products) => {
//             console.log("Products after sort and brand filter:", products);
    
//             this.searchResults = products;
//             this.sortedProducts = [...this.searchResults];
//             this.calculateProductRatings();
//             this.updatePaginatedProducts();
//            // this.Quant = this.searchResults.length;
//         },
//         error: (error) => {
//             console.error('Failed to fetch products:', error);
//         }
//     });
// }
 

sortProducts(sortOption: string, brand?: string): void {
  this.sortBy = sortOption;
this.selectedBrand!=brand;
  let sortOrder = 'asc'; // Default sort order
  if (sortOption === 'highToLow') {
      sortOrder = 'desc';
  }

  console.log("Sort Order:", sortOrder); // Log to confirm what's being sent

  // Pass the brand directly to the filtering method to handle it server-side
  this._productService.filterProductsByCategoryAndNameAndPrice(
      this.selectedCategoryId, 
      sortOrder, 
      this.pageSize, 
      this.pageNumber,
      brand // Now passing the brand to the API
  ).subscribe({
      next: (products) => {
          console.log("Products after sort and brand filter:", products);
  
          this.searchResults = products;
          this.sortedProducts = [...this.searchResults];
          this.calculateProductRatings();
          this.updatePaginatedProducts();
         // this.Quant = this.searchResults.length;
      },
      error: (error) => {
          console.error('Failed to fetch products:', error);
      }
  });
}



  onSortChange(event: Event): void {
    console.log("onSortChange triggered", event);

    this.sortBy = (event.target as HTMLSelectElement).value;
    console.log("Sorting by:", this.sortBy);

    // Pass the currently selected brand along with sort options
    this.sortProducts(this.sortBy, this.selectedBrand);
}

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
      const state = {
        pageNumber: this.pageNumber,
        searchQuery: this.searchQuery,
        sortBy: this.sortBy,
        selectedCategoryId: this.selectedCategoryId,
        // Add any other state variables you need to persist
      };
    
      localStorage.setItem('searchState', JSON.stringify(state));
      this.router.navigateByUrl(`/Details/${proId}/${this.selectedCategoryId}`);
    }
 
  // filterByPrice(minPrice: number, maxPrice: number, brand?: string): void {
  // // Validation for user input
  // minPrice = isNaN(minPrice) ? 0 : minPrice; // Default to 0 if input is NaN
  // maxPrice = isNaN(maxPrice) ? Infinity : maxPrice; // Default to Infinity if input is NaN

  // // Ensure logical min/max values
  // if (minPrice > maxPrice) {
  //   console.warn('Minimum price cannot be greater than maximum price. Reverting to default.');
  //   minPrice = 0;
  //   maxPrice = Infinity;
  // }

  // // Clear any previous brand filter if none is provided now
  // if (!brand) {
  //   this.selectedBrand = ''; // Ensure no brand is selected if none provided
  // } else {
  //   this.selectedBrand = brand; // Update the current brand
  // }

  // this._productService.filterProductsByCategoryAndPriceRange(this.selectedCategoryId, minPrice, maxPrice, this.pageSize, this.pageNumber)
    
  // .subscribe({
  //   next: (products) => {
  //     // const filteredByBrand = (this.selectedBrand && this.selectedBrand !== '') ?
  //     //   products.filter(product => product.brandNameEn.toLowerCase() === this.selectedBrand.toLowerCase()) :
  //     //   products;
      
  //     const filteredByBrand = (this.selectedBrand && this.selectedBrand.trim() !== '') ?
  //     products.filter(product => product.brandNameEn.toLowerCase().trim() === this.selectedBrand.toLowerCase().trim()) :
  //     products;
  //     this.searchResults = filteredByBrand;
  //     console.log( "bbbb",this.searchResults)
  //     this.sortedProducts = [...this.searchResults];
  //     this.updatePaginatedProducts();
  //     this.pageNumber = 1; // Reset to first page with new filter
  //     this.Quant = filteredByBrand.length;

  //     this.calculateProductRatings();

  //     console.log(`Filtered by price: ${minPrice} to ${maxPrice}${this.selectedBrand ? ' and brand: ' + this.selectedBrand : ''}. Products found: ${this.sortedProducts.length}`);
  //   },
  //   error: (error) => console.error('Error fetching filtered products:', error)
  // });
  
//}
filterByPrice(minPrice: number, maxPrice: number, brand?: string): void {
  // Validation for user input
  minPrice = isNaN(minPrice) ? 0 : minPrice; // Default to 0 if input is NaN
  maxPrice = isNaN(maxPrice) ? Infinity : maxPrice; // Default to Infinity if input is NaN

  // Ensure logical min/max values
  if (minPrice > maxPrice) {
    console.warn('Minimum price cannot be greater than maximum price. Reverting to default.');
    minPrice = 0;
    maxPrice = Infinity;
  }

  // Clear any previous brand filter if none is provided now
  if (!brand) {
    this.selectedBrand = ''; // Ensure no brand is selected if none provided
  } else {
    this.selectedBrand = brand; // Update the current brand
  }

  // Filter products by category, price range, and optionally by brand
  if (this.selectedCategoryId === 0) {
    // Filter all products regardless of category
    this._productService.filterProductsByPriceRange(minPrice, maxPrice)
      .subscribe({
        next: (products) => {
          // Apply brand filtering if a brand is selected
          const filteredByBrand = (this.selectedBrand && this.selectedBrand.trim() !== '') ?
            products.filter(product => product.brandNameEn.toLowerCase().trim() === this.selectedBrand.toLowerCase().trim()) :
            products;
          
          // Update search results with filtered products
          this.searchResults = filteredByBrand;
          this.sortedProducts = [...this.searchResults];
          
          // Update pagination and quantity
          this.updatePaginatedProducts();
          this.pageNumber = 1; // Reset to first page with new filter
          this.Quant = filteredByBrand.length;

          // Calculate product ratings
          this.calculateProductRatings();

          // Log filtered products information
          console.log(`Filtered by price: ${minPrice} to ${maxPrice}${this.selectedBrand ? ' and brand: ' + this.selectedBrand : ''}. Products found: ${this.sortedProducts.length}`);
        },
        error: (error) => console.error('Error fetching filtered products:', error)
      });
  } else {
    // Filter products by category and price range
    this._productService.filterProductsByCategoryAndPriceRange(
      this.selectedCategoryId, minPrice, maxPrice, this.pageSize, this.pageNumber
    ).subscribe({
      next: (products) => {
        // Apply brand filtering if a brand is selected
        const filteredByBrand = (this.selectedBrand && this.selectedBrand.trim() !== '') ?
          products.filter(product => product.brandNameEn.toLowerCase().trim() === this.selectedBrand.toLowerCase().trim()) :
          products;
        
        // Update search results with filtered products
        this.searchResults = filteredByBrand;
        this.sortedProducts = [...this.searchResults];
        
        // Update pagination and quantity
        this.updatePaginatedProducts();
        this.pageNumber = 1; // Reset to first page with new filter
        this.Quant = filteredByBrand.length;

        // Calculate product ratings
        this.calculateProductRatings();

        // Log filtered products information
        console.log(`Filtered by price: ${minPrice} to ${maxPrice}${this.selectedBrand ? ' and brand: ' + this.selectedBrand : ''}. Products found: ${this.sortedProducts.length}`);
      },
      error: (error) => console.error('Error fetching filtered products:', error)
    });
  }
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
    
      this.selectedBrand = brand;
      if (this.selectedCategoryId === 0) {
       
      this._productService.filterdaLLbrand(brand, this.pageSize, this.pageNumber).subscribe({
        next: (res: Iproduct[]) => {
          if (Array.isArray(res)) {
            this.searchResults = res; 
            this.sortedProducts = [...this.searchResults]; 
            this.Quant = this.searchResults.length;
            this.calculateProductRatings();
            
          } else {
            console.log('Invalid response format');
            this.searchResults = [];
            this.sortedProducts = []; // Keep both arrays in sync
          }
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
           // Ensure spinner is closed when operation completes
          this.updatePaginatedProducts(); // Update the UI with the latest state
        }
      });
      }
        else{
      this.selectedBrand = brand;
      this._productService.filterdbybrandname(brand, this.selectedCategoryId,this.pageSize, this.pageNumber).subscribe({
        next: (res: Iproduct[]) => {
          if (Array.isArray(res)) {
            this.searchResults = res; // Update the primary data source
            this.sortedProducts = [...this.searchResults]; // Ensure display array is synchronized
            this.Quant = this.searchResults.length;
            // Consider conditionally calling sortProducts only if sortOrder indicates a change
            this.calculateProductRatings();
          } else {
            console.log('Invalid response format');
            this.searchResults = [];
            this.sortedProducts = []; // Keep both arrays in sync
          }
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
           // Ensure spinner is closed when operation completes
          this.updatePaginatedProducts(); // Update the UI with the latest state
        }
      });
    }
    }

    clearBrandFilter(): void {
      this.selectedBrand = '';
      this.loadProducts(); // Method to fetch all products or restore original state
    }
    processProductResponse(res: Iproduct[]): void {
      if (Array.isArray(res)) {
        this.searchResults = res;
        this.sortedProducts = [...this.searchResults];
        this.Quant = this.searchResults.length;
        this.calculateProductRatings();
      } else {
        console.log('Invalid response format');
        this.searchResults = [];
        this.sortedProducts = [];
      }
    }
    calculateProductRatings(): void {
      // Create an array to store all promises
      const ratingPromises: Promise<void>[] = [];
    
      // Iterate through each product
      for (let product of this.searchResults) {
        // Create a promise for each product's rating calculation
        const ratingPromise = new Promise<void>((resolve, reject) => {
          // Fetch reviews for the product
          this.reviewService.getReviewsByProductId(product.id!).subscribe({
            next: (reviews) => {
              if (reviews && reviews.length > 0) {
                let totalRating = 0;
                for (let review of reviews) {
                  totalRating += review.rating || 0;
                }
                product.rating = totalRating / reviews.length;
              } else {
                product.rating = 0;
              }
              resolve(); // Resolve the promise once the rating calculation is done
            },
            error: (err) => {
              console.error('Error fetching reviews:', err);
              reject(err); // Reject the promise if there's an error
            }
          });
        });
        
        ratingPromises.push(ratingPromise); // Add the promise to the array
      }
    
      // Wait for all promises to resolve
      Promise.all(ratingPromises)
        .then(() => {
          // All promises have resolved, ratings are calculated
          console.log('Product ratings calculated successfully.');
        })
        .catch((error) => {
          console.error('Error calculating product ratings:', error);
        });
    }
    
    loadFilteredProducts(): void {
      if (this.selectedBrand) {
        this.filterByBrand(this.selectedBrand);
      } else if (this.selectedCategoryId !== 0) {
        this.filterProductsByCategory();
      } else if (this.searchQuery !== '') {
        this.loadProducts();  // Your existing method that handles search queries
      } else {
        this.loadProducts();  // Method to load all products without any filters
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
            this.displayNoResultsMessage();//////////-------new
            //this.sortProducts(this.sortBy);
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
           // this.sortedProducts = [...res]; // Update sortedProducts with the filtered results

            //this.sortedProducts=res;
            console.log( "llok" ,this.searchResults );
            this.Quant = this.searchResults.length;
            this.updatePaginatedProducts();
            this.calculateProductRatings();
            this.displayNoResultsMessage();/////////////////////---new

           
            //this.sortProducts(this.sortBy);
         
            
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
            this.displayNoResultsMessage();
            //this.sortProducts(this.sortBy);
            this.calculateProductRatings();
          } else {
            console.log('Invalid response format');
          }
          if (this.searchResults.length === 0) {
            console.log('No results for your search.');
            this.displayNoResultsMessage();
           // this.noResultsMessage = 'No results for your search.';
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
displayNoResultsMessage(): void {
  this.noResultsMessage = this.searchResults.length === 0;
  console.log("kkkkkkkkkkkk");
}

    filterProductsByCategory(): void {
      if (this.selectedCategoryId !== 0) {
          this._productService.getproudectsbycatogry(this.selectedCategoryId,this.pageSize,this.pageNumber).subscribe({
              next: (res) => {
                  this.searchResults = res;
                  this.Quant = this.searchResults.length;
                  this.updatePaginatedProducts();
                  this.displayNoResultsMessage();
                  //this.sortProducts(this.sortBy);
                  this.calculateProductRatings();

              },
              error: (error) => {
                  console.error('Error fetching products by category:', error);
              }
          });
      }
      else {
        this._productService.getAllProducts(this.pageSize,this.pageNumber).subscribe({
            next: (res) => {
                this.searchResults = res;
                this.Quant = this.searchResults.length;
                this.updatePaginatedProducts();
                this.displayNoResultsMessage();
                //this.sortProducts(this.sortBy);
                this.calculateProductRatings();
                //this.filterByBrand(this.selectedBrand);

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
  this.loadFilteredProducts();
  
  window.scrollTo(0, 0);
}
goToNextPage() {
  if (this.pageNumber < this.totalPages()) {
    this.changePage(this.pageNumber + 1);
this.loadFilteredProducts();
window.scrollTo(0, 0);
  }
}

goToPreviousPage() {
  if (this.pageNumber > 1) {
    this.changePage(this.pageNumber - 1);
    this.loadFilteredProducts();
    window.scrollTo(0, 0);

  }
}
get visiblePageNumbers(): number[] {
  let startPage: number, endPage: number;
  const visiblePages = 2; // Change visiblePages to 2 initially
  const totalPages = this.totalPages();

  if (totalPages <= visiblePages) {
    // Less than `visiblePages` total pages so show all
    startPage = 1;
    endPage = totalPages;
  } else {
    // More than `visiblePages` total pages so calculate start and end pages
    if (this.pageNumber <= 1) { // Adjust condition for initial case
      startPage = 1;
      endPage = visiblePages;
    } else if (this.pageNumber >= totalPages) {
      startPage = totalPages - 1;
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