import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './Components/footer/footer.component';
import { HeaderComponent } from './Components/header/header.component';
import { NavBarComponent } from './Components/nav-bar/nav-bar.component';
import { HomeComponent } from './Components/home/home.component';
import { ProductsComponent } from './Components/products/products.component';
import { OrderComponent } from './Components/order/order.component';
import { ReviewComponent } from './Components/review/review.component';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { NgxPayPalModule } from 'ngx-paypal';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FooterComponent,HeaderComponent,NavBarComponent,HomeComponent,RouterOutlet,NgxPayPalModule,NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'lecture1';
  constructor(private translate: TranslateService) {
   this.translate.setDefaultLang('en');
   this.translate.use(localStorage.getItem('lang') || 'en');
  
  }
}
