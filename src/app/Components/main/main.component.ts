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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SlickCarouselComponent, SlickCarouselModule } from 'ngx-slick-carousel';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule,RouterLink,SearchForProudectComponentComponent,RouterLink,NgxSpinnerModule,TranslateModule,SlickCarouselModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  @ViewChild('carousel', { static: true }) carousel!: ElementRef;
  @ViewChild('slickModal3', { static: false }) slickModal3!: SlickCarouselComponent;
  @ViewChild('carousel2', { static: true }) carousel2!: ElementRef;
  startSlider: number = 0;
  startSlider1: number = 0;
  imgItem: any;
  endSlider: number = 0;
  endSlider1: number = 0;
  deals: deal[] = [];
  CatId:number=0
  public pageNumber: number = 1;
  public pageSize: number =20;
  lang!: string; 
  isFirstSection: boolean = true;
  searchResults: Iproduct[] = [];
  randomProducts: Iproduct[] = [];
   selectedCategoryId = Math.floor(Math.random() * 10) + 1;
  categories:Icategory[] = [];
  randomProducts2:Iproduct[] = [];
  randomProducts3:Iproduct[]=[];
  constructor(private _deal:DealService , 
    private prd:ProductServiceService,
    private router:Router,
    private categoryService:CategoryServiceService,
    private animationService:AnimationService,
  private translate:TranslateService)
  {

  }
  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'en';
    this.animationService.openspinner();
    this._deal.getDeals().subscribe(deals => {
      this.deals = deals;
      this.endSlider = (this.deals.length - 1) * 100;
      this.endSlider1 = (this.deals.length - 1) * 100;
      
    });
    this.lang = localStorage.getItem('lang') || 'en'; // Initialize language from localStorage
    this.translate.use(this.lang); // Use the language with TranslateService

    // Subscribe to language changes
    this.translate.onLangChange.subscribe(langChangeEvent => {
      this.lang = langChangeEvent.lang;
      // Optionally, refresh data that depends on the current language here
    });
    this.loadCategories();
    this.RandomProducts();
  }

  handleLeftBtn(): void {
    if (this.startSlider < 0) {
      this.startSlider = this.startSlider + 100;
    }
    this.translateSlider();
  }
  getcategorytName(product: Icategory): string {
    return this.lang === 'en' ? product.nameEn : product.nameAr;
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
    this.prd.getproudectsbycatogry(categoryId,this.pageSize,this.pageNumber).subscribe(
      (prd) => {
        this.categories = prd;
      },
      (error) => {
        console.error('Error fetching products by category:', error);
      }
    );
  }
//   navigateToSearch(name: string, Id: number): void {
//     this.router.navigate(['/SearchForProudectComponent'], { queryParams: { name: name, categoryId:Id}});
// }

navigateToSearch(name: string, Id: number): void {
  // Construct the route path with matrix parameters manually
  const path = `/SearchForProudectComponent;name=;categoryId=${Id}`;
  // Use the router to navigate
  this.router.navigateByUrl(path);
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
  
 


 
  moveCarousel(direction: number): void {
    const carouselBox = this.carousel.nativeElement as HTMLElement;
    const carouselWidth = carouselBox.clientWidth;
    const scrollAmount = direction * carouselWidth;

    carouselBox.scrollLeft += scrollAmount;
  }

  slides = [
    { img: 'https://m.media-amazon.com/images/I/61VzpOi-geL._AC_SY200_.jpg' },
    { img: 'https://m.media-amazon.com/images/I/41+SjYNfmQL._SY500__AC_SY200_.jpg' },
    { img: 'https://m.media-amazon.com/images/I/81+TH8IIf+L._AC_SY200_.jpg' },
    { img: 'https://m.media-amazon.com/images/I/41+SjYNfmQL._SY500__AC_SY200_.jpg' },
    { img: 'https://m.media-amazon.com/images/I/61VzpOi-geL._AC_SY200_.jpg' },
  ];

  slideConfig = {
    slidesToShow: 4,
    slidesToScroll: 4,
    prevArrow: false, // Hide the previous arrow
    nextArrow: false, // Hide the next arrow
  };
  slideConfig2 = {
    slidesToShow: 4,
    slidesToScroll: 4,
    prevArrow: false, // Hide the previous arrow
    nextArrow: false, // Hide the next arrow
  };


   

  
  // Method to go to the previous slide
 
  slickInit(e: any) {
    console.log('slick initialized');
  }

  breakpoint(e: any) {
    console.log('breakpoint');
  }

  afterChange(e: any) {
    console.log('afterChange');
  }

  beforeChange(e: any) {
    console.log('beforeChange');
  }

  // 2

  slickInit2(e: any) {
    console.log('slick initialized');
  }

  breakpoint2(e: any) {
    console.log('breakpoint');
  }

  afterChange2(e: any) {
    console.log('afterChange');
  }

  beforeChange2(e: any) {
    console.log('beforeChange');
  }


  additionalSlides = [
    { img: 'https://m.media-amazon.com/images/I/81NiP8MImEL._AC_SY200_.jpg' },
    { img: 'https://m.media-amazon.com/images/I/41Ai-GLQzQL._AC_SY200_.jpg' },
    { img: 'https://m.media-amazon.com/images/I/51C2DONw-TL._AC_SY200_.jpg' },
    { img: 'https://m.media-amazon.com/images/I/61bsxa5RnJL._AC_SY200_.jpg' } ,
    { img: 'https://m.media-amazon.com/images/I/41jK19A68DL._SY500__AC_SY200_.jpg' } ,
    { img: 'https://m.media-amazon.com/images/I/41HLsvJ3+HL._SY500__AC_SY200_.jpg' } ,

  ];

  slideConfig3 = {
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay:false,
    autoplaySpeed: 2000,// Hide the previous arrow
    nextArrow: false,
    prevArrow:false
  };
  // Method to go to the previous slide
  previousSlide3(): void {
    if (this.slickModal3 && this.slickModal3.slickPrev) {
      this.slickModal3.slickPrev();
    }
  }

  // Method to go to the next slide
  nextSlide3(): void {
    if (this.slickModal3 && this.slickModal3.slickNext) {
      this.slickModal3.slickNext();
    }
  }

  categoryImages = [
    'https://m.media-amazon.com/images/I/81Y26toqdTL.AC_SY200.jpg', // Sports
    'https://m.media-amazon.com/images/I/615WsJuy5jL.AC_UL480_QL65.jpg', // Clothing & Accessories
    'https://m.media-amazon.com/images/I/818BRJgKL5L.AC_UL480_QL65.jpg', // Home Related
    'https://m.media-amazon.com/images/I/818B-inh8EL.AC_SY200.jpg', // Beauty & Personal Care
    'https://m.media-amazon.com/images/I/71ncWmjwSAL.AC_UL480_QL65.jpg',  // Electronics
    'https://m.media-amazon.com/images/I/71RNIRg3xFL.AC_UL480_QL65.jpg'
  ];
  getCategoryImage(index: number): string {
    if (index >= 0 && index < this.categoryImages.length) {
      return this.categoryImages[index];
    } else {
      console.log("Navigating to details for product ID:");
      return '';
}

}

// NavigateToDetails(proId: number) {
//   console.log("Navigating to details for product ID:", proId);
//   console.log("Selected category ID:", this.selectedCategoryId);
//   this.router.navigateByUrl(`/Details/${proId}/${this.selectedCategoryId}`);
// }
NavigateToDetails(proId: number) {
  const state = {
      pageNumber: this.pageNumber,
      selectedCategoryId: this.selectedCategoryId,
  };
  debugger
  console.log("Navigating to details for product ID:", proId);
  console.log("Selected category ID:", this.selectedCategoryId);
  localStorage.setItem('searchState', JSON.stringify(state));
  this.router.navigateByUrl(`/Details/${proId}/${this.selectedCategoryId}`);
}

RandomProducts(): void {
  
    this.prd.getAllProducts(this.pageSize, this.pageNumber).subscribe({
      next: (res: Iproduct[]) => {
        this.searchResults = res; 
        console.log("allll",res)
        this.randomProducts = this.getRandomProducts(this.searchResults);
      },
      error: (err) => {
        console.error('Error fetching random products:', err);
      }
    });
    this.prd.getproudectsbycatogry(3,this.pageSize, this.pageNumber).subscribe({
      next: (res: Iproduct[]) => {
        this.searchResults = res; 
        console.log("allll",res)
        this.randomProducts2 = this.getRandomProducts(this.searchResults);
      },
      error: (err) => {
        console.error('Error fetching random products:', err);
      }
    });
    this.prd.getproudectsbycatogry(4,this.pageSize, this.pageNumber).subscribe({
      next: (res: Iproduct[]) => {
        this.searchResults = res; 
        console.log("allll",res)
        this.randomProducts3 = this.getRandomProducts(this.searchResults);
      },
      error: (err) => {
        console.error('Error fetching random products:', err);
      }
    });
}

getRandomProducts(products: Iproduct[]): Iproduct[] {
  let randomProducts: Iproduct[] = [];
  let maxIndex = Math.min(20, products.length);
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




// NavigateToDetails(proId: number) {
//   this.router.navigateByUrl(`/Details/${proId}`);
//   console.log("naaaaaaaaaav",proId)
// }
// NavigateToDetails(proId: number) {
//   this.router.navigateByUrl(`/Details/${proId}/${this.selectedCategoryId}`);
// }
// NavigateToDetails(proId: number) {
//   this.router.navigateByUrl(`/Details/${proId}/${this.selectedCategoryId}`);
//   console.log("nnnnnnnnnnnnav",proId,this.selectedCategoryId)
// }


}
