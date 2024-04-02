import { Routes } from '@angular/router';
import { OrderComponent } from './Components/order/order.component';
import { AboutUsComponent } from './Components/about-us/about-us.component';
import { ContactUsComponent } from './Components/contact-us/contact-us.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { MainLayoutComponent } from './Components/main-layout/main-layout.component';
import { LoginComponent } from './Components/login/login.component';
import { ProductDetailsComponent } from './Components/product-details/product-details.component';
import { RegisterComponent } from './Components/register/register.component'; // Import the RegistrationComponent
import { authGuard } from './guards/auth.guard';
import { ProductsComponent } from './Components/products/products.component';
import { ReviewComponent } from './Components/review/review.component';
import { CartComponent } from './Components/cart/cart.component';
import { SearchForProudectComponentComponent } from './Components/search-for-proudect-component/search-for-proudect-component.component';
import { HomeComponent } from './Components/home/home.component';

export const routes: Routes = [
    {
        path: '', 
        component: MainLayoutComponent,
        children: [
            {path: '', redirectTo: 'Home', pathMatch: 'full'},
            {path: 'Home', component: HomeComponent,},
            {path: 'Order', component: OrderComponent,},
            {path: 'Cart', component: CartComponent,},
            {path: 'Details/:id/Cart', component: CartComponent},
            {path: 'review', component: ReviewComponent,},
            {path: 'About', component: AboutUsComponent},
            {path: 'ContactUs', component: ContactUsComponent},
            {path: 'SearchForProudectComponent/:name', component: SearchForProudectComponentComponent },
            {path: 'Details/:id', component: ProductDetailsComponent,canActivate:[authGuard]},
        ],
    },
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},

    {path: '**', component: NotFoundComponent}
];
