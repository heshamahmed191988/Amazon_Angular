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
import { AddressComponent } from './Components/address/address.component';
import { MainComponent } from './Components/main/main.component';
import { AdminComponent } from './Components/admin/admin.component';
import { EditUserComponent } from './Components/edit-user/edit-user.component';
import { OrderDetailsComponent } from './Components/order-details/order-details.component';
import { SuccessfullyComponent } from './Components/successfully/successfully.component';

export const routes: Routes = [
    {
        path: '', 
        component: MainLayoutComponent,
        children: [
            {path: '', redirectTo: 'main', pathMatch: 'full'},
            {path: 'Home', component: ProductsComponent,},
            {path: 'main', component: MainComponent,},
            {path: 'Order', component: OrderComponent,canActivate:[authGuard]},
            {path: 'Cart', component: CartComponent,},
            {path: 'Admin', component: AdminComponent,},
            {path: 'Edit', component: EditUserComponent,},
            {path: 'Details/:id/Cart', component: CartComponent},
            { path: 'OrderDetails/:orderid', component: OrderDetailsComponent},
            { path: 'PaymentResult', component: SuccessfullyComponent},

            {path: 'review', component: ReviewComponent,},
            {path: 'address', component: AddressComponent,canActivate:[authGuard]},
            {path: 'About', component: AboutUsComponent},
            {path: 'ContactUs', component: ContactUsComponent},
            {path: 'SearchForProudectComponent/:name', component: SearchForProudectComponentComponent },
            {path: 'SearchForProudectComponent/:categoryId/:name', component: SearchForProudectComponentComponent },
            { path: 'SearchForProudectComponent', component: SearchForProudectComponentComponent },
            {path: 'Details/:id/:selectedCategoryId', component: ProductDetailsComponent},            // canActivate:[authGuard]
        ],
    },
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},

    {path: '**', component: NotFoundComponent}
];