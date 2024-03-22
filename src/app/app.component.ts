import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './Components/footer/footer.component';
import { HeaderComponent } from './Components/header/header.component';
import { NavBarComponent } from './Components/nav-bar/nav-bar.component';
import { SideBarComponent } from './Components/side-bar/side-bar.component';
import { HomeComponent } from './Components/home/home.component';
import { ProductsComponent } from './Components/products/products.component';
import { EgyptianIdDatePipe } from './pipes/egyptian-id-date-pipe.pipe';
import { OrderComponent } from './Components/order/order.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FooterComponent,HeaderComponent,NavBarComponent,SideBarComponent,HomeComponent,ProductsComponent,EgyptianIdDatePipe,OrderComponent,RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'lecture1';
}
