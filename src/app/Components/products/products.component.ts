import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductServiceService } from '../../services/product-service.service';
import { Iproduct } from '../../models/iproduct';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, TranslateModule,NgxPaginationModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Iproduct[] = [];
  paginatedProducts: Iproduct[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10; // Adjust based on your preference
  lang: string = 'en'; // Default language
  total:number=1

  constructor(
    private router: Router,
    private productService: ProductServiceService,
    private translate: TranslateService // Inject TranslateService
  ) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'en'; // Initialize language from localStorage
    this.translate.use(this.lang); // Use the language with TranslateService

    // Subscribe to language changes
    this.translate.onLangChange.subscribe(langChangeEvent => {
      this.lang = langChangeEvent.lang;
      // Optionally, refresh data that depends on the current language here
    });

    // this.productService.getAllProducts().subscribe(products => {
    //   this.products = products;
    //   this.updatePaginatedProducts();
    // });
    this.getproducts();
  }
  getproducts()
{
      this.productService.getAllProducts(this.currentPage,this.itemsPerPage).subscribe(Allproducts => {
      this.total=Allproducts.count;
      this.paginatedProducts= Allproducts.entities
      console.log(Allproducts)
    });
}

  // updatePaginatedProducts() {
  //   const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  //   const endIndex = startIndex + this.itemsPerPage;
  //   this.paginatedProducts = this.products.slice(startIndex, endIndex);
  // }

  // totalPages(): number {
  //   return Math.ceil(this.products.length / this.itemsPerPage);
  // }

  // changePage(page: number) {
  //   this.currentPage = page;
  //   this.updatePaginatedProducts();
  // }

  NavigateToDetails(proId:number) {
    this.router.navigateByUrl(`/Details/${proId}`);
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
  changePage1(pagenumber:number){
    this.currentPage= pagenumber;
    this.getproducts();
  }
}
