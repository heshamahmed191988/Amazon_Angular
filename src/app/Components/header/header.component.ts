import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Icategory } from '../../models/icategory';
import { CategoryServiceService } from '../../services/category-service.service';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../register/register.component';
import { ICartService } from '../../services/icart.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
//import { RouteService } from '../../services/route.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,CommonModule,RegisterComponent,RouterModule,TranslateModule,FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  public totalITeam:number=0;
  isloggd: boolean = false;
  categories: Icategory[] = [];
  lang="";
  searchQuery: string = '';
  selectedCategoryId: number = 0;
  user:string=''



  constructor(private authService: AuthService, private router: Router,
    private CategoryService:CategoryServiceService,private _cart:ICartService,private translate:TranslateService) {}
  ngOnInit(): void {
 this.Username();
    // this.isloggd = this.authService.isLoggedIn();
    this.authService.getloggedstatus().subscribe((loggedStatus) => {
      this.isloggd = loggedStatus;
      this.translate.use(this.lang); // Use the language with TranslateService

      // Subscribe to language changes
      this.translate.onLangChange.subscribe(langChangeEvent => {
        this.lang = langChangeEvent.lang;
        // Optionally, refresh data that depends on the current language here
      });
      this.CategoryService.getAllCategory().subscribe({
        next: (res) => {
          this.categories = res;
          //console.log(this.categories)
        },
        error: (error) => {
          console.error('Error fetching categories:', error);
        }
      });
      this._cart.getProduct()
      .subscribe(res=>{
       this.totalITeam=res.length;
   
    })
    
    })
 this.lang=localStorage.getItem('lang')||'en';
 
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


  selectlanguages(event:any){
  this.translate.use(event.target.value)
  
  }
  Username(){
    this.authService.getCurrentUserDetails().subscribe(res =>{
      this.user = res.userName;
      console.log(res.userName);
    })
  }
  // changelanguage(lang:any) {
  // {
  //   const selectlanguage = lang.target.value;
  //   localStorage.setItem('lang', selectlanguage);
  //   this.translate.use(selectlanguage);
  // }
  changelanguage(lang: any) {
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
   
  }
  searchProducts(): void {
    // Trim the searchQuery to ensure we don't navigate with just whitespace
    const trimmedSearchQuery = this.searchQuery.trim();
  
    // Base URL for navigation
    let url = '/SearchForProudectComponent';
  
    // Determine if there's a valid category selected (not "All")
    const hasValidCategory = this.selectedCategoryId > 0;
  
    // Determine if there's a valid search query
    const hasSearchQuery = trimmedSearchQuery !== '';
  
    // Construct the URL based on the presence of a valid category and/or search query
    if (hasValidCategory && hasSearchQuery) {
      // If both category and search query are valid, include both in the URL
      url += `/${this.selectedCategoryId}/${trimmedSearchQuery}`;
    } else if (hasValidCategory) {
      // If only the category is valid (and not "All"), include it in the URL
      url += `/${this.selectedCategoryId}`;
    } else if (hasSearchQuery) {
      // If only the search query is valid, include it in the URL
      url += `/${trimmedSearchQuery}`;
    }
  
    // Navigate to the constructed URL
    this.router.navigateByUrl(url);
  }
  
  getCategoryName(category: Icategory): string {
    return this.lang === 'en' ? category.nameEn : category.nameAr;
  }
  selectCategory(categoryId: number) {
    this.selectedCategoryId = categoryId;
  }
  onCategoryChange(): void {
    this.router.navigate(['/SearchForProudectComponent',{
        name: this.searchQuery,
        categoryId: this.selectedCategoryId
    }]);
}
}



 




